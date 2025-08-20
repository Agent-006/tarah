// app/api/blog/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const listQuery = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(9),
    category: z.string().optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(["latest", "views"]).default("latest"),
    published: z.enum(["true", "false"]).optional(),
});

// list query for /api/blog/posts
export async function GET(req: NextRequest) {
    try {
        const q = listQuery.parse(Object.fromEntries(req.nextUrl.searchParams));

        const where: any = {};

        // Filter by published status
        if (q.published === "true") {
            where.published = true;
        }
        if (q.published === "false") {
            where.published = false;
        }

        // Search functionality
        if (q.search) {
            where.OR = [
                { title: { contains: q.search, mode: "insensitive" } },
                { excerpt: { contains: q.search, mode: "insensitive" } },
            ];
        }

        // Filter by category
        if (q.category) {
            where.categories = { 
                some: { 
                    slug: q.category 
                } 
            };
        }

        // Filter by tag
        if (q.tag) {
            where.tags = { 
                some: { 
                    slug: q.tag 
                } 
            };
        }

        // Sorting
        const orderBy =
            q.sort === "views"
                ? { views: { _count: "desc" } }
                : { publishedAt: "desc" as const };

        // Fetch total count and posts
        const [total, posts] = await Promise.all([
            prisma.blogPost.count({ where }),
            prisma.blogPost.findMany({
                where,
                orderBy: orderBy as any,
                skip: (q.page - 1) * q.limit,
                take: q.limit,
                include: {
                    author: true,
                    categories: true,
                    tags: true,
                    _count: { select: { views: true } },
                },
            }),
        ]);

        const meta = {
            total,
            page: q.page,
            limit: q.limit,
            pages: Math.ceil(total / q.limit),
        };

        return NextResponse.json({
            posts,
            meta
        });

    } catch (error: any) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { 
                message: "Failed to fetch blog posts", 
                error: error.message 
            }, 
            { status: 500 }
        );
    }
}
