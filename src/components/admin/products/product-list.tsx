// components/admin/products/product-list.tsx
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { Check, X, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";

type SerializedProduct = {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number; // Now a string
    discountedPrice: number | undefined; // Now a string or undefined
    published: boolean;
    featured: boolean;
    variants: { id: string }[];
    coverImage: { url: string }[];
};

export const columns: ColumnDef<SerializedProduct>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                {row.original.coverImage[0]?.url && (
                    <img
                        src={row.original.coverImage[0].url}
                        alt={row.original.name}
                        className="h-10 w-10 rounded-md object-cover"
                    />
                )}
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "basePrice",
        header: "Price",
        cell: ({ row }) => formatCurrency(row.original.basePrice.toString()), // Convert Decimal to string
    },
    {
        accessorKey: "variants",
        header: "Variants",
        cell: ({ row }) => row.original.variants.length,
    },
    {
        accessorKey: "published",
        header: "Published",
        cell: ({ row }) =>
            row.original.published ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <X className="h-4 w-4 text-red-500" />
            ),
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) =>
            row.original.featured ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <X className="h-4 w-4 text-red-500" />
            ),
    },
    {
        id: "actions",
        cell: ({ row }) => <ProductActions product={row.original} />,
    },
];

function ProductActions({ product }: { product: SerializedProduct }) {
    const router = useRouter();
    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will permanently delete this product and all its variants."
    );
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        setIsPending(true);
        try {
            await axios.delete(`/api/admin/products?id=${product.id}`);
            toast.success("Product deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <ConfirmationDialog />
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products/review/${product.id}`)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
}

interface ProductListProps {
    products: SerializedProduct[];
}

export function ProductList({ products }: ProductListProps) {
    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={products}
                searchKey="name"
                placeholder="Filter products..."
            />
        </div>
    );
}
