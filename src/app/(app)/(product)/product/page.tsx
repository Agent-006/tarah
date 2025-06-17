"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";

const product = {
    title: "Red With Floral Printed Maslin Co-Ord Set",
    basePrice: 1590,
    images: [
        "/assets/product1.png",
        "/assets/product2.png",
        "/assets/product3.png",
        "/assets/product4.png",
        "/assets/product5.png",
    ],
    colors: [
        { name: "Red", value: "#ff0000", price: 1590 },
        { name: "Grey", value: "#cccccc", price: 1490 },
        { name: "Black", value: "#000000", price: 1690 },
        { name: "Green", value: "#b2dfdb", price: 1590 },
        { name: "White", value: "#ffffff", price: 1490 },
        { name: "Blue", value: "#c5cae9", price: 1550 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2X"],
};

export default function ProductDetailPage() {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(product.images[0]);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-8">
                {/* Left Side - Images */}
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="flex md:flex-col gap-2 overflow-auto md:w-20">
                        {product.images.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                width={80}
                                height={100}
                                className={`rounded-md cursor-pointer border ${
                                    img === activeImage
                                        ? "border-primary"
                                        : "border-transparent"
                                }`}
                                onClick={() => setActiveImage(img)}
                            />
                        ))}
                    </div>
                    <div className="relative overflow-hidden rounded-lg w-full h-auto max-w-xl">
                        <Image
                            src={activeImage}
                            alt="Main Product"
                            width={500}
                            height={600}
                            className="rounded-lg w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="border p-6 rounded-xl shadow-md w-full h-fit max-w-md bg-secondary space-y-6">
                    <h2 className="text-xl font-semibold leading-snug">
                        {product.title}
                    </h2>
                    <p className="text-lg font-medium">
                        Rs. {selectedColor.price.toLocaleString()}
                    </p>

                    {/* Colors */}
                    <div>
                        <p className="text-sm mb-2 font-medium">Color</p>
                        <div className="flex gap-3">
                            {product.colors.map((color) => (
                                <button
                                    key={color.name}
                                    className={`w-7 h-7 rounded-full border-2 ${
                                        selectedColor.name === color.name
                                            ? "border-primary"
                                            : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setSelectedColor(color)}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <p className="text-sm mb-2 font-medium">Size</p>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map((size) => (
                                <Button
                                    key={size}
                                    variant={
                                        selectedSize === size
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <p className="text-sm mb-2 font-medium">Quantity</p>
                        <div className="flex items-center border w-fit px-2 py-1 rounded-md">
                            <button
                                className="text-lg px-2"
                                onClick={() =>
                                    setQuantity(Math.max(quantity - 1, 1))
                                }
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button
                                className="text-lg px-2"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Button className="w-full">ADD TO CART</Button>
                        <Button className="w-full" variant="outline">
                            BUY NOW
                        </Button>
                    </div>
                </div>
            </div>

            <ProductCarousel
                heading="Explore More Products"
                subHeading="Discover the latest trends"
            />

            <InstagramSection />
            <Footer />
        </>
    );
}
