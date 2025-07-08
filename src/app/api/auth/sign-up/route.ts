
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@/lib/db";
import { signUpSchema } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
    try {

        // Parse the request body
        const body = await request.json();

        // validate the request body
        const validation = signUpSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: validation.error.flatten().fieldErrors
                },
                {
                    status: 400
                }
            );
        }
        
        const { email, password, firstName, lastName, fullName, phone } = validation.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { 
                    error: "User with this email already exists" 
                },
                { 
                    status: 409 
                }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                fullName,
                phone,
                role: "CUSTOMER", // Default role
            }
        });

        // Exclude the password from the response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { 
                user: userWithoutPassword, 
                message: "User created successfully"
            },
            {
                status: 201
            }
        );
        
    } catch (error) {
        console.error("Error during sign-up:", error);
        return NextResponse.json(
            { 
                error: "Internal server error" 
            },
            { 
                status: 500 
            }
        );
    }
}