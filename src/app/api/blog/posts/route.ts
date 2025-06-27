import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";
import { blogPostSchema } from "@/schemas/blog/blogSchema";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category") || "";
        const tag = searchParams.get("tag") || "";
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        // Filter directly on categories and tags arrays
        const where: any = {
            published: true,
            ...(category && {
                categories: { some: { slug: category } },
            }),
            ...(tag && {
                tags: { some: { slug: tag } },
            }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { excerpt: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: {
                    author: { select: { id: true, fullName: true } },
                    categories: true,
                    tags: true,
                },
                orderBy: { publishedAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.blogPost.count({
                where,
            }),
        ]);

        return NextResponse.json({
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = blogPostSchema.parse(body);

        const post = await prisma.blogPost.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                coverImage: data.coverImage,
                published: data.published,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
                author: { connect: { id: session.user.id } },
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                ...(data.categories && {
                    categories: {
                        connect: data.categories.map((catId) => ({
                            id: catId,
                        })),
                    },
                }),
                ...(data.tags && {
                    tags: {
                        connect: data.tags.map((tagId) => ({
                            id: tagId,
                        })),
                    },
                }),
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create blog post" },
            { status: 500 }
        );
    }
}