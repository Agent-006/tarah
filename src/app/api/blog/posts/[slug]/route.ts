// src/app/api/blog/posts/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug },
        include: {
            author: { select: { id: true, fullName: true } },
            categories: true,
            tags: true,
            _count: { select: { views: true } },
        },
    });

    if (!post) {
        return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(post);
}