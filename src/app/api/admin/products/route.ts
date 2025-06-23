// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { adminProductsSchema } from "@/schemas/adminSchema/adminProductsSchema";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
            categories: { include: { category: true } },
            variants: {
                include: { 
                images: true,
                inventory: true,
                attributes: true
                }
            },
            attributes: true,
            }
        });

        if (!product) {
            return NextResponse.json(
            { error: "Product not found" }, 
            { status: 404 }
            );
        }

        return NextResponse.json({
            ...product,
            categories: product.categories.map(pc => pc.categoryId),
            variants: product.variants.map(variant => ({
            ...variant,
            images: variant.images.sort((a, b) => a.order - b.order)
            }))
        });
        }

        // Get all products
        const products = await prisma.product.findMany({
        include: {
            categories: { include: { category: true } },
            variants: {
            include: {
                images: {
                orderBy: { order: 'asc' },
                take: 1 // Only get first image for listing
                }
            }
            }
        },
        orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(products.map(product => ({
        ...product,
        categories: product.categories.map(pc => pc.categoryId)
        })));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = adminProductsSchema.parse(body);

        const product = await prisma.product.create({
        data: {
            name: validatedData.name,
            slug: validatedData.slug,
            description: validatedData.description,
            basePrice: validatedData.basePrice,
            discountedPrice: validatedData.discountedPrice,
            published: validatedData.published,
            featured: validatedData.featured,
            categories: {
            create: validatedData.categories.map(categoryId => ({
                category: { connect: { id: categoryId } }
            }))
            },
            attributes: {
            create: validatedData.attributes?.map(attr => ({
                name: attr.name,
                value: attr.value
            })) || []
            },
            variants: {
            create: validatedData.variants.map(variant => ({
                name: variant.name,
                sku: variant.sku,
                priceOffset: variant.priceOffset,
                attributes: {
                create: variant.attributes.map(attr => ({
                    name: attr.name,
                    value: attr.value
                }))
                },
                images: {
                create: variant.images
                    .filter(img => img.url) // Only create if URL exists
                    .map(image => ({
                    url: image.url,
                    altText: image.altText,
                    isPrimary: image.isPrimary,
                    order: image.order
                    }))
                },
                inventory: {
                create: {
                    stock: variant.inventory.stock,
                    lowStockThreshold: variant.inventory.lowStockThreshold
                }
                }
            }))
            }
        },
        include: {
            variants: {
            include: {
                images: true
            }
            }
        }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json(
        { 
            error: error instanceof Error ? error.message : "Failed to create product"
        },
        { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const validatedData = adminProductsSchema.parse(body);

        if (!validatedData.id) {
        return NextResponse.json(
            { error: "Product ID is required for update" },
            { status: 400 }
        );
        }

        // Use transaction for atomic updates
        const product = await prisma.$transaction(async (prisma) => {
        // Update product base info
        await prisma.product.update({
            where: { id: validatedData.id },
            data: {
            name: validatedData.name,
            slug: validatedData.slug,
            description: validatedData.description,
            basePrice: validatedData.basePrice,
            discountedPrice: validatedData.discountedPrice,
            published: validatedData.published,
            featured: validatedData.featured,
            }
        });

        // Update categories
        await prisma.productCategory.deleteMany({
            where: { productId: validatedData.id }
        });
        await prisma.productCategory.createMany({
            data: validatedData.categories.map(categoryId => ({
            productId: validatedData.id!,
            categoryId
            }))
        });

        // Update attributes
        await prisma.productAttribute.deleteMany({
            where: { productId: validatedData.id }
        });
        await prisma.productAttribute.createMany({
            data: validatedData.attributes.map(attr => ({
            productId: validatedData.id!,
            name: attr.name,
            value: attr.value
            }))
        });

        // Update variants
        const existingVariants = await prisma.productVariant.findMany({
            where: { productId: validatedData.id },
            select: { id: true }
        });

        // Delete variants not in the update
        await prisma.productVariant.deleteMany({
            where: {
                productId: validatedData.id,
                NOT: {
                    id: { in: validatedData.variants.map(v => v.id).filter((id): id is string => typeof id === "string") }
                }
            }
        });

        // Upsert variants
        for (const variant of validatedData.variants) {
            const variantData = {
            name: variant.name,
            sku: variant.sku,
            priceOffset: variant.priceOffset,
            productId: validatedData.id,
            };

            if (variant.id) {
            // Update existing variant
            await prisma.productVariant.update({
                where: { id: variant.id },
                data: variantData
            });

            // Update variant attributes
            await prisma.variantAttribute.deleteMany({
                where: { variantId: variant.id }
            });
            await prisma.variantAttribute.createMany({
                data: variant.attributes.map(attr => ({
                variantId: variant.id!,
                name: attr.name,
                value: attr.value
                }))
            });

            // Update variant images
            await prisma.productImage.deleteMany({
                where: { variantId: variant.id }
            });
            await prisma.productImage.createMany({
                data: variant.images.map(image => ({
                variantId: variant.id,
                url: image.url,
                altText: image.altText,
                isPrimary: image.isPrimary,
                order: image.order
                }))
            });

            // Update inventory
            await prisma.inventory.updateMany({
                where: { variantId: variant.id },
                data: {
                stock: variant.inventory.stock,
                lowStockThreshold: variant.inventory.lowStockThreshold
                }
            });
            } else {
            // Create new variant
            const { productId, ...newVariantData } = variantData;
            const newVariant = await prisma.productVariant.create({
                data: {
                ...newVariantData,
                product: { connect: { id: validatedData.id } },
                attributes: {
                    create: variant.attributes.map(attr => ({
                    name: attr.name,
                    value: attr.value
                    }))
                },
                images: {
                    create: variant.images.map(image => ({
                    url: image.url,
                    altText: image.altText,
                    isPrimary: image.isPrimary,
                    order: image.order
                    }))
                },
                inventory: {
                    create: {
                    stock: variant.inventory.stock,
                    lowStockThreshold: variant.inventory.lowStockThreshold
                    }
                }
                }
            });
            }
        }

        return await prisma.product.findUnique({
            where: { id: validatedData.id },
            include: {
            variants: {
                include: {
                images: true,
                attributes: true,
                inventory: true
                }
            }
            }
        });
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Failed to update product:", error);
        return NextResponse.json(
        { 
            error: error instanceof Error ? error.message : "Failed to update product"
        },
        { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
        return NextResponse.json(
            { error: "Product ID is required" },
            { status: 400 }
        );
        }

        // Use transaction to ensure all related data is deleted
        await prisma.$transaction([
        prisma.productCategory.deleteMany({
            where: { productId: id }
        }),
        prisma.productAttribute.deleteMany({
            where: { productId: id }
        }),
        prisma.variantAttribute.deleteMany({
            where: { variant: { productId: id } }
        }),
        prisma.inventory.deleteMany({
            where: { variant: { productId: id } }
        }),
        prisma.productImage.deleteMany({
            where: { variant: { productId: id } }
        }),
        prisma.productVariant.deleteMany({
            where: { productId: id }
        }),
        prisma.product.delete({
            where: { id }
        })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json(
        { 
            error: error instanceof Error ? error.message : "Failed to delete product"
        },
        { status: 500 }
        );
    }
}