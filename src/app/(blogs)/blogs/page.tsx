import React, { Suspense } from "react";
import BlogGrid from "@/components/blog/BlogGrid";
import Loading from "./loading";

const page = () => {
    return (
        <section className="bg-secondary flex flex-col items-center justify-center min-h-screen p-4">
            <Suspense fallback={<Loading />}>
                <BlogGrid />
            </Suspense>

            {/* <div className="flex flex-col items-center justify-center h-full mt-20">
                <h1 className="text-4xl font-bold text-primary mb-4">Blog Coming Soon!</h1>
                <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
                    We&apos;re working hard to bring you insightful articles and updates. Stay tuned for our upcoming blog posts!
                </p>
                <svg
                    className="w-24 h-24 text-yellow-400 animate-bounce mb-4"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="32" cy="32" r="30" fill="#FFEB3B" />
                    <ellipse cx="22" cy="28" rx="4" ry="6" fill="#333" />
                    <ellipse cx="42" cy="28" rx="4" ry="6" fill="#333" />
                    <path
                        d="M22 40c2.5 3 7.5 5 10 5s7.5-2 10-5"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            </div> */}
        </section>
    );
};

export default page;
