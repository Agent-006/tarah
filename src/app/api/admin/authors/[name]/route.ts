import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "../../../auth/[...nextauth]/options";

// DELETE /api/admin/authors/[name] - Delete a specific author
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authorName = decodeURIComponent(params.name);

    // Check if author exists
    const existingAuthor = await prisma.author.findUnique({
      where: { name: authorName },
    });

    if (!existingAuthor) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      );
    }

    // Check if author has blog posts
    const blogPostsCount = await prisma.blogPost.count({
      where: { authorName: existingAuthor.name },
    });

    if (blogPostsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete author with existing blog posts" },
        { status: 409 }
      );
    }

    // Delete the author
    await prisma.author.delete({
      where: { name: existingAuthor.name },
    });

    return NextResponse.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    return NextResponse.json(
      { error: "Failed to delete author" },
      { status: 500 }
    );
  }
}
