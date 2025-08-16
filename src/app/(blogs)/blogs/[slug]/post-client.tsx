"use client";

import Image from "next/image";
import { useEffect } from "react";
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
        fetchPostBySlug,
        fetchPopularPosts,
        incrementViewCount,
    } = useBlogStore();

    useEffect(() => {
        fetchPostBySlug(slug);
        fetchPopularPosts();
    }, [slug]);

    // Increment view count for the current post when the component mounts
    useEffect(() => {
        incrementViewCount(slug);
    }, [slug, incrementViewCount]);

    const editor = useEditor({
        extensions: [StarterKit, Link],
        content:
            typeof currentPost?.content === "string" ? currentPost.content : "",
        editable: false,
    });

    if (!currentPost) return null;

    return (
        <div className="min-h-screen bg-white">
            <article className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-8">
                    <h1 className="heading-xl text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {currentPost.title}
                    </h1>

                    <AuthorProfile
                        name={currentPost.author?.fullName ?? "Anonymous"}
                        avatar="https://i.pravatar.cc/150?img=1"
                        socialLinks={{
                            facebook: "#",
                            linkedin: "#",
                            twitter: "#",
                            instagram: "#",
                        }}
                    />
                </header>

                {currentPost.coverImage && (
                    <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src={currentPost.coverImage}
                            alt={currentPost.title}
                            width={800}
                            height={450}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Rich content */}
                <div className="prose prose-lg max-w-none">
                    {editor ? <EditorContent editor={editor} /> : null}
                </div>
            </article>

            {/* Popular Posts */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="heading-lg text-gray-900">
                            Popular Post
                        </h2>
                        {/* Your Button */}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {popularPosts.map((post, i) => (
                            <PopularPostCard key={i} {...post} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Backlinks */}
            {Array.isArray(currentPost.backlinks) &&
                currentPost.backlinks.length > 0 && (
                    <section className="max-w-4xl mx-auto px-6 pb-12">
                        <h3 className="text-xl font-semibold mb-4">
                            Related Links
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {currentPost.backlinks.map((l: any, i: number) => (
                                <li key={i}>
                                    <a
                                        className="text-blue-600 underline"
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {l.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
        </div>
    );
}
