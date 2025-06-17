import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const size = searchParams.get("size");
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    
    try {
        const whereClause: any = {
            published: true,
            variants: {
                some: {
                    inventory: {
                        stock: inStockOnly ? { gt: 0 } : undefined
                    }
                }
            }
        };

        if (size) {
            whereClause.variants.some.attributes = {
                some: {
                    name: "size",
                    value: size
                }
            };
        }

        const product = await prisma.product.findMany({
            where: whereClause,
            include: {
                variants: {
                    include: {
                        inventory: true,
                        attributes: true,
                        images: {
                            orderBy: { order: "asc" },
                            take: 1
                        }
                    }
                },
                categories: true,
                images: {
                    orderBy: { order: "asc" },
                    take: 1
                }
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalCount = await prisma.product.count({ where: whereClause });

        return NextResponse.json({
            products: product,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}