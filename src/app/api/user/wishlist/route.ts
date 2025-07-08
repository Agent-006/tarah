import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// GET request to fetch the user's wishlist
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        coverImage: true,
                        variants: {
                            include: {
                                inventory: true,
                                variantAttributes: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        );
    }
}

// POST request to add a product to the wishlist
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { productId } = await request.json();

        // check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                user: {
                    connect: {
                    id: session.user.id
                    }
                },
                product: {
                    connect: {
                        id: productId
                    }
                }
            },
            include: {
                product: {
                    include: {
                    coverImage: true,
                    variants: true
                    }
                }
            }
        });

        if (!wishlistItem) {
            return NextResponse.json(
                { error: "Failed to update wishlist" },
                { status: 500 }
            );
        }

        return NextResponse.json(wishlistItem, { status: 201 });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json(
            { error: "Failed to update wishlist" },
            { status: 500 }
        );
    }
}

// This DELETE function is a placeholder and does not implement any functionality.
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { productId } = await request.json();

        await prisma.wishlistItem.deleteMany({
            where: {
                userId: session.user.id,
                productId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        return NextResponse.json(
            { error: "Failed to remove item from wishlist" },
            { status: 500 }
        );
    }
}