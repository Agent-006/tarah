"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

interface PopularPostCardProps {
    title: string;
    category: string;
    date: string;
    description: string;
    image: string;
    slug: string;
    imageAttribution: string;
}

export default function PopularPostCard({
    title,
    category,
    date,
    description,
    image,
    slug,
    imageAttribution,
}: PopularPostCardProps) {
    return (
        <Link href={`/blog/${slug}`} className="group block">
            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                <div className="relative overflow-hidden">
                    <Image
                        src={image}
                        alt={`${title} - ${imageAttribution}`}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {category}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                    <div className="mt-3">
                        <span className="text-sm font-medium text-gray-900 group-hover:underline">
                            Read More...
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
