// app/api/blog/posts/[slug]/view/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                  req.headers.get("x-real-ip") || 
                  "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        const post = await prisma.blogPost.findUnique({
            where: { slug: params.slug },
            select: { id: true }
        });

        if (!post) {
            return NextResponse.json({ 
                error: "Post not found" 
            }, { status: 404 });
        }
        
        // Check if this IP has already viewed this post
        const existingView = await prisma.blogView.findFirst({
            where: {
                postId: post.id,
                ipAddress: ip,
            }
        });

        if (!existingView) {
            await prisma.blogView.create({
                data: {
                    postId: post.id,
                    ipAddress: ip,
                    userAgent: userAgent
                }
            });
        }

        // Get total view count
        const totalViews = await prisma.blogView.count({
            where: { postId: post.id }
        });

        return NextResponse.json({
            message: existingView 
                ? "Welcome back! Thanks for revisiting this post." 
                : "Welcome! Your view has been recorded.",
            views: totalViews
        });

    } catch (error: any) {
        console.error('Error recording view:', error);
        return NextResponse.json(
            { error: "Failed to record view" }, 
            { status: 500 }
        );
    }
}