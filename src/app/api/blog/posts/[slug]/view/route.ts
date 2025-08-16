// app/api/blog/posts/[slug]/view/route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug },
        select: { id: true }
    });

    if (!post) {
        return NextResponse.json({ 
            error: "Post not found" 
        }, 
        { 
            status: 404 
        });
    }
    
    // check if ip has already viewed this post
    const existingView = await prisma.blogView.findFirst({
        where: {
            postId: post.id,
            ipAddress: ip,
        }
    });
    // TODO: if the user ip already exists and the user revisits the post, we can show a random message like ["Welcome back!", "Seems like you love reading this post", "Thanks for revisiting!"] or something similar.

    if (!existingView) {
        await prisma.blogView.create({
            data: {
                postId: post.id,
                ipAddress: ip,
                userAgent: userAgent
            }
        });
    }

    return NextResponse.json({
        message: "Welcome to this post! Your view has been recorded."
    });
}