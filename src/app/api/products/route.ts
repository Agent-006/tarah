import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    
    try {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '8');
        const size = searchParams.get('size');
        const inStockOnly = searchParams.get('inStockOnly') === 'true';
        const category = searchParams.get('category');
        
        const where: any = {
            published: true,
        }

        // Fixed category filter
        if (category) {
            where.categories = {
                some: {
                    category: {
                        name: category
                    }
                }
            };
        }

        // Size filter if provided
        if (size) {
            where.variants = {
                some: {
                    attributes: {
                        some: {
                            name: 'Size',
                            value: size
                        }
                    }
                }
            };
        }

        // In-stock filter
        if (inStockOnly) {
            where.OR = [
                {
                    inventory: {
                        stock: {
                            gt: 0
                        }
                    }
                },
                {
                    variants: {
                        some: {
                            inventory: {
                                stock: {
                                    gt: 0
                                }
                            }
                        }
                    }
                }
            ];
        }

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    coverImage: true,
                    variants: {
                        include: {
                            variantAttributes: true,
                            inventory: true,
                            images: true
                        }
                    },
                    categories: {
                        include: {
                            category: true
                        }
                    },
                    inventory: true
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.product.count({
                where
            })
        ]);

        return NextResponse.json({
            products,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}