// components/admin/products/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discountedPrice?: number;
    published: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
};

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "basePrice",
        header: "Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("basePrice"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "published",
        header: "Published",
        cell: ({ row }) => {
            return row.getValue("published") ? "Yes" : "No";
        },
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => {
            return row.getValue("featured") ? "Yes" : "No";
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            return new Date(row.getValue("createdAt")).toLocaleDateString();
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
