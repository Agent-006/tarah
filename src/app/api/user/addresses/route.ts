
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";

// This route handles fetching the user's addresses.
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
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

        if (!addresses || addresses.length === 0) {
            return NextResponse.json(
                { message: "No addresses found" },
                { status: 404 }
            );
        }

        return NextResponse.json(addresses, {
            status: 200
        });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// This route handles adding a new address for the user.
export async function POST(request: Request) {
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

        const addressData = {
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            country: country ? country.trim() : "India",
            isDefault: isDefault || false,
            user: {
                connect: {
                    id: session.user.id, // Ensure the address is linked to the user
                },
            },
        };

        const newAddress = await prisma.address.create({
            data: addressData,
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

        if (!newAddress) {
            return NextResponse.json(
                { message: "Failed to create address" },
                { status: 500 }
            );
        }

        // If the new address is set as default, update other addresses to not be default
        if (newAddress.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                    id: { not: newAddress.id },
                },
                data: { isDefault: false },
            });
        }

        return NextResponse.json(
            newAddress,
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}