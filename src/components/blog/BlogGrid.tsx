"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/store/blog/blogStore";

export default function BlogsPage() {
    const { posts, isLoading, error, meta, fetchPosts } = useBlogStore();

    console.log(`Posts: ${JSON.stringify(posts[0])}`);

    useEffect(() => {
        // Fetch published posts on component mount
        fetchPosts({ published: "true" });
    }, [fetchPosts]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= meta.totalPages) {
            fetchPosts({
                page,
                limit: meta.limit,
                published: "true",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white px-4 py-14 lg:px-32 min-h-screen">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading blogs...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white px-4 py-14 lg:px-32 min-h-screen">
                <div className="text-center text-red-500 h-64 flex flex-col justify-center">
                    <p>Error loading blogs: {error}</p>
                    <Button
                        onClick={() => fetchPosts({ published: "true" })}
                        className="mt-4 mx-auto"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <p className="text-xs tracking-widest text-black uppercase font-semibold">
                        Our Blogs
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-black">
                        Find all our blogs here
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base">
                        Our blogs are written by well-known writers and
                        thoroughly researched to provide you the best articles
                        to read.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link href="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Button className="text-base font-semibold px-8 py-3">
                                    Visit our store
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Blog Cards */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const imageUrl =
                                post.coverImage && post.coverImage.trim() !== ""
                                    ? post.coverImage
                                    : "/placeholder-blog.jpg";
                            const imageAlt = post.coverImageAlt || post.title;
                            return (
                                <Link
                                    href={`/blogs/${post.slug}`}
                                    key={post.id}
                                    className="no-underline group h-full"
                                >
                                    <Card className="overflow-hidden border-none border-gray-200 bg-secondary rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                                        {/* Cover Image */}
                                        {post.coverImage && (
                                            <div className="relative aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
                                                <Image
                                                    src={imageUrl}
                                                    alt={imageAlt}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="flex flex-col justify-between flex-1 p-5">
                                            {/* Title & Status */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                                                    {post.title}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        post.published
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-200 text-gray-500"
                                                    }`}
                                                >
                                                    {post.published
                                                        ? "Published"
                                                        : "Draft"}
                                                </span>
                                            </div>
                                            {/* Author & Date & Views */}
                                            <div className="flex items-center gap-4 text-gray-600 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8 border border-primary/50 shadow-sm">
                                                        {/* <AvatarImage
                                                            src={post.author.avatarUrl && post.author.avatarUrl.trim() !== "" 
                                                                ? post.author.avatarUrl 
                                                                : "/avatar.jpg"
                                                            }
                                                            alt={post.author.name}
                                                        /> */}
                                                        <AvatarFallback>
                                                            {/* {post.author.name.charAt(0)} */}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {/* <span className="text-sm font-medium">{post.author.name}</span> */}
                                                </div>
                                                <span className="text-xs">
                                                    {post.publishedAt
                                                        ? `Published ${new Date(
                                                              post.publishedAt
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  year: "numeric",
                                                                  month: "long",
                                                                  day: "numeric",
                                                              }
                                                          )}`
                                                        : `Created ${new Date(
                                                              post.createdAt
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  year: "numeric",
                                                                  month: "long",
                                                                  day: "numeric",
                                                              }
                                                          )}`}
                                                </span>
                                            </div>
                                            {/* Excerpt */}
                                            {post.excerpt && (
                                                <p className="text-sm text-gray-700 mt-2 italic border-l-4 border-blue-500 pl-4">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            {/* Categories */}
                                            {post.categories.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {post.categories.map(
                                                        (category) => (
                                                            <span
                                                                key={
                                                                    category.id
                                                                }
                                                                className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                            >
                                                                {category.name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                            {/* Tags */}
                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Read More */}
                                            <div className="flex justify-end mt-4">
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.12,
                                                        boxShadow:
                                                            "0 2px 12px rgba(80,80,200,0.15)",
                                                    }}
                                                    whileTap={{ scale: 0.96 }}
                                                    className="text-xs text-primary p-0 h-auto font-semibold group-hover:underline bg-transparent border-none outline-none cursor-pointer"
                                                    type="button"
                                                    tabIndex={-1}
                                                >
                                                    Read More →
                                                </motion.button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-3 text-center text-gray-500">
                            No blog posts available.
                        </div>
                    )}
                </div>
                {/* Pagination Controls */}
                {meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <Button
                            variant="outline"
                            className="px-3 py-1"
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: meta.totalPages }, (_, i) => (
                            <Button
                                key={i + 1}
                                variant={
                                    meta.page === i + 1 ? "default" : "outline"
                                }
                                className="px-3 py-1"
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            className="px-3 py-1"
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page === meta.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
