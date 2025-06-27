"use client";

import { useEffect, useState, use as usePromise } from "react";
import { ProductForm } from "@/components/admin/products/product-form";
import { TAdminProductsSchema } from "@/schemas/adminSchema/adminProductsSchema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminProductStore } from "@/store/admin/adminProductStore";

export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { products, fetchProducts, updateProduct } = useAdminProductStore();
    const [product, setProduct] = useState<TAdminProductsSchema | null>(null);
    const [loading, setLoading] = useState(true);

    // Unwrap params using React.use()
    const { id, slug } = usePromise(params);
    

    useEffect(() => {
        const loadProduct = async () => {
            try {
                await fetchProducts();
                const productData = products.find((p) => p.id === id);
                if (productData) {
                    setProduct({
                        name: productData.name || "",
                        slug: productData.slug || "",
                        description: productData.description || "",
                        basePrice: productData.basePrice || 0,
                        discountedPrice:
                            productData.discountedPrice ?? undefined,
                        categories:
                            productData.categories?.map(
                                (c: string | { id: string }) =>
                                    typeof c === "string" ? c : c.id
                            ) || [],
                        attributes: productData.attributes || [],
                        variants:
                            productData.variants?.map((v) => ({
                                id: v.id || "",
                                name: v.name || "",
                                sku: v.sku || "",
                                priceOffset: v.priceOffset || 0,
                                attributes: v.attributes || [],
                                images:
                                    v.images?.map((img, index) => ({
                                        url: img.url || "",
                                        altText: img.altText || "",
                                        isPrimary: img.isPrimary ?? index === 0,
                                        order: img.order ?? index,
                                    })) || [],
                                inventory: {
                                    stock: v.inventory?.stock || 0,
                                    lowStockThreshold:
                                        v.inventory?.lowStockThreshold || 5,
                                },
                            })) || [],
                        published: productData.published || false,
                        featured: productData.featured || false,
                    });
                    toast.success("Product loaded successfully");
                } else {
                    toast.error("Product not found");
                    router.push("/admin/products");
                }
            } catch (error) {
                toast.error("Failed to load product");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id, fetchProducts, router]);

    const handleSubmit = async (data: TAdminProductsSchema) => {
        try {
            const productData = {
                name: data.name,
                slug: data.slug,
                description: data.description,
                basePrice: data.basePrice,
                discountedPrice: data.discountedPrice || undefined,
                published: data.published,
                featured: data.featured,
                categories: data.categories?.map((id) => ({ id })) || [],
                variants: data.variants.map((variant) => ({
                    id: variant.id || undefined, // For existing variants
                    name: variant.name,
                    sku: variant.sku,
                    priceOffset: variant.priceOffset,
                    attributes: variant.attributes,
                    images: variant.images.map((img) => ({
                        url: img.url,
                        altText: img.altText || "",
                        isPrimary: img.isPrimary,
                        order: img.order,
                    })),
                    inventory: {
                        stock: variant.inventory.stock,
                        lowStockThreshold: variant.inventory.lowStockThreshold,
                    },
                })),
            };

            await updateProduct(id, productData);
            toast.success("Product updated successfully");
            router.push("/admin/products");
        } catch (error) {
            toast.error("Failed to update product");
            console.error(error);
        }
    };

    if (loading || !product) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="space-y-4">
                <p>Product not found</p>
                <Button asChild>
                    <Link href="/admin/products">Back to Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit Product</h1>
                <Button asChild variant="outline">
                    <Link href="/admin/products">Back to Products</Link>
                </Button>
            </div>
            <ProductForm initialData={product} onSubmit={handleSubmit} />
        </div>
    );
}
