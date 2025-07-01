"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import { useWishlistStore } from "@/store/user/wishlistStore";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductStore } from "@/store/product/productsStore";

const filters = ["XS", "S", "M", "L", "XL", "2XL"];
const ITEMS_PER_PAGE = 8;

interface AllProductPageProps {
    initialCategory?: string | null;
}

const AllProductsPage = ({ initialCategory }: AllProductPageProps) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        typeof initialCategory | null
    >(null);

    const {
        products,
        isLoading,
        error,
        totalPages,
        currentPage,
        fetchProducts,
    } = useProductStore();

    const { isInWishlist, addToWishlist, removeFromWishlist } =
        useWishlistStore();

    useEffect(() => {
        fetchProducts({
            page: 1,
            size: selectedSize,
            inStockOnly: showAvailableOnly,
            category: selectedCategory,
        });
    }, [selectedSize, showAvailableOnly, selectedCategory, fetchProducts]);

    const handlePageChange = (page: number) => {
        fetchProducts({
            page,
            size: selectedSize,
            inStockOnly: showAvailableOnly,
        });
    };

    const handleWishlistToggle = async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    return (
        <>
            <section className="flex flex-col md:flex-row px-4 md:px-8 py-6">
                {/* Sidebar Filters - Keep exactly the same */}
                <aside className="md:w-64 w-full md:mr-8 mb-6 md:mb-0">
                    <div className="border rounded-xl p-4 bg-white">
                        <h2 className="text-lg font-semibold mb-4">Filters</h2>
                        <div className="mb-4">
                            <p className="font-medium text-sm mb-2">Size</p>
                            <div className="flex flex-wrap gap-2">
                                {filters.map((size) => (
                                    <Button
                                        variant={
                                            selectedSize === size
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(
                                                size === selectedSize
                                                    ? null
                                                    : size
                                            );
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">
                                Availability
                            </p>
                            <Button
                                variant={
                                    showAvailableOnly ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    setShowAvailableOnly(!showAvailableOnly)
                                }
                            >
                                In Stock Only
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Products Section */}
                <main className="flex-1">
                    <h1 className="text-2xl font-bold mb-6">Products</h1>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="space-y-3">
                                    <Skeleton className="h-[340px] w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            {error}
                        </div>
                    ) : (
                        <>
                            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => {
                                    const primaryImage = product
                                        .coverImage?.[0] ||
                                        product.variants?.[0]?.images?.[0] || {
                                            url: "/assets/family.jpg",
                                            altText: product.name,
                                        };
                                    const inStock =
                                        product.variants?.some(
                                            (v) =>
                                                v.inventory?.stock &&
                                                v.inventory.stock > 0
                                        ) ?? false;
                                    const isWishlisted = isInWishlist(
                                        product.id
                                    );

                                    const firstCategory =
                                        (product.categories as any)?.[0]
                                            ?.category?.name || "";

                                    const sizeAttribute =
                                        product.variants?.[0]?.variantAttributes?.find(
                                            (attr) => attr.name === "Size"
                                        );

                                    const size = sizeAttribute?.value || null;

                                    return (
                                        <div
                                            key={product.id}
                                            className="relative basis-full sm:basis-1/2 lg:basis-1/4 group"
                                        >
                                            {/* Wishlist button */}
                                            <Button
                                                onClick={() =>
                                                    handleWishlistToggle(
                                                        product.id
                                                    )
                                                }
                                                className={`absolute top-2 right-2 rounded-full p-2 cursor-pointer backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl z-20 ${
                                                    isWishlisted
                                                        ? "bg-red-100/80 hover:bg-red-100"
                                                        : "bg-secondary/30 hover:bg-secondary/50"
                                                }`}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={`transition-colors duration-300 ${
                                                        isWishlisted
                                                            ? "fill-red-500 text-red-500"
                                                            : "text-primary"
                                                    }`}
                                                />
                                            </Button>
                                            {/* product image with link */}
                                            <Link
                                                href={`/product/${product.slug}`}
                                            >
                                                <div className="relative overflow-hidden shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
                                                    {primaryImage && (
                                                        <Image
                                                            src={
                                                                primaryImage.url
                                                            }
                                                            alt={
                                                                primaryImage.altText ||
                                                                product.name
                                                            }
                                                            width={460}
                                                            height={460}
                                                            className="h-full transform transition-all duration-500 group-hover:scale-105"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                                                    {!inStock && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <Badge variant="destructive">
                                                                Sold Out
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>

                                            {/* product info */}
                                            <div className="p-3 space-y-2 bg-secondary/10 backdrop-blur-sm mt-3 shadow-lg">
                                                {firstCategory && (
                                                    <p className="text-xs font-medium text-primary/80">
                                                        {firstCategory}
                                                    </p>
                                                )}
                                                <h3 className="text-md font-semibold text-primary leading-snug">
                                                    {product.name}
                                                </h3>
                                                {size && (
                                                    <div className="text-xs text-primary/70">
                                                        Size:{" "}
                                                        <span className="font-medium">
                                                            {size}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-sm text-primary">
                                                    {product.discountedPrice &&
                                                        Number(
                                                            product.discountedPrice
                                                        ) > 0 && (
                                                            <span className="line-through mr-2 text-primary/40">
                                                                ₹
                                                                {Number(
                                                                    product.basePrice
                                                                ).toFixed(2)}
                                                            </span>
                                                        )}
                                                    <span className="font-medium">
                                                        ₹
                                                        {(
                                                            Number(
                                                                product.discountedPrice
                                                            ) ||
                                                            Number(
                                                                product.basePrice
                                                            )
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>

                            {/* Pagination Controls */}
                            <div className="mt-8 flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                >
                                    Previous
                                </Button>
                                <span className="self-center text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    )}
                </main>
            </section>
            <InstagramSection />
            <Footer />
        </>
    );
};

export default AllProductsPage;
