// src/app/api/blog/posts/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
    req: NextRequest, 
    { params }: { params: { slug: string } }
) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { 
                slug: params.slug,
                published: true // Only return published posts
            },
            include: {
                author: true,
                categories: true,
                tags: true,
                _count: { 
                    select: { 
                        views: true 
                    } 
                },
            },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(post);

    } catch (error: any) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json(
            { 
                message: "Failed to fetch blog post", 
                error: error.message 
            }, 
            { status: 500 }
        );
    }
}