// app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
