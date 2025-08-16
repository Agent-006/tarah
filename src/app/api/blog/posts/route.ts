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
    published: z.enum(["true", "false"]).optional(), // optional filter for admin
});

// list query for /api/blog/posts
export async function GET(req: NextRequest) {
    const q = listQuery.parse(Object.fromEntries(req.nextUrl.searchParams));

    const where: any = {};

    if (q.published === "true") {
        where.published = true;
    }
    if (q.published === "false") {
        where.published = false;
    }
    if (q.search) {
        where.OR = [
            { title: { contains: q.search, mode: "insensitive" } },
            { excerpt: { contains: q.search, mode: "insensitive" } },
        ];
    }
    if (q.category) {
        where.categories = { some: { slug: q.category } };
    }
    if (q.tag) {
        where.tags = { some: { slug: q.tag } };
    }

    const orderBy =
        q.sort === "views"
            ? { views: { _count: "desc" } }
            : { publishedAt: "desc" as const };

    const [total, posts] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({
            where,
            orderBy: orderBy as any, // Casting to any to bypass the type error
            skip: (q.page - 1) * q.limit,
            take: q.limit,
            include: {
                author: { select: { id: true, fullName: true } },
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
}

// FIXME: this endpoint should be in admin routes
// Create or update blog post schema
const backlinkItem = z.object({
    url: z.string().url("Invalid URL"),
    text: z.string().min(1, "Text cannot be empty"),
});

const postBody = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    excerpt: z.string().optional(),
    content: z.any(), // tiptap/editor.js JSON
    coverImage: z.string().url().optional(),
    ogImage: z.string().url().optional(),
    published: z.boolean().optional(),
    publishedAt: z.string().datetime().optional(),
    authorId: z.string().min(1),

    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
    backlinks: z.array(backlinkItem).optional(),

    categorySlugs: z.array(z.string()).optional(),
    tagSlugs: z.array(z.string()).optional(), 
})

export async function POST(req: NextRequest) {
    try {
        const data = postBody.parse(await req.json());

        const created = await prisma.blogPost.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                coverImage: data.coverImage,
                ogImage: data.ogImage,
                published: data.published ?? false,
                publishedAt: data.published ? data.publishedAt ? new Date(data.publishedAt) : new Date() : null,
                authorId: data.authorId,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                seoKeywords: data.seoKeywords,
                backlinks: data.backlinks ? data.backlinks : undefined,
                categories: data.categorySlugs?.length
                    ? { connect: data.categorySlugs.map(slug => ({ slug })) }
                    : undefined,
                tags: data.tagSlugs?.length
                    ? { connect: data.tagSlugs.map(slug => ({ slug })) }
                    : undefined,
            },
            include: {
                author: { select: { id: true, fullName: true } },
                categories: true,
                tags: true,
                _count: { select: { views: true } },
            },
        });

        return NextResponse.json(
            created, 
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json({ message: error.message ?? "Invalid data" }, { status: 400 });
    }
}