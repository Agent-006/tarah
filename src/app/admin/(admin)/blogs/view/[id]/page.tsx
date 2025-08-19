"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Hash,
  Tag,
  Globe,
  Image as ImageIcon,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  coverImageAlt?: string;
  ogImage?: string;
  ogImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  author?: {
    name: string;
    bio?: string;
    avatarUrl?: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  views: Array<{
    id: string;
    createdAt: string;
    userAgent?: string;
    ipAddress?: string;
  }>;
}

export default function ViewBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [status, session?.user?.role, router]);

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.id) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/admin/blog/posts/${params.id}`);
        setPost(response.data.post);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("Blog post not found");
          router.push("/admin/blogs");
        } else {
          toast.error("Failed to load blog post");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchPost();
    }
  }, [params?.id, status, session?.user?.role, router]);

  const handleDelete = async () => {
    if (!post || !confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/blog/posts/${post.id}`);
      toast.success("Blog post deleted successfully");
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Access denied
  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Blog Post Not Found</h1>
        <p className="text-gray-600">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push("/admin/blogs")} className="mt-4">
          Back to Blog List
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/blogs")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog List
            </Button>
            <div className="flex gap-3">
              <Button asChild variant="default">
                <Link href={`/admin/blogs/edit/${post.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Post"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
            <Badge variant={post.published ? "default" : "secondary"}>
              {post.published ? "Published" : "Draft"}
            </Badge>
          </div>

          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author?.name || post.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {post.publishedAt
                  ? `Published ${formatDate(post.publishedAt)}`
                  : `Created ${formatDate(post.createdAt)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.views.length} views</span>
            </div>
          </div>

          {post.excerpt && (
            <p className="text-lg text-gray-700 mt-4 italic border-l-4 border-blue-500 pl-4">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            {post.coverImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Cover Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.coverImageAlt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {post.coverImageAlt && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Alt Text:</strong> {post.coverImageAlt}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Details */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong className="text-sm font-medium">Slug:</strong>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                    {post.slug}
                  </p>
                </div>
                <div>
                  <strong className="text-sm font-medium">Status:</strong>
                  <p className="text-sm mt-1">
                    {post.published ? "Published" : "Draft"}
                  </p>
                </div>
                <div>
                  <strong className="text-sm font-medium">Created:</strong>
                  <p className="text-sm mt-1">{formatDate(post.createdAt)}</p>
                </div>
                <div>
                  <strong className="text-sm font-medium">Updated:</strong>
                  <p className="text-sm mt-1">{formatDate(post.updatedAt)}</p>
                </div>
                {post.canonicalUrl && (
                  <div>
                    <strong className="text-sm font-medium">Canonical URL:</strong>
                    <a
                      href={post.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {post.canonicalUrl}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Author */}
            {post.author && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Author
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {post.author.avatarUrl ? (
                        <Image
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{post.author.name}</h3>
                      {post.author.bio && (
                        <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            {post.categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SEO Information */}
            {(post.seoTitle || post.seoDescription || post.seoKeywords) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.seoTitle && (
                    <div>
                      <strong className="text-sm font-medium">SEO Title:</strong>
                      <p className="text-sm mt-1">{post.seoTitle}</p>
                    </div>
                  )}
                  {post.seoDescription && (
                    <div>
                      <strong className="text-sm font-medium">Meta Description:</strong>
                      <p className="text-sm mt-1">{post.seoDescription}</p>
                    </div>
                  )}
                  {post.seoKeywords && (
                    <div>
                      <strong className="text-sm font-medium">Keywords:</strong>
                      <p className="text-sm mt-1">{post.seoKeywords}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* OG Image */}
            {post.ogImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Social Share Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-[1.91/1] bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={post.ogImage}
                      alt={post.ogImageAlt || "Social share image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {post.ogImageAlt && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Alt Text:</strong> {post.ogImageAlt}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* View Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  View Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Views:</span>
                    <span className="text-sm font-medium">{post.views.length}</span>
                  </div>
                  {post.views.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Latest View:</span>
                      <span className="text-sm">
                        {formatDate(post.views[post.views.length - 1].createdAt)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
