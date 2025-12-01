import prisma from "@/lib/db";
import ClientPost from "./post-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post not found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  const image = post.ogImage || post.coverImage || undefined;

  return {
    title,
    description,
    keywords: post.seoKeywords,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "article",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params (app router may provide them as a promise in this codebase)
  const { slug } = await params;
  // Render with client component to reuse your Zustand store + layout
  return <ClientPost slug={slug} />;
}
