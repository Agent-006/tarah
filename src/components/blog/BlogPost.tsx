"use client";

import { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { QuoteIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useBlogStore } from "@/store/blog/blogStore";
import { PortableText } from "@/components/blog/PortableTextComponents";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const {
    currentPost: post,
    popularPosts,
    isLoading,
    error,
    fetchPostBySlug,
    fetchPopularPosts,
  } = useBlogStore();

  useEffect(() => {
    fetchPostBySlug(params.slug);
    fetchPopularPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-muted-foreground">
          The blog post you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 animate-fade-in">
      <div className="mb-4">
        <Link href="/blogs">
          <Button
            variant="outline"
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blogs</span>
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold leading-tight transition-colors duration-300 hover:text-primary">
        {post.title}
      </h1>

      <div className="flex items-center gap-4">
        <Avatar className="transition-transform duration-300 hover:scale-105 shadow-md">
          <AvatarImage src="/author.jpg" alt={post.author.name || "Author"} />
          <AvatarFallback>{post.author.name?.charAt(0) || "A"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.author.name || "Admin"}</p>
          <div className="flex space-x-2 text-sm text-muted-foreground">
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span>•</span>
            <span>{(post as any).views?.length || 0} views</span>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-xl transition-transform duration-500 hover:scale-105 shadow-lg"
          />
        </div>
      )}

      {/* <div className="prose max-w-none animate-fade-in-slow">
                <PortableText value={post.content} />
            </div> */}

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => {
            const t = (tag as any).tag ?? tag;
            return (
              <Link key={t.id} href={`/blogs?tag=${t.slug}`}>
                <Button variant="outline" size="sm">
                  #{t.name}
                </Button>
              </Link>
            );
          })}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Posts</h2>
          <Button asChild>
            <Link href="/blogs">View All</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {popularPosts.map((p) => (
            <Link href={`/blogs/${p.slug}`} key={p.id}>
              <Card className="group overflow-hidden shadow-md border-0 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-white animate-fade-in-slow">
                <div className="overflow-hidden">
                  <Image
                    src={p.coverImage || "/blog-placeholder.jpg"}
                    alt={p.title}
                    width={400}
                    height={250}
                    className="rounded-t-xl w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {((p.categories[0] as any)?.category ?? p.categories[0])
                      ?.name || "Uncategorized"}{" "}
                    • {formatDate(p.publishedAt || p.createdAt)}
                  </p>
                  <h3 className="text-lg font-semibold mt-2 group-hover:text-primary transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {p.excerpt}
                  </p>
                  <p className="text-sm font-semibold mt-2 underline group-hover:no-underline transition-all">
                    Read More…
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add subtle fade-in animations
// Add these to your global CSS (e.g., globals.css):
// .animate-fade-in { animation: fadeIn 0.7s ease; }
// .animate-fade-in-slow { animation: fadeIn 1.2s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }

const popularPosts = [
  {
    image: "https://source.unsplash.com/random/400x250?music,singer",
    title: "Who is the best singer on chart? Know him?",
    category: "Travel",
    date: "13 March 2023",
    description:
      "Chart by Billboard which ranks the all-time greatest artists...",
    slug: "best-singer-on-chart",
  },
  {
    image: "https://source.unsplash.com/random/400x250?business,export",
    title: "How to start export import business from home?",
    category: "Development",
    date: "11 March 2023",
    description:
      "Capitalize on low hanging fruit to identify a ballpark value...",
    slug: "start-export-import-business-from-home",
  },
  {
    image: "https://source.unsplash.com/random/400x250?chocolate,drink",
    title: "Make some drinks with chocolates chocolates and milk",
    category: "Food",
    date: "10 March 2023",
    description:
      "Organically grow the holistic world view of disruptive innovation...",
    slug: "drinks-with-chocolates-and-milk",
  },
];
