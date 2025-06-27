// app/admin/layout.tsx

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 overflow-auto">
                <div className="">{children}</div>
            </div>
        </div>
    );
}
