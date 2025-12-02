"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import PopularPostCard from "@/components/blog/PopularPostCard";
import { useBlogStore } from "@/store/blog/blogStore";

// RenderLexicalContent implementation from admin panel
const RenderLexicalContent = (contentRoot: any) => {
    const content = contentRoot?.content || contentRoot;
    if (!content || !content.root || !content.root.children) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    No content available.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    This article appears to be empty.
                </p>
            </div>
        );
    }

    const renderNode = (node: any, index: number): React.ReactNode => {
        if (!node) return null;

        // Handle text nodes
        if (node.type === "text") {
            const text = node.text || "";
            let element: React.ReactNode = text;

            // Apply text formatting using bitwise operations
            if (node.format) {
                if (node.format & 1) element = <strong>{element}</strong>; // Bold
                if (node.format & 2) element = <em>{element}</em>; // Italic
                if (node.format & 8) element = <u>{element}</u>; // Underline
                if (node.format & 16) element = <s>{element}</s>; // Strikethrough
                if (node.format & 32) {
                    // Code
                    element = (
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {element}
                        </code>
                    );
                }
            }

            return <span key={index}>{element}</span>;
        }

        // Handle paragraph nodes
        if (node.type === "paragraph") {
            const children = node.children?.map(
                (child: any, childIndex: number) =>
                    renderNode(child, childIndex)
            );

            // Check if paragraph is empty
            if (!children || children.length === 0) {
                return <div key={index} className="h-4"></div>; // Empty line
            }

            return (
                <p key={index} className="mb-4 leading-relaxed text-foreground">
                    {children}
                </p>
            );
        }

        // Handle heading nodes
        if (node.type === "heading") {
            const tag = node.tag || 1;
            const content = node.children?.map(
                (child: any, childIndex: number) =>
                    renderNode(child, childIndex)
            );

            const baseClasses = "font-bold tracking-tight text-foreground";

            switch (tag) {
                case 1:
                    return (
                        <h1
                            key={index}
                            className={`text-4xl ${baseClasses} mb-6 mt-8`}
                        >
                            {content}
                        </h1>
                    );
                case 2:
                    return (
                        <h2
                            key={index}
                            className={`text-3xl ${baseClasses} mb-5 mt-7`}
                        >
                            {content}
                        </h2>
                    );
                case 3:
                    return (
                        <h3
                            key={index}
                            className={`text-2xl ${baseClasses} mb-4 mt-6`}
                        >
                            {content}
                        </h3>
                    );
                case 4:
                    return (
                        <h4
                            key={index}
                            className={`text-xl ${baseClasses} mb-3 mt-5`}
                        >
                            {content}
                        </h4>
                    );
                case 5:
                    return (
                        <h5
                            key={index}
                            className={`text-lg ${baseClasses} mb-2 mt-4`}
                        >
                            {content}
                        </h5>
                    );
                case 6:
                    return (
                        <h6
                            key={index}
                            className={`text-base ${baseClasses} mb-2 mt-3`}
                        >
                            {content}
                        </h6>
                    );
                default:
                    return (
                        <h2
                            key={index}
                            className={`text-3xl ${baseClasses} mb-5 mt-7`}
                        >
                            {content}
                        </h2>
                    );
            }
        }

        // Handle list nodes
        if (node.type === "list") {
            const isOrdered = node.listType === "number";
            const ListComponent = isOrdered ? "ol" : "ul";

            return (
                <ListComponent
                    key={index}
                    className={`mb-6 ml-6 space-y-1 ${
                        isOrdered ? "list-decimal" : "list-disc"
                    }`}
                >
                    {node.children?.map((child: any, childIndex: number) =>
                        renderNode(child, childIndex)
                    )}
                </ListComponent>
            );
        }

        // Handle list item nodes
        if (node.type === "listitem") {
            return (
                <li key={index} className="leading-relaxed">
                    {node.children?.map((child: any, childIndex: number) =>
                        renderNode(child, childIndex)
                    )}
                </li>
            );
        }

        // Handle quote nodes
        if (node.type === "quote") {
            return (
                <blockquote
                    key={index}
                    className="border-l-4 border-border pl-6 py-2 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg"
                >
                    <div className="space-y-2">
                        {node.children?.map((child: any, childIndex: number) =>
                            renderNode(child, childIndex)
                        )}
                    </div>
                </blockquote>
            );
        }

        // Handle code block nodes
        if (node.type === "code") {
            return (
                <pre
                    key={index}
                    className="bg-muted border rounded-lg p-4 overflow-x-auto my-6"
                >
                    <code className="text-sm font-mono text-foreground">
                        {node.children
                            ?.map((child: any, childIndex: number) => {
                                // For code blocks, we want to preserve exact text without formatting
                                if (child.type === "text") {
                                    return child.text || "";
                                }
                                return renderNode(child, childIndex);
                            })
                            .join("")}
                    </code>
                </pre>
            );
        }

        // Handle line break
        if (node.type === "linebreak") {
            return <br key={index} />;
        }

        // Handle horizontal rule
        if (node.type === "horizontalrule") {
            return <hr key={index} className="my-8 border-border" />;
        }

        // Default: render children if they exist
        if (node.children) {
            return (
                <div key={index} className="my-2">
                    {node.children.map((child: any, childIndex: number) =>
                        renderNode(child, childIndex)
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <article className="prose prose-lg max-w-none">
            <div className="space-y-1">
                {content.root.children.map((node: any, index: number) =>
                    renderNode(node, index)
                )}
            </div>
        </article>
    );
};

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
                    <p>
                        The blog post you&apos;re looking for doesn&apos;t
                        exist.
                    </p>
                </div>
            </div>
        );
    }

    // Handle cover image safely
    const coverImageUrl =
        currentPost.coverImage && currentPost.coverImage.trim() !== ""
            ? currentPost.coverImage
            : null;
    const coverImageAlt = currentPost.coverImageAlt || currentPost.title;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center py-10 px-4">
                {/* Header */}
                <div className="mb-8 w-full flex flex-col items-start justify-center">
                    <div className="flex flex-col items-center gap-4 mb-4">
                        <h1 className="text-4xl font-bold text-gray-900 text-center">
                            {currentPost.title}
                        </h1>
                        <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                currentPost.published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {currentPost.published ? "Published" : "Draft"}
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Image
                                src={
                                    currentPost.author?.avatarUrl &&
                                    currentPost.author.avatarUrl.trim() !== ""
                                        ? currentPost.author.avatarUrl
                                        : "/avatar.jpg"
                                }
                                alt={currentPost.author?.name ?? "Anonymous"}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                            />
                            <span>
                                {currentPost.author?.name ?? "Anonymous"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>
                                {currentPost.publishedAt
                                    ? `Published ${new Date(
                                          currentPost.publishedAt
                                      ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })}`
                                    : `Created ${new Date(
                                          currentPost.createdAt
                                      ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })}`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center space-y-6">
                    {/* Cover Image */}
                    {coverImageUrl && (
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden w-full flex items-center justify-center">
                            <Image
                                src={coverImageUrl}
                                alt={coverImageAlt}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    {/* Content */}
                    <div className="prose prose-lg max-w-none w-full flex items-center justify-center">
                        <RenderLexicalContent content={currentPost.content} />
                    </div>
                    {/* Author Bio */}
                    {currentPost.author && (
                        <div className="w-full border-t pt-6 mt-10 flex items-center gap-4">
                            <Image
                                src={
                                    currentPost.author.avatarUrl &&
                                    currentPost.author.avatarUrl.trim() !== ""
                                        ? currentPost.author.avatarUrl
                                        : "/avatar.jpg"
                                }
                                alt={currentPost.author.name || "Anonymous"}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {currentPost.author.name || "Anonymous"}
                                </p>
                                {currentPost.author.bio && (
                                    <p className="text-sm text-gray-600">
                                        {currentPost.author.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Popular Posts */}
            <section className="bg-gray-50 py-16 w-full flex flex-col items-center justify-center">
                <div className="max-w-4xl w-full mx-auto px-6 flex flex-col items-center justify-center">
                    <div className="flex justify-center items-center mb-8 w-full">
                        <h2 className="heading-lg text-2xl font-bold text-gray-900 text-center">
                            Popular Posts
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 w-full justify-center">
                        {popularPosts.map((post) => (
                            <PopularPostCard key={post.id} {...post} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
