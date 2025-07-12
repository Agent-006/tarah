"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { DataTable } from "@/components/admin/orders/data-table";
import { columns } from "@/components/admin/orders/columns";
import { useAdminOrderStore } from "@/store/admin/adminOrderStore";

export default function AdminOrdersPage() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const { orders, fetchOrders } = useAdminOrderStore();

    useEffect(() => {
        if (
            sessionStatus === "authenticated" &&
            session?.user?.role === "CUSTOMER"
        ) {
            router.replace("/");
        }
    }, [sessionStatus, session?.user?.role, router]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        console.log("orders", orders);
    }, [orders]);

    if (
        sessionStatus === "authenticated" &&
        session?.user?.role === "CUSTOMER"
    ) {
        // Optionally render a loading spinner while redirecting
        return null;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Orders</h1>
            <DataTable columns={columns} data={orders} />
        </div>
    );
}
//
