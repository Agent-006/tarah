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
              variantAttributes: true,
            },
          },
          attributes: true,
          coverImage: true,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...product,
        categories: product.categories.map((pc) => pc.categoryId),
        coverImage: product.coverImage || [],
        variants: product.variants.map((variant) => ({
          ...variant,
          images: variant.images.sort((a, b) => a.order - b.order),
        })),
      });
    }

    // Get all products
    const products = await prisma.product.findMany({
      include: {
        categories: { include: { category: true } },
        variants: {
          include: {
            images: {
              orderBy: { order: "asc" },
              take: 1, // Only get first image for listing
            },
            variantAttributes: true,
          },
        },
        coverImage: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      products.map((product) => ({
        ...product,
        categories: product.categories.map((pc) => pc.categoryId),
      }))
    );
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
    console.log("Received request body:", JSON.stringify(body, null, 2));

    const validatedData = adminProductsSchema.parse(body);
    console.log("Validated data:", JSON.stringify(validatedData, null, 2));

    // Validate that all category IDs exist before creating the product
    if (validatedData.categories && validatedData.categories.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: {
          id: {
            in: validatedData.categories,
          },
        },
        select: { id: true, name: true },
      });

      console.log("Requested category IDs:", validatedData.categories);
      console.log("Found categories:", existingCategories);

      if (existingCategories.length !== validatedData.categories.length) {
        const foundIds = existingCategories.map((c) => c.id);
        const missingIds = validatedData.categories.filter(
          (id) => !foundIds.includes(id)
        );
        return NextResponse.json(
          { error: `Categories not found: ${missingIds.join(", ")}` },
          { status: 400 }
        );
      }
    }

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
          create: validatedData.categories.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
        attributes: {
          create:
            validatedData.attributes?.map((attr) => ({
              name: attr.name,
              value: attr.value,
            })) || [],
        },
        coverImage: {
          create: validatedData.coverImage.map((image) => ({
            url: image.url,
            altText: image.altText || validatedData.name,
            isPrimary: image.isPrimary,
            order: image.order,
          })),
        },
        variants: {
          create: validatedData.variants.map((variant) => ({
            name: variant.name,
            sku: variant.sku,
            priceOffset: variant.priceOffset,
            variantAttributes: {
              create: variant.variantAttributes.map((attr) => ({
                name: attr.name,
                value: attr.value,
              })),
            },
            images: {
              create: variant.images
                .filter((img) => img.url) // Only create if URL exists
                .map((image) => ({
                  url: image.url,
                  altText: image.altText,
                  isPrimary: image.isPrimary,
                  order: image.order,
                })),
            },
            inventory: {
              create: {
                stock: variant.inventory.stock,
                lowStockThreshold: variant.inventory.lowStockThreshold,
              },
            },
          })),
        },
      },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        coverImage: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("PUT request body:", JSON.stringify(body, null, 2));

    const validatedData = adminProductsSchema.parse(body);
    console.log("PUT validated data:", JSON.stringify(validatedData, null, 2));

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
        },
      });

      // Update categories
      await prisma.productCategory.deleteMany({
        where: { productId: validatedData.id },
      });
      if (validatedData.categories.length > 0) {
        await prisma.productCategory.createMany({
          data: validatedData.categories.map((categoryId) => ({
            productId: validatedData.id!,
            categoryId,
          })),
        });
      }

      // Update attributes
      await prisma.productAttribute.deleteMany({
        where: { productId: validatedData.id },
      });
      if (validatedData.attributes.length > 0) {
        await prisma.productAttribute.createMany({
          data: validatedData.attributes.map((attr) => ({
            productId: validatedData.id!,
            name: attr.name,
            value: attr.value,
          })),
        });
      }

      // Update cover image
      await prisma.productImage.deleteMany({
        where: { productId: validatedData.id },
      });
      await prisma.productImage.createMany({
        data: validatedData.coverImage.map((image) => ({
          productId: validatedData.id!,
          url: image.url,
          altText: image.altText || validatedData.name,
          isPrimary: image.isPrimary,
          order: image.order,
        })),
      });

      // Update variants
      // const existingVariants = await prisma.productVariant.findMany({
      //   where: { productId: validatedData.id },
      //   select: { id: true },
      // });

      // Delete variants not in the update
      await prisma.productVariant.deleteMany({
        where: {
          productId: validatedData.id,
          NOT: {
            id: {
              in: validatedData.variants
                .map((v) => v.id)
                .filter((id): id is string => typeof id === "string"),
            },
          },
        },
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
            data: variantData,
          });

          // Update variant attributes
          await prisma.variantAttribute.deleteMany({
            where: { variantId: variant.id },
          });
          if (
            variant.variantAttributes &&
            variant.variantAttributes.length > 0
          ) {
            await prisma.variantAttribute.createMany({
              data: variant.variantAttributes.map((attr) => ({
                variantId: variant.id!,
                name: attr.name,
                value: attr.value,
              })),
            });
          }

          // Update variant images
          await prisma.productImage.deleteMany({
            where: { variantId: variant.id },
          });
          if (variant.images.length > 0) {
            await prisma.productImage.createMany({
              data: variant.images
                .filter((image) => image.url && image.url.length > 0) // Only create images with valid URLs
                .map((image) => ({
                  variantId: variant.id,
                  url: image.url,
                  altText: image.altText,
                  isPrimary: image.isPrimary,
                  order: image.order,
                })),
            });
          }

          // Update inventory
          await prisma.inventory.updateMany({
            where: { variantId: variant.id },
            data: {
              stock: variant.inventory.stock,
              lowStockThreshold: variant.inventory.lowStockThreshold,
            },
          });
        } else {
          // Create new variant
          const { productId, ...newVariantData } = variantData;
          await prisma.productVariant.create({
            data: {
              ...newVariantData,
              product: { connect: { id: validatedData.id } },
              variantAttributes:
                variant.variantAttributes &&
                variant.variantAttributes.length > 0
                  ? {
                      create: variant.variantAttributes.map((attr) => ({
                        name: attr.name,
                        value: attr.value,
                      })),
                    }
                  : undefined,
              images:
                variant.images.filter((img) => img.url && img.url.length > 0)
                  .length > 0
                  ? {
                      create: variant.images
                        .filter((image) => image.url && image.url.length > 0)
                        .map((image) => ({
                          url: image.url,
                          altText: image.altText,
                          isPrimary: image.isPrimary,
                          order: image.order,
                        })),
                    }
                  : undefined,
              inventory: {
                create: {
                  stock: variant.inventory.stock,
                  lowStockThreshold: variant.inventory.lowStockThreshold,
                },
              },
            },
          });
        }
      }

      return await prisma.product.findUnique({
        where: { id: validatedData.id },
        include: {
          variants: {
            include: {
              images: true,
              variantAttributes: true,
              inventory: true,
            },
          },
          coverImage: true,
          attributes: true,
          categories: { include: { category: true } },
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update product",
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
        where: { productId: id },
      }),
      prisma.productAttribute.deleteMany({
        where: { productId: id },
      }),
      prisma.variantAttribute.deleteMany({
        where: { variant: { productId: id } },
      }),
      prisma.inventory.deleteMany({
        where: { variant: { productId: id } },
      }),
      prisma.productImage.deleteMany({
        where: {
          OR: [
            { productId: id }, // Delete cover images
            { variant: { productId: id } }, // Delete variant images
          ],
        },
      }),
      prisma.productVariant.deleteMany({
        where: { productId: id },
      }),
      prisma.product.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
