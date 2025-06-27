import BlogGrid from "@/components/blog/BlogGrid";
import React, { Suspense } from "react";
import Loading from "./loading";

const page = () => {
    return (
        <section className="bg-secondary flex flex-col items-center justify-center min-h-screen p-4">
            <Suspense fallback={<Loading />}>
                <BlogGrid />
            </Suspense>
        </section>
    );
};

export default page;
