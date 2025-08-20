"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import PopularPostCard from "@/components/blog/PopularPostCard";
import AuthorProfile from "@/components/blog/AuthorProfile";
import { useBlogStore } from "@/store/blog/blogStore";

export default function BlogPost({ slug }: { slug: string }) {
    const {
        currentPost,
        popularPosts,
        isLoading,
        error,
        fetchPostBySlug,
        fetchPopularPosts,
        incrementViewCount,
    } = useBlogStore();

    useEffect(() => {
        fetchPostBySlug(slug);
        fetchPopularPosts();
    }, [slug, fetchPostBySlug, fetchPopularPosts]);

    // Increment view count for the current post when the component mounts
    useEffect(() => {
        if (currentPost) {
            incrementViewCount(slug);
        }
    }, [slug, incrementViewCount, currentPost]);

    const editor = useEditor({
        extensions: [StarterKit, Link],
        content: currentPost?.content || "",
        editable: false,
        immediatelyRender: false, // Fix SSR issue
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center text-red-600">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!currentPost) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Post not found</h2>
                    <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    // Handle cover image safely
    const coverImageUrl = currentPost.coverImage && currentPost.coverImage.trim() !== ""
        ? currentPost.coverImage
        : null;

    const coverImageAlt = currentPost.coverImageAlt || currentPost.title;

    return (
        <div className="min-h-screen bg-white">
            <article className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-8">
                    <h1 className="heading-xl text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {currentPost.title}
                    </h1>

                    <AuthorProfile
                        name={currentPost.author?.name ?? "Anonymous"}
                        avatar={currentPost.author?.avatarUrl && currentPost.author.avatarUrl.trim() !== ""
                            ? currentPost.author.avatarUrl
                            : "/avatar.jpg"
                        }
                        socialLinks={{
                            facebook: "#",
                            linkedin: "#",
                            twitter: "#",
                            instagram: "#",
                        }}
                    />
                </header>

                {coverImageUrl && (
                    <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src={coverImageUrl}
                            alt={coverImageAlt}
                            width={800}
                            height={450}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Rich content */}
                <div className="prose prose-lg max-w-none">
                    {editor && <EditorContent editor={editor} />}
                </div>
            </article>

            {/* Popular Posts */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="heading-lg text-gray-900">
                            Popular Posts
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {popularPosts.map((post) => (
                            <PopularPostCard key={post.id} {...post} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
