"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useAdminProductStore } from "@/store/admin/adminProductStore";
import { ProductsDataTable } from "@/components/admin/products/data-table";
import { columns } from "@/components/admin/products/columns";

export default function AdminProductsPage() {
    const { products, fetchProducts } = useAdminProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>
            <ProductsDataTable columns={columns} data={products} />
        </div>
    );
}
