"use client";


import { useEffect } from "react";

import { DataTable } from "@/components/admin/orders/data-table";
import { columns } from "@/components/admin/orders/columns";
import { useAdminOrderStore } from "@/store/admin/adminOrderStore";

export default function AdminOrdersPage() {
    const { orders, fetchOrders } = useAdminOrderStore();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        console.log("orders", orders);
    }, [orders]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Orders</h1>
            <DataTable columns={columns} data={orders} />
        </div>
    );
}
