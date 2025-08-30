"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/product/productsStore";
import { useCategoryStore } from "@/store/category/categoryStore";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const filters = ["XS", "S", "M", "L", "XL", "2XL"];

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const {
        products,
        isLoading,
        error,
        totalPages,
        currentPage,
        fetchProducts,
    } = useProductStore();

    const {
        categories,
        fetchCategories,
        getCategoryBySlug,
    } = useCategoryStore();

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingPage(true);
            if (categories.length === 0) {
                await fetchCategories();
            }
            setIsLoadingPage(false);
        };
        loadData();
    }, [categories.length, fetchCategories]);

    useEffect(() => {
        if (!isLoadingPage && categories.length > 0) {
            const category = getCategoryBySlug(slug);
            if (!category) {
                notFound();
            }
            fetchProducts({
                page: 1,
                categorySlug: slug,
                size: selectedSize,
                inStockOnly: showAvailableOnly,
            });
        }
    }, [slug, isLoadingPage, categories.length, getCategoryBySlug, fetchProducts, selectedSize, showAvailableOnly]);

    const category = getCategoryBySlug(slug);

    if (isLoadingPage) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading category...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        notFound();
        return null;
    }

    const handlePageChange = (page: number) => {
        fetchProducts({
            page,
            categorySlug: slug,
            size: selectedSize,
            inStockOnly: showAvailableOnly,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <section className="flex flex-col md:flex-row px-4 md:px-8 py-6">
                {/* Sidebar Filters */}
                <aside className="md:w-64 w-full md:mr-8 mb-6 md:mb-0">
                    <div className="border rounded-xl p-4 bg-white">
                        <h2 className="text-lg font-semibold mb-4">Filters</h2>
                        <div className="mb-4">
                            <p className="font-medium text-sm mb-2">Size</p>
                            <div className="flex flex-wrap gap-2">
                                {filters.map((size) => (
                                    <Button
                                        variant={selectedSize === size ? "default" : "outline"}
                                        size="sm"
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size === selectedSize ? null : size);
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Availability</p>
                            <Button
                                variant={showAvailableOnly ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                            >
                                In Stock Only
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Products Section */}
                <main className="flex-1">
                    <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
                    {category.description && (
                        <p className="text-lg text-muted-foreground max-w-2xl mb-6">{category.description}</p>
                    )}

                    {error && (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    )}

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
                    ) : products.length > 0 ? (
                        <>
                            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </section>

                            {/* Pagination Controls */}
                            <div className="mt-8 flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="self-center text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
                                No products found
                            </h2>
                            <p className="text-muted-foreground">
                                We couldn&apos;t find any products in this category yet.
                            </p>
                        </div>
                    )}
                </main>
            </section>
        </>
    );
}
