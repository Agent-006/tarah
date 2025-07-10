
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { RefundReason } from "@prisma/client";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { itemId, reason } = await request.json();

    try {
        const resolvedParams = await params;
        // Check if the order exists and belongs to the user and is in a returnable state
        const order = await prisma.order.findUnique({
            where: {
                id: resolvedParams.orderId,
                userId: session.user.id,
                status: "DELIVERED", // Only allow returns for delivered orders
            },
            include: {
                items: {
                    where: {
                        id: itemId, // Ensures the item to be returned is part of the order
                    }
                },
                transactions: true,
            }
        });

        if (!order || order.items.length === 0) {
            // If the order is not found or does not contain the specified item
            return NextResponse.json(
                { error: "Order not found or cannot be returned" },
                { status: 404 }
            );
        }

        const transaction = order.transactions[0];
        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction not found for this order" },
                { status: 404 }
            );
        }

        // Create a refund request
        const refund = await prisma.refund.create({
            data: {
                transaction: {
                    connect: {
                        id: transaction.id,
                    }
                },
                amount: order.totalAmount,
                reason: reason as RefundReason, // cast to RefundReason enum type
                status: "PENDING",
            }
        });

        return NextResponse.json(
            { message: "Return request submitted successfully", refund },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing return request:", error);
        return NextResponse.json(
            { error: "Failed to process request return" },
            { status: 500 }
        );
    }
}