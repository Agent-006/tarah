import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Get a single blog post by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        const post = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                Author: {
                    select: {
                        name: true,
                        bio: true,
                        avatarUrl: true,
                    }
                },
                views: {
                    select: {
                        id: true,
                        createdAt: true,
                        userAgent: true,
                        ipAddress: true,
                    }
                },
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        return NextResponse.json({
            post,
            message: "Blog post fetched successfully"
        });

    } catch (error: unknown) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Failed to fetch blog post" 
        }, { status: 500 });
    }
}

// Update a blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
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

        // Check if post exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        // Check if slug is unique (exclude current post)
        if (slug !== existingPost.slug) {
            const duplicateSlug = await prisma.blogPost.findUnique({
                where: { slug },
            });

            if (duplicateSlug) {
                return NextResponse.json(
                    { error: "A blog post with this slug already exists" },
                    { status: 409 }
                );
            }
        }

        // Verify author exists if changed
        if (authorName && authorName !== existingPost.authorName) {
            const author = await prisma.author.findUnique({
                where: { name: authorName },
            });

            if (!author) {
                return NextResponse.json(
                    { error: "Author not found" },
                    { status: 400 }
                );
            }
        }

        // Update the blog post
        const updatedPost = await prisma.blogPost.update({
            where: { id },
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
                updatedAt: new Date(),
            },
            include: {
                Author: true,
                categories: true,
                tags: true,
                views: true,
            },
        });

        return NextResponse.json({
            post: updatedPost,
            message: "Blog post updated successfully"
        });

    } catch (error: unknown) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Failed to update blog post" 
        }, { status: 500 });
    }
}

// Delete a blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        console.log(`Deleting blog post with ID: ${id}`);

        // Check if post exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        // Delete the blog post
        await prisma.blogPost.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Blog post deleted successfully"
        });

    } catch (error: unknown) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Failed to delete blog post" 
        }, { status: 500 });
    }
}
