"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.replace("/sign-in");
            return;
        }
        if (session.user?.role === "CUSTOMER") {
            router.replace("/");
            return;
        }
    }, [session, status, router]);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 overflow-auto">
                <div className="">{children}</div>
            </div>
        </div>
    );
}
