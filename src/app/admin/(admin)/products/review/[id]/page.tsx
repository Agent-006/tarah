"use client";


import Link from "next/link";
import Image from "next/image";
import { useEffect, use as usePromise } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Edit,
  ArrowLeft,
  Package,
  DollarSign,
  Eye,
  Star,
  Tag,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminProductStore } from "@/store/admin/adminProductStore";


export default function ViewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { fetchProduct, product, isLoading, error } = useAdminProductStore();
  const { id } = usePromise(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth/role redirect logic
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/admin/sign-in");
      return;
    }
    if (session.user?.role === "CUSTOMER") {
      router.replace("/");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        await fetchProduct(id);
        toast.success("Product loaded successfully");
      } catch (error) {
        toast.error("Failed to load product");
        console.error(error);
      }
    };
    loadProduct();
  }, [id, fetchProduct]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Product not found
          </h2>
          <p className="text-gray-600 mt-2">
            {error || "The product you're looking for doesn't exist."}
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">Product ID: {product.id}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/products/${id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Link>
        </Button>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        <Badge variant={product.published ? "default" : "secondary"}>
          <Eye className="h-3 w-3 mr-1" />
          {product.published ? "Published" : "Draft"}
        </Badge>
        {product.featured && (
          <Badge variant="outline">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>

      {/* Product Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-lg font-medium">{product.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Slug
                </label>
                <p className="text-gray-900 font-mono">{product.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Base Price
                  </label>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(product.basePrice)}
                  </p>
                </div>
                {product.discountedPrice && product.discountedPrice > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Discounted Price
                    </label>
                    <p className="text-xl font-bold text-red-600">
                      {formatPrice(product.discountedPrice)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Product Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">
                        {attr.name}
                      </span>
                      <span className="text-gray-900">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Product Variants ({product.variants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {product.variants.map((variant, index) => (
                <div
                  key={variant.id || index}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{variant.name}</h4>
                      <p className="text-sm text-gray-600">
                        SKU: {variant.sku}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Price Offset: {formatPrice(variant.priceOffset)}
                    </Badge>
                  </div>

                  {/* Variant Attributes */}
                  {variant.variantAttributes && variant.variantAttributes.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Attributes</h5>
                      <div className="flex flex-wrap gap-2">
                        {variant.variantAttributes.map((attr, attrIndex) => (
                          <Badge key={attrIndex} variant="secondary">
                            {attr.name}: {attr.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inventory */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Stock
                      </label>
                      <p
                        className={`font-semibold ${
                          variant.inventory.stock <=
                          variant.inventory.lowStockThreshold
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {variant.inventory.stock} units
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Low Stock Threshold
                      </label>
                      <p className="font-medium">
                        {variant.inventory.lowStockThreshold} units
                      </p>
                    </div>
                  </div>

                  {/* Variant Images */}
                  {variant.images && variant.images.some((img) => img.url) && (
                    <div>
                      <h5 className="font-medium mb-2">Images</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {variant.images
                          .filter((img) => img.url)
                          .map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative aspect-square rounded-lg overflow-hidden border"
                            >
                              <Image
                                src={image.url}
                                alt={
                                  image.altText ||
                                  `Variant ${variant.name} image ${
                                    imgIndex + 1
                                  }`
                                }
                                fill
                                className="object-cover"
                              />
                              {image.isPrimary && (
                                <Badge
                                  className="absolute top-1 left-1"
                                  variant="default"
                                >
                                  Primary
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.coverImage &&
              product.coverImage.length > 0 &&
              product.coverImage[0]?.url ? (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={product.coverImage[0].url}
                    alt={product.coverImage[0].altText || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <span className="text-gray-500 ml-2">No cover image</span>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/admin/products/${id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
