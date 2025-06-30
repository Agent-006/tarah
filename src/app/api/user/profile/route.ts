import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

// This route handles fetching the user's profile information.
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                fullName: true,
                phone: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// This route handles updating the user's profile information.
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { firstName, lastName, fullName, phone, newPassword } = await request.json();

        // If the user provided a new password, you would handle that here.
        // if (newPassword) {
        //     const hashedPassword = await bcrypt.hash(newPassword, 12);
        //     const isPasswordUpdatedUser = await prisma.user.update({
        //         where: { id: session.user.id },
        //         data: {
        //             firstName,
        //             lastName,
        //             fullName,
        //             phone,
        //             password: hashedPassword,
        //         },
        //         select: {
        //             id: true,
        //             email: true,
        //             firstName: true,
        //             lastName: true,
        //             fullName: true,
        //             phone: true,
        //         },
        //     });

        //     if (!isPasswordUpdatedUser) {
        //         return NextResponse.json(
        //             { 
        //                 updatedUser: isPasswordUpdatedUser,
        //                 message: "Failed to update password" 
        //             },
        //             { status: 400 }
        //         );
        //     }

        //     // Optionally, you can return a message indicating the password was updated successfully.
        //     return NextResponse.json(
        //         { message: "Profile and password updated successfully" },
        //         { status: 200 }
        //     );
        // }
        
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName,
                lastName,
                fullName,
                phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                fullName: true,
                phone: true,
            },
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                updatedUser, 
                message: "Profile updated successfully!"
            }, 
            {
            status: 200
            }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}