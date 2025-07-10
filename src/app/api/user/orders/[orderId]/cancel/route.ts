
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

export async function PATCH(
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

    try {
        const resolvedParams = await params;
        const order = await prisma.order.update({
            where: {
                id: resolvedParams.orderId,
                userId: session.user.id,
                status: "PENDING", // Only allow cancellation for pending orders
            },
            data: {
                status: "CANCELLED",
                updatedAt: new Date(),
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found or cannot be cancelled" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Order cancelled successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error cancelling order:", error);
        return NextResponse.json(
            { error: "Failed to cancel order" },
            { status: 500 }
        );
    }
}