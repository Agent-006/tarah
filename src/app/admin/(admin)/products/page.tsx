"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ProductList } from "@/components/admin/products/product-list";
import { Button } from "@/components/ui/button";
import { useAdminProductStore } from "@/store/admin/adminProductStore";
import { serializeProduct } from "@/lib/prisma";

export default function ProductsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { products, fetchProducts } = useAdminProductStore();

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.role === "CUSTOMER") {
      router.replace("/");
    }
  }, [sessionStatus, session?.user?.role, router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (sessionStatus === "authenticated" && session?.user?.role === "CUSTOMER") {
    return null;
  }

  // Serialize products for ProductList
  const serializedProducts = products.map(serializeProduct);

  return (
    <div className="space-y-6">
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
