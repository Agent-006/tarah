"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPostWithRelations } from "@/store/blog/blogStore";

interface PopularPostCardProps {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    coverImageAlt?: string | null;
    publishedAt?: Date | null;
    createdAt: Date;
    author: {
        name: string;
        avatarUrl?: string | null;
    };
    categories: Array<{ name: string }>;
    _count: {
        views: number;
    };
}

export default function PopularPostCard({
    id,
    title,
    slug,
    excerpt,
    coverImage,
    coverImageAlt,
    publishedAt,
    createdAt,
    author,
    categories,
    _count
}: PopularPostCardProps) {
    // Use a placeholder image if coverImage is null/empty
    const imageUrl = coverImage && coverImage.trim() !== "" 
        ? coverImage 
        : "/placeholder-blog.jpg";

    const imageAlt = coverImageAlt || title || "Blog post image";

    const displayDate = publishedAt 
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    return (
        <Link href={`/blogs/${slug}`} className="group block">
            <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="relative h-48 w-full">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {categories.length > 0 && (
                        <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {categories[0].name}
                        </span>
                    )}
                </div>
                
                <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                        {displayDate} • {_count.views} views
                    </p>
                    
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                        {title}
                    </h3>
                    
                    {excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {excerpt}
                        </p>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                                src={author.avatarUrl || "/avatar.jpg"}
                                alt={author.name}
                                fill
                                sizes="24px"
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                            {author.name}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
