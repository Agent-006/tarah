import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

// This route handles setting a default address for the user.
export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: "Address ID is required" },
                { status: 400 }
            );
        }

        // First verify if the address exists and belongs to the user
        const address = await prisma.address.findUnique({
            where: {
                id,
                userId: session.user.id, // Ensure the address belongs to the user
            },
        });

        if (!address) {
            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            );
        }

        // use a transaction to ensure atomicity
        const isSet = await prisma.$transaction([
            // Set all addresses to non-default
            prisma.address.updateMany({
                where: { 
                    userId: session.user.id 
                },
                data: { 
                    isDefault : false 
                },
            }),
            // Set the specified address as default
            prisma.address.update({
                where: {
                    id,
                    userId: session.user.id, // Ensure the address belongs to the user
                },
                data: {
                    isDefault: true,
                },
            }),
        ]);

        if (!isSet) {
            return NextResponse.json(
                { message: "Failed to set default address" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Default address updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}