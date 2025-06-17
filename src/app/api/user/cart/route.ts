import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from "@/lib/db";

// This route handles fetching the user's cart details.
export async function GET() {
    const session = await getServerSession(authOptions);

    if(!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const cart = await prisma.cart.findUnique({
            where: {
                userId: session.user.id
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: true
                            }
                        },
                        variant: {
                            include: {
                                attributes: true,
                                inventory: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(cart || { items: [] }); 
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

// This route handles adding an item to the user's cart.
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if(!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }  

    try {
        const { productId, variantId, quantity } = await request.json();

        // Get or create the user's cart
        let cart = await prisma.cart.upsert({
            where: { userId: session.user.id },
            update: {},
            create: {
                user: {
                    connect: {
                        id: session.user.id
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                }
            }
        });

        if(!cart) {
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            );
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.productId === productId 
            && item.variantId === variantId
        );

        if(existingItem) {
            // update quantity
            await prisma.cartItem.update({
                where: { 
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + quantity
                }
            });
        } else {
            // Add new item to cart with relation connections
            await prisma.cartItem.create({
                data: {
                    cart: {
                        connect: {
                            id: cart.id
                        }
                    },
                    product: {
                        connect: {
                            id: productId
                        }
                    },
                    variant: {
                        connect: {
                            id: variantId
                        }
                    },
                    quantity
                }
            });
        }

        return NextResponse.json(
            { message: "Item added to cart" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to add item to cart" },
            { status: 500 }
        );
    }
}

// This route handles removing an item from the user's cart.
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if(!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { productId, variantId } = await request.json();

        // Get the user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id }
        });

        if(!cart) {
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            );
        }

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId,
                variantId
            }
        });

        return NextResponse.json(
            { message: "Item removed from cart" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to remove item from cart" },
            { status: 500 }
        );
    }
}