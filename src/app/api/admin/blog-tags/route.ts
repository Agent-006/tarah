import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET /api/admin/blog-tags - Fetch all blog tags
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await prisma.blogTag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog tags" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog-tags - Create a new blog tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug } = await request.json();

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { error: "Tag slug is required" },
        { status: 400 }
      );
    }

    // Check if tag with this slug already exists
    const existingTag = await prisma.blogTag.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the tag
    const tag = await prisma.blogTag.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating blog tag:", error);
    return NextResponse.json(
      { error: "Failed to create blog tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog-tags - Delete a blog tag
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const tagSlug = url.searchParams.get("slug");

    if (!tagSlug) {
      return NextResponse.json(
        { error: "Tag slug is required" },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await prisma.blogTag.findUnique({
      where: { slug: decodeURIComponent(tagSlug) },
      include: {
        posts: true,
      },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    // Check if tag has blog posts
    if (existingTag.posts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag with existing blog posts" },
        { status: 409 }
      );
    }

    // Delete the tag
    await prisma.blogTag.delete({
      where: { slug: existingTag.slug },
    });

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog tag:", error);
    return NextResponse.json(
      { error: "Failed to delete blog tag" },
      { status: 500 }
    );
  }
}
