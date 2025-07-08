
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

// This route handles fetching a specific address by ID for the user.
export async function GET(request: Request, { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const address = await prisma.address.findUnique({
            where: {
                id: params.id,
                userId: session.user.id, // Ensure the address belongs to the user
            },
            select: {
                id: true,
                street: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
                isDefault: true,
            },
        });

        if (!address) {
            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            address,
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching address:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// This route handles updating a specific address by ID for the user.
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { street, city, state, postalCode, country, isDefault } = await request.json();

        // Validate required fields
        if (!street || !city || !state || !postalCode) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // first check if the existing address is default or not
        const existingAddress = await prisma.address.findUnique({
            where: { id: params.id },
        });

        if (!existingAddress) {
            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            );
        }

        const updatedData = {
            street,
            city,
            state,
            postalCode,
            country,
            isDefault: isDefault ?? existingAddress.isDefault, // Preserve existing default status if not provided
        }

        // Update the address
        const updatedAddress = await prisma.address.update({
            where: {
                id: params.id,
                userId: session.user.id, // Ensure the address belongs to the user
            },
            data: updatedData,
            select: {
                id: true,
                street: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
                isDefault: true,
            },
        });

        if (!updatedAddress) {
            return NextResponse.json(
                { message: "Failed to update address" },
                { status: 500 }
            );
        }

        // If the updated address is set as default, unset all other addresses
        if (updatedAddress.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                    id: { not: updatedAddress.id },
                },
                data: { isDefault: false },
            });
        }
        
        return NextResponse.json(
            updatedAddress,
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// This route handles deleting a specific address by ID for the user.
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        // Check if the address exists and belongs to the user
        const address = await prisma.address.findUnique({
            where: {
                id: params.id,
                userId: session.user.id, // Ensure the address belongs to the user
            },
        });

        if (!address) {
            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            );
        }

        // Don't allow deletion of default address
        if (address.isDefault) {
            return NextResponse.json(
                { message: "Cannot delete default address" },
                { status: 400 }
            );
        }

        // Delete the address
        await prisma.address.delete({
            where: {
                id: params.id,
                userId: session.user.id, // Ensure the address belongs to the user
            },
        });

        return NextResponse.json(
            { message: "Address deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}