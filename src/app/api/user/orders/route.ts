import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        coverImage: true,
                                    }
                                },
                                images: true
                            }
                        }
                    }
                },
                address: true
            },
            orderBy: { createdAt: "desc" }
        });

        // transform the data to match Order interface
        const transformedOrders = orders.map(order => ({
            id: order.id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: Number(order.totalAmount),
            createdAt: order.createdAt.toISOString(),
            items: order.items.map(item => ({
                id: item.id,
                variant: {
                    id: item.variant.id,
                    name: item.variant.name,
                    product: {
                        name: item.variant.product.name,
                        images: item.variant.product.coverImage.map(img => ({ url: img.url }))
                        },
                    images: item.variant.images.map(img => ({ url: img.url }))
                },
                quantity: item.quantity,
                price: Number(item.price) 
            })),
            address: order.address ? {
                street: order.address.street,
                city: order.address.city,
                state: order.address.state,
                postalCode: order.address.postalCode,
            } : undefined
        }));

        return NextResponse.json(
            transformedOrders, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}