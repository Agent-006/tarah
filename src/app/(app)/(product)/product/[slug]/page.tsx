"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/user/cartStore";
import { useParams, useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/user/wishlistStore";
import axios from "axios";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductError } from "@/components/error/ProductError";
import { ProductSkeleton } from "@/components/ProductSkeleton";

// const product = {
//     title: "Red With Floral Printed Maslin Co-Ord Set",
//     basePrice: 1590,
//     images: [
//         "/assets/product1.png",
//         "/assets/product2.png",
//         "/assets/product3.png",
//         "/assets/product4.png",
//         "/assets/product5.png",
//     ],
//     colors: [
//         { name: "Red", value: "#ff0000", price: 1590 },
//         { name: "Grey", value: "#cccccc", price: 1490 },
//         { name: "Black", value: "#000000", price: 1690 },
//         { name: "Green", value: "#b2dfdb", price: 1590 },
//         { name: "White", value: "#ffffff", price: 1490 },
//         { name: "Blue", value: "#c5cae9", price: 1550 },
//     ],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
// };

interface Category {
    id: string;
    name: string;
}

interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    priceOffset: string;
    attributes: {
        id: string;
        name: string;
        value: string;
        variantId: string;
    }[];
    images: {
        url: string;
        altText?: string;
    }[];
    inventory?: {
        id: string;
        stock: number;
        lowStockThreshold: number;
        updatedAt: string;
    };
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: string;
    discountedPrice?: string;
    variants: ProductVariant[];
    images: {
        id: string;
        url: string;
        altText?: string;
        order: number;
        isPrimary?: boolean;
    }[];
    categories: {
        categoryId: string;
        assignedAt: string;
    }[];
    inventory: null;
}

