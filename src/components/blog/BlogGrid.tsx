"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useBlogStore } from "@/store/blog/blogStore";

export default function BlogGrid() {
    const { posts, isLoading, error, fetchPosts } = useBlogStore();

    useEffect(() => {
        fetchPosts({ limit: 9, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-br from-secondary via-white to-gray-100 px-4 py-14 lg:px-32 min-h-screen">
            <div className="text-center mb-16">
                <p className="text-xs tracking-widest text-primary uppercase font-semibold">
                    Our Blogs
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-900">
                    Discover Inspiring Stories & Insights
                </h1>
                <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base">
                    Our blogs are crafted by experienced writers and researchers
                    to provide you with the best articles and insights. Dive in
                    and explore a world of knowledge!
                </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {posts ? (
                    posts.map((post) => (
                        <Link
                            href={`/blogs/${post.slug}`}
                            key={post.id}
                            className="no-underline group"
                        >
                            <Card className="overflow-hidden shadow-lg border-0 transition-transform duration-200 group-hover:-translate-y-2 group-hover:shadow-2xl bg-white">
                                <div className="relative">
                                    <Image
                                        src={
                                            post.coverImage ||
                                            "/blog-placeholder.jpg"
                                        }
                                        alt={post.title}
                                        width={600}
                                        height={400}
                                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {post.categories.length > 0 && (
                                        <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full shadow font-medium">
                                            {post.categories[0].category.name}
                                        </span>
                                    )}
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400">
                                            {formatDate(
                                                post.publishedAt ||
                                                    post.createdAt
                                            )}
                                        </span>
                                        <Button
                                            variant="link"
                                            className="text-xs text-primary p-0 h-auto font-semibold group-hover:underline"
                                        >
                                            Read More
                                        </Button>
                                    </div>
                                    <h3 className="text-xl font-bold mt-2 leading-snug text-gray-900 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 mt-6">
                                        <Avatar className="h-8 w-8 border-2 border-primary">
                                            <AvatarImage
                                                src="/avatar.jpg"
                                                alt={
                                                    post.author.fullName ||
                                                    "Author"
                                                }
                                            />
                                            <AvatarFallback>
                                                {post.author.fullName?.charAt(
                                                    0
                                                ) || "A"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-gray-700 font-medium">
                                            {post.author.fullName || "Admin"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500">
                        No blog posts available.
                    </div>
                )}
            </div>
        </div>
    );
}
