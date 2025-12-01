import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { v4 as uuid } from "uuid";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET /api/admin/authors - Fetch all authors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authors = await prisma.author.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

// POST /api/admin/authors - Create a new author
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, avatarUrl } = await request.json();

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Author name is required" },
        { status: 400 }
      );
    }

    // Check if author with this name already exists
    const existingAuthor = await prisma.author.findUnique({
      where: { name: name.trim() },
    });

    if (existingAuthor) {
      return NextResponse.json(
        { error: "Author with this name already exists" },
        { status: 409 }
      );
    }

    // Create the author
    const author = await prisma.author.create({
      data: {
        id: uuid(),
        name: name.trim(),
        bio: bio && typeof bio === "string" ? bio.trim() || null : null,
        avatarUrl:
          avatarUrl && typeof avatarUrl === "string"
            ? avatarUrl.trim() || null
            : null,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
