"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";

const products = [
    {
        label: "New Arrival",
        image: "/assets/n1.png",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        oldPrice: 5400,
        status: "available",
        size: "M",
    },
    {
        label: "Best Seller",
        image: "/assets/n2.png",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "available",
        size: "L",
    },
    {
        label: "Sold Out",
        image: "/assets/n3.png",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "soldout",
        size: "XL",
    },
    {
        label: "Sleepwear",
        image: "/assets/n4.png",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "available",
        size: "S",
    },
    {
        label: "Just In",
        image: "/assets/n5.png",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "available",
        size: "2XL",
    },
    {
        label: "Sold Out",
        image: "/assets/p1.jpg",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "soldout",
        size: "M",
    },
    {
        label: "New Arrival",
        image: "/assets/p2.jpg",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        oldPrice: 5400,
        status: "available",
        size: "L",
    },
    {
        label: "Best Seller",
        image: "/assets/p3.jpg",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "available",
        size: "XL",
    },
    {
        label: "Sold Out",
        image: "/assets/p4.jpg",
        title: "Cotton cable-knit short-sleeve POLO",
        newPrice: 5400,
        status: "soldout",
        size: "S",
    },
];

const filters = ["XS", "S", "M", "L", "XL", "2XL"];
const ITEMS_PER_PAGE = 8;

export default function ProductGrid() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSize, setSelectedSize] = useState<null | string>(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const filteredProducts = products.filter((product) => {
        const matchesSize = selectedSize ? product.size === selectedSize : true;
        const matchesAvailability = showAvailableOnly
            ? product.status !== "soldout"
            : true;
        return matchesSize && matchesAvailability;
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <section className="flex flex-col md:flex-row px-4 md:px-8 py-6">
                {/* Sidebar */}
                <aside className="md:w-64 w-full md:mr-8 mb-6 md:mb-0">
                    <div className="border rounded-xl p-4 bg-white">
                        <h2 className="text-lg font-semibold mb-4">Filters</h2>

                        {/* Size Filter */}
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
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <p className="font-medium text-sm mb-2">
                                Availability
                            </p>
                            <Button
                                variant={
                                    showAvailableOnly ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                    setShowAvailableOnly(!showAvailableOnly);
                                    setCurrentPage(1);
                                }}
                            >
                                In Stock Only
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Products */}
                <main className="flex-1">
                    <h1 className="text-2xl font-bold mb-6">Products</h1>
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentProducts.map((product, index) => (
                            <div
                                key={index}
                                className="relative basis-full sm:basis-1/2 lg:basis-1/4 group"
                            >
                                <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all duration-300 shadow-lg hover:shadow-xl z-20">
                                    <Heart
                                        size={16}
                                        className="transition-colors duration-300"
                                    />
                                </div>

                                <div className="relative overflow-hidden rounded-lg shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        width={260}
                                        height={340}
                                        className="rounded-lg w-full h-[340px] object-cover transform transition-all duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                                </div>

                                <div className="p-3 space-y-2 bg-secondary/10 backdrop-blur-sm rounded-lg mt-3 shadow-lg">
                                    <p className="text-xs font-medium text-primary/80">
                                        {product.label}
                                    </p>

                                    <h3 className="text-md font-semibold text-primary leading-snug">
                                        {product.title}
                                    </h3>

                                    <div className="text-sm text-primary">
                                        {product.oldPrice &&
                                            product.oldPrice !==
                                                product.newPrice && (
                                                <span className="line-through mr-2 text-primary/40">
                                                    {product.oldPrice} INR
                                                </span>
                                            )}
                                        <span className="font-medium">
                                            {product.newPrice} INR
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Pagination Controls */}
                    <div className="mt-8 flex justify-center gap-4">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
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
                                setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages)
                                )
                            }
                        >
                            Next
                        </Button>
                    </div>
                </main>
            </section>
            <InstagramSection />
            <Footer />
        </>
    );
}