export default function ProductDetailPage() {
    const router = useRouter();

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [minimumLoadTimePassed, setMinimumLoadTimePassed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMinimumLoadTimePassed(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // fetch product details based on slug
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/products/${slug}`);
                setProduct(response.data);
                console.log("Fetched product data:", response.data);
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

    useEffect(() => {
        if (product?.categories?.length) {
            const fetchCategories = async () => {
                try {
                    const categoryPromises = product.categories.map((cat) =>
                        axios
                            .get(`/api/categories/${cat.categoryId}`)
                            .then((res) => res.data)
                            .catch(() => ({
                                id: cat.categoryId,
                                name: cat.categoryId,
                            }))
                    );
                    const categoryData = await Promise.all(categoryPromises);
                    setCategories(categoryData);
                } catch (error) {
                    console.error("Failed to fetch categories", error);
                }
            };
            fetchCategories();
        }
    }, [product]);

    // Get available colors from variants
    const colors =
        product?.variants.reduce((acc, variant) => {
            const colorAttr = variant.attributes.find(
                (attr) => attr.name === "Color"
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
                (attr) => attr.name === "Size"
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
                (a) => a.name === "Color" && a.value === colorValue
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
            (a) => a.name === "Color"
        );

        if (!colorAttr) return;

        const variant = product.variants.find(
            (v) =>
                v.attributes.some(
                    (a) => a.name === "Size" && a.value === sizeValue
                ) &&
                v.attributes.some(
                    (a) => a.name === "Color" && a.value === colorAttr.value
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
                    Number(selectedVariant.priceOffset || 0),
                size:
                    selectedVariant.attributes.find(
                        (attr) => attr.name === "Size"
                    )?.value || "",
                color:
                    selectedVariant.attributes.find(
                        (attr) => attr.name === "Color"
                    )?.value || "",
                image: selectedVariant.images[0]?.url || product.images[0]?.url,
                quantity,
            });

            toast.success(
                `${product.name} (${selectedVariant.name}) item added to cart successfully!`
            );
        } catch (error) {
            toast.error("Failed to add item to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        // Redirect to cart or checkout page
        router.push("/cart");
    };

    const handleWishlistToggle = async () => {
        if (!product) return;

        setIsWishlistProcessing(true);
        try {
            console.log(isInWishlist(product.id));
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

    if (isLoading || !minimumLoadTimePassed) {
        return <ProductSkeleton />;
    }

    if (error) {
        return <ProductError error={error} onRetry={() => router.refresh()} />;
    }

    if (!product) {
        return null;
    }

    const currentColor = selectedVariant?.attributes.find(
        (a) => a.name === "Color"
    )?.value;
    const currentSize = selectedVariant?.attributes.find(
        (a) => a.name === "Size"
    )?.value;
    const stock = selectedVariant?.inventory?.stock || 0;
    const price =
        Number(product.discountedPrice || product.basePrice) +
        Number(selectedVariant?.priceOffset || 0);

    return (
        <>
            <section className="flex flex-col justify-around md:flex-row gap-6 py-20 bg-secondary shadow-md">
                {/* Left Side - Images */}
                <div className="flex gap-4 justify-center">
                    <div className="w-full max-w-[400px] aspect-[3/4] relative overflow-hidden border">
                        {activeImage && (
                            <Image
                                src={activeImage}
                                alt="Main Product"
                                width={900}
                                height={1200}
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-3 overflow-auto max-h-[500px]">
                        {product.images
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((img) => (
                                <div
                                    key={img.id}
                                    onClick={() => setActiveImage(img.url)}
                                    className={`relative w-[60px] h-[80px] border overflow-hidden cursor-pointer ${
                                        img.url === activeImage
                                            ? "border-black"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.altText || product.name}
                                        width={80}
                                        height={100}
                                        className={`object-cover ${
                                            img.url === activeImage
                                                ? "border-primary"
                                                : "border-transparent"
                                        } ${
                                            img.isPrimary
                                                ? "ring-2 ring-blue-500"
                                                : ""
                                        }`}
                                    />
                                </div>
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
                </div>

                {/* Right Side - Product Info */}
                <div className="space-y-8 w-lg p-8 bg-secondary border-2 shadow-lg transition-all duration-300">
                    {/* Product Title & Wishlist */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {product.name}
                        </h1>
                        <span className="flex items-center gap-2">
                            <span
                                className={`ml-2 text-xs select-none ${
                                    isInWishlist(product.id)
                                        ? "text-red-500 font-semibold"
                                        : "text-gray-500"
                                }`}
                            >
                                {isInWishlist(product.id)
                                    ? "In Wishlist"
                                    : "Add to Wishlist"}
                            </span>
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
                                className={`transition-colors duration-200 ${
                                    isInWishlist(product.id)
                                        ? "bg-red-100 hover:bg-red-200"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {isWishlistProcessing ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                ) : (
                                    <Heart
                                        className={`w-6 h-6 transition-all duration-200 ${
                                            isInWishlist(product.id)
                                                ? "fill-red-500 text-red-500 scale-110 drop-shadow"
                                                : "text-gray-400 hover:text-red-400"
                                        }`}
                                    />
                                )}
                            </Button>
                        </span>
                    </div>

                    {/* Price & Discount */}
                    <div className="flex items-center gap-4">
                        <p className="text-2xl font-semibold text-primary">
                            ₹{price.toLocaleString()}
                        </p>
                        {product.discountedPrice && (
                            <>
                                <p className="text-base line-through text-gray-400">
                                    ₹
                                    {Number(product.basePrice).toLocaleString()}
                                </p>
                                <span className="text-base bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                                    {Math.round(
                                        ((Number(product.basePrice) -
                                            Number(product.discountedPrice)) /
                                            Number(product.basePrice)) *
                                            100
                                    )}
                                    % OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock Status */}
                    {stock <= 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-red-600 font-medium">
                                Out of Stock
                            </p>
                        </div>
                    ) : stock <= 5 ? (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            <p className="text-yellow-700 font-medium">
                                Only {stock} left in stock!
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="text-green-700 font-medium">
                                In Stock
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-base text-gray-700 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Categories */}
                    {/* {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )} */}

                    {/* Colors */}
                    {colors.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm mb-2 font-semibold text-gray-800">
                                Color
                            </p>
                            <div className="flex gap-3">
                                {colors.map((color) => (
                                    <Button
                                        key={color.name}
                                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all duration-150 ${
                                            currentColor === color.value
                                                ? "border-primary ring-2 ring-primary"
                                                : "border-gray-200"
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() =>
                                            handleColorSelect(color.value)
                                        }
                                        aria-label={`Select color ${color.name}`}
                                    >
                                        {currentColor === color.value && (
                                            <span className="block w-3 h-3 rounded-full border-2 border-white bg-white mx-auto my-auto" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm mb-2 font-semibold text-gray-800">
                                Size
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map((size) => {
                                    const variant = product.variants.find(
                                        (v) =>
                                            v.attributes.some(
                                                (a) =>
                                                    a.name === "Size" &&
                                                    a.value === size
                                            ) &&
                                            v.attributes.some(
                                                (a) =>
                                                    a.name === "Color" &&
                                                    a.value === currentColor
                                            )
                                    );
                                    const variantStock =
                                        variant?.inventory?.stock || 0;
                                    const isLowStock =
                                        variant?.inventory &&
                                        variant.inventory.stock <=
                                            variant.inventory.lowStockThreshold;

                                    return (
                                        <Button
                                            key={size}
                                            variant={
                                                currentSize === size
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handleSizeSelect(size)
                                            }
                                            disabled={variantStock <= 0}
                                            className={`w-14 h-10 rounded-none text-base font-medium transition-all duration-150 ${
                                                isLowStock
                                                    ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                                                    : ""
                                            }`}
                                        >
                                            {size}
                                            {variantStock <= 0 && (
                                                <span className="ml-1 text-xs text-red-400">
                                                    ×
                                                </span>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <p className="text-sm mb-2 font-semibold text-gray-800">
                            Quantity
                        </p>
                        <div className="flex flex-col items-center border rounded-lg w-fit overflow-hidden px-2 py-1 bg-gray-50">
                            <div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-10 h-10 text-2xl"
                                    onClick={() =>
                                        setQuantity(Math.max(quantity - 1, 1))
                                    }
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                    {quantity}
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-10 h-10 text-2xl"
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(quantity + 1, stock)
                                        )
                                    }
                                    disabled={quantity >= stock}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        {selectedVariant?.inventory && (
                            <p className="text-xs text-gray-500 mt-1">
                                Max: {selectedVariant?.inventory?.stock ?? 0}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-2">
                        <Button
                            className="w-full bg-primary text-secondary hover:bg-primary/90 rounded-none text-lg font-semibold py-3 shadow-md transition-all duration-150"
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
                            className="w-full rounded-none text-lg font-semibold py-3 border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-150"
                            variant="outline"
                            onClick={handleBuyNow}
                            disabled={stock <= 0 || isAddingToCart}
                        >
                            BUY NOW
                        </Button>
                    </div>
                </div>
            </section>

            <ProductCarousel
                heading="Explore More Products"
                subHeading="Discover the latest trends"
            />

            <InstagramSection />
            <Footer />
        </>
    );
}
