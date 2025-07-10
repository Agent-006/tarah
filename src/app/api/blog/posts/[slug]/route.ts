import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import prisma from "@/lib/db";


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const resolvedParams = await params;
        const post = await prisma.blogPost.findUnique({
            where: { slug: resolvedParams.slug },
            include: {
                author: { select: { id: true, fullName: true, email: true } },
                categories: true,
                tags: true,
            },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Track view (simplified - in production you might want to use a more robust tracking system)
        const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        await prisma.blogView.create({
            data: {
                postId: post.id,
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}