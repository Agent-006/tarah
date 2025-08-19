import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET /api/admin/blog-categories - Fetch all blog categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.blogCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog-categories - Create a new blog category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, description } = await request.json();

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Check if category with this slug already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the category
    const category = await prisma.blogCategory.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description && typeof description === "string" ? description.trim() || null : null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating blog category:", error);
    return NextResponse.json(
      { error: "Failed to create blog category" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog-categories - Delete a blog category
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const categorySlug = url.searchParams.get("slug");

    if (!categorySlug) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug: decodeURIComponent(categorySlug) },
      include: {
        posts: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has blog posts
    if (existingCategory.posts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing blog posts" },
        { status: 409 }
      );
    }

    // Delete the category
    await prisma.blogCategory.delete({
      where: { slug: existingCategory.slug },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return NextResponse.json(
      { error: "Failed to delete blog category" },
      { status: 500 }
    );
  }
}
