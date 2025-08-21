import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Schema for creating a blog post
const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  content: z.any(), // JSON content from the editor
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  coverImageAlt: z.string().optional(),
  ogImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ogImageAlt: z.string().optional(),
  seoTitle: z
    .string()
    .max(60, "SEO title should be less than 60 characters")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "SEO description should be less than 160 characters")
    .optional(),
  seoKeywords: z.string().optional(),
  canonicalUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  authorName: z.string().min(1, "Author is required"),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

// Get all blog posts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      include: {
        Author: {
          select: {
            name: true,
            bio: true,
            avatarUrl: true,
          },
        },
        views: {
          select: {
            id: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      posts,
      message: "Blog posts fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch blog posts",
      },
      { status: 500 }
    );
  }
}

// Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the request body
    const validationResult = createBlogPostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      coverImageAlt,
      ogImage,
      ogImageAlt,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      categories,
      tags,
      authorName,
      published,
      publishedAt,
    } = validationResult.data;

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }

    // Verify author exists
    const author = await prisma.author.findUnique({
      where: { name: authorName },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 400 });
    }

    // Verify categories exist if provided
    if (categories && categories.length > 0) {
      const existingCategories = await prisma.blogCategory.findMany({
        where: { slug: { in: categories } },
        select: { slug: true },
      });

      const existingCategorySlugs = existingCategories.map((cat) => cat.slug);
      const invalidCategories = categories.filter(
        (slug) => !existingCategorySlugs.includes(slug)
      );

      if (invalidCategories.length > 0) {
        return NextResponse.json(
          { error: `Categories not found: ${invalidCategories.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Verify tags exist if provided
    if (tags && tags.length > 0) {
      const existingTags = await prisma.blogTag.findMany({
        where: { slug: { in: tags } },
        select: { slug: true },
      });

      const existingTagSlugs = existingTags.map((tag) => tag.slug);
      const invalidTags = tags.filter(
        (slug) => !existingTagSlugs.includes(slug)
      );

      if (invalidTags.length > 0) {
        return NextResponse.json(
          { error: `Tags not found: ${invalidTags.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        coverImageAlt: coverImageAlt || null,
        ogImage: ogImage || null,
        ogImageAlt: ogImageAlt || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        canonicalUrl: canonicalUrl || null,
        authorName,
        published: published || false,
        publishedAt: publishedAt
          ? new Date(publishedAt)
          : published
          ? new Date()
          : null,
        // Connect categories if provided
        ...(categories &&
          categories.length > 0 && {
            categories: {
              connect: categories.map((categorySlug: string) => ({
                slug: categorySlug,
              })),
            },
          }),
        // Connect tags if provided
        ...(tags &&
          tags.length > 0 && {
            tags: {
              connect: tags.map((tagSlug: string) => ({ slug: tagSlug })),
            },
          }),
      },
      include: {
        Author: {
          select: {
            name: true,
            bio: true,
            avatarUrl: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        views: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        post,
        message: "Blog post created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create blog post",
      },
      { status: 500 }
    );
  }
}
