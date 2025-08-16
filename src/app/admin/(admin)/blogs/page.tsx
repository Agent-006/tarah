"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminBlogList from "@/components/admin/blog/BlogList";
import { Button } from "@/components/ui/button";

export default function AdminBlogsPage() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (
            sessionStatus === "authenticated" &&
            session?.user?.role === "CUSTOMER"
        ) {
            router.replace("/");
        }
    }, [sessionStatus, session?.user?.role, router]);

    if (
        sessionStatus === "authenticated" &&
        session?.user?.role === "CUSTOMER"
    ) {
        router.replace("/");
    }

    const [searchSlug, setSearchSlug] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    return (
        <div className="space-y-6">
            {/* Search input above header, similar to products page */}
            <div className="flex flex-col justify-between items-center">
                <div className="flex justify-between w-full">
                    <h1 className="text-2xl font-bold w-full">Blogs</h1>
                    <Button asChild>
                        <Link href="/admin/blogs/create-blog">
                            Write a blog
                        </Link>
                    </Button>
                </div>
                <div className="flex justify-between w-full mt-5">
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Search by slug..."
                            value={searchSlug}
                            onChange={(e) => {
                                setSearchSlug(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border rounded px-3 py-2 text-sm w-full max-w-xs"
                        />
                    </div>
                </div>
            </div>
            <AdminBlogList
                searchSlug={searchSlug}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
