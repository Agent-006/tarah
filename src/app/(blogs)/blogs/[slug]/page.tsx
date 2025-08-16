import prisma from "@/lib/db";
import ClientPost from "./post-client";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
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

export default function Page({ params }: { params: { slug: string } }) {
  // Render with client component to reuse your Zustand store + layout
  return <ClientPost slug={params.slug} />;
}
