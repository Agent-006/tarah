import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products or children
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated products" },
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with subcategories" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, parentId, imageUrl, featured } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Generate slug from name if name changed
    let slug = existingCategory.slug;
    if (name !== existingCategory.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        imageUrl: imageUrl || null,
        featured: featured || false,
      },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
