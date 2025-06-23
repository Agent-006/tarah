// app/admin/products/add-product/page.tsx
"use client";

import { ProductForm } from "@/components/admin/products/product-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TAdminProductsSchema } from "@/schemas/adminSchema/adminProductsSchema";
import { useAdminProductStore } from "@/store/admin/adminProductStore";

const AddProductPage = () => {
    const router = useRouter();
    const { createProduct } = useAdminProductStore();

    const handleSubmit = async (data: TAdminProductsSchema) => {
        try {
            // Prepare the product data without variant IDs
            const productData = {
                ...data,
                discountedPrice: data.discountedPrice ?? undefined,
            };

            await createProduct(productData);
            toast.success("Product created successfully");
            router.push("/admin/products");
        } catch (error) {
            toast.error("Failed to create product");
            console.error(error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Add New Product</h1>
                <Button asChild variant="outline">
                    <Link href="/admin/products">Back to Products</Link>
                </Button>
            </div>
            <ProductForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddProductPage;
