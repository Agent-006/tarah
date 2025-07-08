import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId, newPassword, verificationCode } = await request.json();

        if (!userId || !newPassword) {
            return NextResponse.json(
                { 
                    error: "User ID and new password are required" 
                },
                { 
                    status: 400 
                }
            );
        }

        // find user by ID
        const user = await prisma?.user.findFirst({
            where: {
                id: userId,
            }
        });

        if (!user) {
            return NextResponse.json(
                { 
                    error: "User not found" 
                },
                { 
                    status: 404 
                }
            );
        }

        // Check if the verification code matches
        if (user.verificationCode !== verificationCode) {
            return NextResponse.json(
                { 
                    error: "Invalid verification code" 
                },
                { 
                    status: 400 
                }
            );
        }

        // Here you should hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the user's password
        await prisma?.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword, // Ensure this is hashed in your application logic
                verificationCode: null, // Clear the verification code after successful reset
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Password reset successfully"
            },
            { 
                status: 200 
            }
        );
    } catch (error) {
        console.error("Error resetting password", error);
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