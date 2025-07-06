import BlogPost from "@/components/blog/BlogPost";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    return (
        <section className="bg-secondary flex flex-col items-center justify-center min-h-screen p-4">
            <BlogPost params={params} />
        </section>
    );
}
