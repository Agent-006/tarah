import BlogPost from "@/components/blog/BlogPost";
import React, { Suspense } from "react";
import Loading from "./loading";

const BlogPostPage = ({
    params,
}: {
    params: { slug: string };
}) => {
    return (
        <section className="bg-secondary flex flex-col items-center justify-center min-h-screen p-4">
            <Suspense fallback={<Loading />}>
                <BlogPost params={params}/>
            </Suspense>
        </section>
    );
};

export default BlogPostPage;
