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

// Public blog post submission schema (for contact forms, guest posts, etc.)
const publicBlogSubmissionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  authorEmail: z.string().email("Valid email is required"),
  excerpt: z.string().max(500).optional(),
  seoKeywords: z.string().optional(),
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
          slug: q.category,
        },
      };
    }

    // Filter by tag
    if (q.tag) {
      where.tags = {
        some: {
          slug: q.tag,
        },
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
          Author: true,
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
      meta,
    });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch blog posts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Public blog post submission endpoint (for guest posts, submissions, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = publicBlogSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { title, content, authorName, authorEmail, excerpt, seoKeywords } =
      validationResult.data;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .replace(/^-|-$/g, "");

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    let finalSlug = slug;
    if (existingPost) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    // Check if author exists, create if not
    let author = await prisma.author.findUnique({
      where: { name: authorName },
    });

    if (!author) {
      author = await prisma.author.create({
        data: {
          id: `author-${Date.now()}`,
          name: authorName,
          bio: `Guest author: ${authorEmail}`,
        },
      });
    }

    // Create the blog post as draft (unpublished)
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content: content, // Store as plain text for now
        authorName: author.name,
        published: false, // Always create as draft for review
        seoKeywords: seoKeywords || null,
        createdAt: new Date(),
      },
      include: {
        Author: {
          select: {
            name: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message:
          "Blog post submission received successfully! It will be reviewed before publication.",
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: "under_review",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating blog post submission:", error);
    return NextResponse.json(
      {
        message: "Failed to submit blog post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
