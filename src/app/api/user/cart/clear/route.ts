import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from "@/lib/db";

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await prisma.cart.update({
            where: { userId: session.user.id },
            data: {
                items: {
                    deleteMany: {} // Delete all related cart items
                }
            }
        });

        return NextResponse.json(
            { message: "Cart cleared successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error clearing cart:", error);
        return NextResponse.json(
            { error: "Failed to clear cart" },
            { status: 500 }
        );
    }
}