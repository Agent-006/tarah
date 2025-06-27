// app/admin/products/page.tsx
import prisma from "@/lib/db";
import { serializeProduct } from "@/lib/prisma";
import { ProductList } from "@/components/admin/products/product-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            variants: { select: { id: true } },
            coverImage: { take: 1 },
        },
        orderBy: { createdAt: "desc" },
    });

    const serializedProducts = products.map(serializeProduct);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products</h1>
                <Button asChild>
                    <Link href="/admin/products/add-product">Add Product</Link>
                </Button>
            </div>
            <ProductList products={serializedProducts} />
        </div>
    );
}
