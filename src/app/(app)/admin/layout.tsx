// app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin/sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/options";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/admin/sign-in");
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
