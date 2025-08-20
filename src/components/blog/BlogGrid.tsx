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
    const { 
        posts, 
        isLoading, 
        error, 
        meta, 
        fetchPosts 
    } = useBlogStore();

    useEffect(() => {
        // Fetch published posts on component mount
        fetchPosts({ published: "true" });
    }, [fetchPosts]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= meta.totalPages) {
            fetchPosts({ 
                page, 
                limit: meta.limit,
                published: "true"
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
        <div className="bg-white px-4 py-14 lg:px-32 min-h-screen">
            {/* Heading */}
            <div className="text-center mb-16">
                <p className="text-xs tracking-widest text-black uppercase font-semibold">
                    Our Blogs
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-black">
                    Find our all blogs from here
                </h1>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base">
                    our blogs are written from very research research and well
                    known writers so that we can provide you the best blog and
                    articles for you to read them all along
                </p>
                {/* CTA Button */}
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
                        // Handle image URL safely
                        const imageUrl = post.coverImage && post.coverImage.trim() !== "" 
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
                                    {/* Image */}
                                    <div className="relative overflow-hidden rounded-t-2xl">
                                        <Image
                                            src={imageUrl}
                                            alt={imageAlt}
                                            width={600}
                                            height={300}
                                            className="w-full h-64 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                        />
                                        {post.categories.length > 0 && (
                                            <span className="absolute top-4 left-4 bg-primary/90 text-secondary text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                                {post.categories[0].name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <CardContent className="flex flex-col justify-between flex-1 p-5">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">
                                                {post.publishedAt 
                                                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : new Date(post.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                }
                                            </p>
                                            <h3 className="text-lg font-bold mt-2 text-gray-900 group-hover:text-primary transition-colors duration-300">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                                                {post.excerpt || "No excerpt available"}
                                            </p>
                                            
                                            {/* Tags */}
                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {post.tags.slice(0, 2).map((tag) => (
                                                        <span 
                                                            key={tag.id}
                                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Author + Read More */}
                                        <div className="flex items-center gap-2 mt-5">
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.15,
                                                    rotate: 8,
                                                    boxShadow:
                                                        "0 4px 24px rgba(0,0,0,0.15)",
                                                }}
                                                className="transition-transform duration-300 group-hover:scale-110"
                                            >
                                                <Avatar className="h-8 w-8 border border-primary/50 shadow-sm">
                                                    <AvatarImage
                                                        src={post.author.avatarUrl && post.author.avatarUrl.trim() !== "" 
                                                            ? post.author.avatarUrl 
                                                            : "/avatar.jpg"
                                                        }
                                                        alt={post.author.name}
                                                    />
                                                    <AvatarFallback>
                                                        {post.author.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </motion.div>
                                            <span className="text-sm text-gray-800 font-medium">
                                                {post.author.name}
                                            </span>
                                            
                                            {/* View count */}
                                            <span className="text-xs text-gray-400 ml-auto mr-2">
                                                {post._count.views} views
                                            </span>
                                            
                                            <motion.button
                                                whileHover={{ scale: 1.12, boxShadow: '0 2px 12px rgba(80,80,200,0.15)' }}
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
    );
}
