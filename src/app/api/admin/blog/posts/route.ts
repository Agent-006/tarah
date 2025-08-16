// src/app/api/admin/blog/posts/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// This route handles the API requests for blog posts in the admin panel
// It includes GET, POST, PUT, and DELETE methods for managing blog posts

// Get all blog posts
export async function GET() {
    try {
        const posts = await prisma.blogPost.findMany();

        if (!posts || posts.length === 0) {
            return NextResponse.json({
                posts: [],
                message: "No blog posts found"
            })
        } 

        return NextResponse.json({
            posts,
            message: "Blog posts fetched successfully"
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch blog posts" });
    }
}