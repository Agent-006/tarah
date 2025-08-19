import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


// Get all blog posts
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const posts = await prisma.blogPost.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        bio: true,
                        avatarUrl: true,
                    }
                },
                views: {
                    select: {
                        id: true,
                    }
                },
                categories: true,
                tags: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            posts,
            message: "Blog posts fetched successfully"
        });

    } catch (error: unknown) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Failed to fetch blog posts" 
        }, { status: 500 });
    }
}

// Create a new blog post
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        } = await request.json();

        // Validate required fields
        if (!title || !slug || !content || !authorName) {
            return NextResponse.json(
                { error: "Missing required fields: title, slug, content, and authorName are required" },
                { status: 400 }
            );
        }

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
            return NextResponse.json(
                { error: "Author not found" },
                { status: 400 }
            );
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
                publishedAt: publishedAt ? new Date(publishedAt) : null,
                // Handle categories and tags relationships if needed
            },
            include: {
                author: true,
                categories: true,
                tags: true,
                views: true,
            },
        });

        return NextResponse.json({
            post,
            message: "Blog post created successfully"
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Failed to create blog post" 
        }, { status: 500 });
    }
}