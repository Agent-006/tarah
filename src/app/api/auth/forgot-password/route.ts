import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendMail } from "@/helpers/sendForgotPasswordMail";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { 
                    error: "Email is required" 
                },
                { 
                    status: 400 
                }
            );
        }

        // Check if user exists
        const user = await prisma.user.findFirst({
            where: {
                email // Ensure email is unique
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

        console.log(user);

        const name = user?.fullName || "User";

        // Generate a Verification Code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Send verification email
        const emailResponse = await sendMail(
            email,
            name,
            verificationCode
        );

        if (!emailResponse.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: emailResponse.message 
                },
                { 
                    status: 500 
                }
            );
        }

        // Save the verification code to the database
        await prisma.user.update({
            where: { email },
            data: {
                verificationCode,
                verificationCodeExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
            }
        });

        return NextResponse.json(
            { 
                userId: user.id,
                success: true, 
                message: `Verification code sent to ${email} successfully` 
            },
            { 
                status: 200 
            }
        );        
    } catch (error) {
        console.error("Error in forgot password", error);
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