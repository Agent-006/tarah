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
  const { fetchProduct, updateProduct, product } = useAdminProductStore();
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
    // Unwrap params using React.use()
    const { id, slug } = usePromise(params);
    
=======
  // Unwrap params using React.use()
  const { id } = usePromise(params);
>>>>>>> 80d321301e5abfc5d51185b3ef78dc9586b0d8d1

  const loadProduct = async () => {
    try {
      setLoading(true);
      await fetchProduct(id);
      if (!product) {
        toast.error("Product not found");
        router.push("/admin/products");
      } else {
        toast.success("Product loaded successfully");
      }
    } catch (error) {
      toast.error("Failed to load product");
      console.error(error);
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const handleSubmit = async (data: TAdminProductsSchema) => {
    try {
      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        coverImage: data.coverImage || [], // Include cover image in update
        basePrice: data.basePrice,
        discountedPrice: data.discountedPrice || undefined,
        published: data.published,
        featured: data.featured,
        categories: data.categories || [],
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
        attributes: data.attributes || [], // Also include attributes
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
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href={`/admin/products/view/${id}`}>Review Product</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">Back to Products</Link>
          </Button>
        </div>
      </div>
      <ProductForm initialData={product} onSubmit={handleSubmit} />
    </div>
  );
}
