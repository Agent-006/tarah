"use client";

import { useEffect } from "react";
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Blogs</h1>
                <Button asChild>
                    <Link href="/admin/blogs/create-blog">Write a blog</Link>
                </Button>
            </div>
            <AdminBlogList />
        </div>
    );
}
