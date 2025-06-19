"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/user/cartStore";
import { useParams } from "next/navigation";
import { useWishlistStore } from "@/store/user/wishlistStore";
import axios from "axios";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";

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

interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    priceOffset: number;
    attributes: {
        name: string;
        value: string;
    }[];
    images: {
        url: string;
        altText?: string;
    }[];
    inventory?: {
        stock: number;
    };
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discountedPrice?: number;
    images: {
        url: string;
        altText?: string;
    }[];
    variants: ProductVariant[];
    inventory?: {
        stock: number;
    };
}

export default function ProductDetailPage() {
    const { slug } = useParams();
    const { data: session } = useSession();
    const { addItem } = useCartStore();
    const {
        items: wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
    } = useWishlistStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);

    // fetch product details based on slug
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/products/${slug}`);
                setProduct(response.data);
                setSelectedVariant(response.data.variants[0]);
                setActiveImage(response.data.images[0]?.url || null);
            } catch (error) {
                setError(
                    axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : "Failed to fetch product details"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
        fetchWishlist();
    }, [slug, fetchWishlist]);

    // Get available colors from variants
    const colors =
        product?.variants.reduce((acc, variant) => {
            const colorAttr = variant.attributes.find(
                (attr) => attr.name === "color"
            );
            if (colorAttr && !acc.some((c) => c.value === colorAttr.value)) {
                acc.push({
                    name: colorAttr.value,
                    value: colorAttr.value,
                    price:
                        Number(product.discountedPrice || product.basePrice) +
                        Number(variant.priceOffset),
                });
            }
            return acc;
        }, [] as { name: string; value: string; price: number }[]) || [];

    // Get available sizes from variants
    const sizes =
        product?.variants.reduce((acc, variant) => {
            const sizeAttr = variant.attributes.find(
                (attr) => attr.name === "size"
            );
            if (sizeAttr && !acc.includes(sizeAttr.value)) {
                acc.push(sizeAttr.value);
            }
            return acc;
        }, [] as string[]) || [];

    const handleColorSelect = (colorValue: string) => {
        if (!product) return;

        // find variant with matching color attribute
        const variant = product.variants.find((v) =>
            v.attributes.some(
                (a) => a.name === "color" && a.value === colorValue
            )
        );

        if (variant) {
            setSelectedVariant(variant);
            // update active image to variant's first image if available
            if (variant.images.length > 0) {
                setActiveImage(variant.images[0].url);
            }
        }
    };

    const handleSizeSelect = (sizeValue: string) => {
        if (!product || !selectedVariant) return;

        // find variant with matching size and current color
        const colorAttr = selectedVariant.attributes.find(
            (a) => a.name === "color"
        );

        if (!colorAttr) return;

        const variant = product.variants.find(
            (v) =>
                v.attributes.some(
                    (a) => a.name === "size" && a.value === sizeValue
                ) &&
                v.attributes.some(
                    (a) => a.name === "color" && a.value === colorAttr.value
                )
        );

        if (variant) {
            setSelectedVariant(variant);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !selectedVariant) return;

        setIsAddingToCart(true);
        try {
            await addItem({
                productId: product.id,
                variantId: selectedVariant.id,
                name: product.name,
                price:
                    Number(product.discountedPrice || product.basePrice) +
                    Number(selectedVariant.priceOffset),
                size:
                    selectedVariant.attributes.find(
                        (attr) => attr.name === "size"
                    )?.value || "",
                color:
                    selectedVariant.attributes.find(
                        (attr) => attr.name === "color"
                    )?.value || "",
                image: selectedVariant.images[0]?.url || product.images[0]?.url,
                quantity,
            });

            toast.success("Item added to cart successfully!");
        } catch (error) {
            toast.error("Failed to add item to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        // Redirect to cart or checkout page
        // router.push("/checkout");
    };

    const handleWishlistToggle = async () => {
        if (!product) return;

        setIsWishlistProcessing(true);
        try {
            if (isInWishlist(product.id)) {
                await removeFromWishlist(product.id);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(product.id);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error("Failed to update wishlist");
        } finally {
            setIsWishlistProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 text-center">
                <h1 className="text-3xl font-semibold mb-6">
                    Product Not Found
                </h1>
                <p className="text-red-500 mb-4">{error}</p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const currentColor = selectedVariant?.attributes.find(
        (a) => a.name === "color"
    )?.value;
    const currentSize = selectedVariant?.attributes.find(
        (a) => a.name === "size"
    )?.value;
    const stock =
        selectedVariant?.inventory?.stock || product.inventory?.stock || 0;
    const price =
        Number(product.discountedPrice || product.basePrice) +
        Number(selectedVariant?.priceOffset || 0);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-8">
                {/* Left Side - Images */}
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="flex md:flex-col gap-2 overflow-auto md:w-20">
                        {product.images.map((img, index) => (
                            <Image
                                key={index}
                                src={img.url}
                                alt={
                                    img.altText || `Product image ${index + 1}`
                                }
                                width={80}
                                height={100}
                                className={`rounded-md cursor-pointer border ${
                                    img.url === activeImage
                                        ? "border-primary"
                                        : "border-transparent"
                                }`}
                                onClick={() => setActiveImage(img.url)}
                            />
                        ))}
                        {selectedVariant?.images.map((img, index) => (
                            <Image
                                key={`variant-${index}`}
                                src={img.url}
                                alt={
                                    img.altText || `Variant image ${index + 1}`
                                }
                                width={80}
                                height={100}
                                className={`rounded-md cursor-pointer border ${
                                    img.url === activeImage
                                        ? "border-primary"
                                        : "border-transparent"
                                }`}
                                onClick={() => setActiveImage(img.url)}
                            />
                        ))}
                    </div>
                    <div className="relative overflow-hidden rounded-lg w-full h-auto max-w-xl">
                        {activeImage && (
                            <Image
                                src={activeImage}
                                alt="Main Product"
                                width={500}
                                height={600}
                                className="rounded-lg w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        )}
                    </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="border p-6 rounded-xl shadow-md w-full h-fit max-w-md bg-secondary space-y-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold leading-snug">
                            {product.name}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleWishlistToggle}
                            disabled={isWishlistProcessing || !session}
                            aria-label={
                                isInWishlist(product.id)
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                        >
                            {isWishlistProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Heart
                                    className={`w-5 h-5 ${
                                        isInWishlist(product.id)
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-400"
                                    }`}
                                />
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-lg font-medium">
                            Rs. {price.toLocaleString()}
                        </p>
                        {product.discountedPrice && (
                            <p className="text-sm line-through text-gray-500">
                                Rs. {product.basePrice.toLocaleString()}
                            </p>
                        )}
                    </div>

                    {stock <= 0 ? (
                        <p className="text-red-500">Out of Stock</p>
                    ) : stock <= 5 ? (
                        <p className="text-orange-500">
                            Only {stock} left in stock!
                        </p>
                    ) : null}

                    <p className="text-sm text-gray-700">
                        {product.description}
                    </p>

                    {/* Colors */}
                    {colors.length > 0 && (
                        <div>
                            <p className="text-sm mb-2 font-medium">Color</p>
                            <div className="flex gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`w-7 h-7 rounded-full border-2 ${
                                            currentColor === color.value
                                                ? "border-primary"
                                                : "border-transparent"
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() =>
                                            handleColorSelect(color.value)
                                        }
                                        aria-label={`Select color ${color.name}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div>
                            <p className="text-sm mb-2 font-medium">Size</p>
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map((size) => (
                                    <Button
                                        key={size}
                                        variant={
                                            currentSize === size
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => handleSizeSelect(size)}
                                        disabled={stock <= 0}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <p className="text-sm mb-2 font-medium">Quantity</p>
                        <div className="flex items-center border w-fit px-2 py-1 rounded-md">
                            <button
                                className="text-lg px-2"
                                onClick={() =>
                                    setQuantity(Math.max(quantity - 1, 1))
                                }
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button
                                className="text-lg px-2"
                                onClick={() =>
                                    setQuantity(Math.min(quantity + 1, stock))
                                }
                                disabled={quantity >= stock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Button
                            className="w-full"
                            onClick={handleAddToCart}
                            disabled={stock <= 0 || isAddingToCart}
                        >
                            {isAddingToCart ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "ADD TO CART"
                            )}
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleBuyNow}
                            disabled={stock <= 0 || isAddingToCart}
                        >
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
