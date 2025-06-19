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
        const refunds = await prisma.refund.findMany({
            where: {
                transaction: {
                    order: {
                        userId: session.user.id,
                    }
                }
            },
            include: {
                transaction: {
                    include: {
                        order: {
                            include: {
                                items: {
                                    include: {
                                        variant: {
                                            include: {
                                                product: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // transform the data to match Refund interface
        const transformedRefunds = refunds.map(refund => ({
            id: refund.id,
            status: refund.status,
            amount: Number(refund.amount),
            reason: refund.reason || undefined,
            createdAt: refund.createdAt.toISOString(),
            transaction: {
                order: {
                    items: refund.transaction.order.items.map(item => ({
                        variant: {
                            product: {
                                name: item.variant.product.name,
                            }
                        },
                        quantity: item.quantity,
                    }))
                }
            }
        }));

        return NextResponse.json(
            transformedRefunds,
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching refunds:', error);
        return NextResponse.json(
            { error: "Failed to fetch refunds" },
            { status: 500 }
        );
    }
}
