
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";

import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        type OrderItem = {
            variant: {
                product: { name: string };
                name: string;
            };
            quantity: number;
            price: number;
        };
        type Order = {
            id: string;
            user: { firstName: string; lastName: string; email: string };
            items: OrderItem[];
            totalAmount: number;
            status: string;
            paymentStatus: string;
            createdAt: string;
        };

        const formattedOrders = orders.map((order: Order) => ({
            id: order.id,
            customer: {
                name: `${order.user.firstName} ${order.user.lastName}`,
                email: order.user.email
            },
            items: order.items.map((item: OrderItem) => ({
                productName: item.variant.product.name,
                variantName: item.variant.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt
        }));

        return NextResponse.json(formattedOrders);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}