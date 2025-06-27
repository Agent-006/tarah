// app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2, Share2, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/user/wishlistStore";
import prisma from "@/lib/db";
import { useCartStore } from "@/store/user/cartStore";
import { toast } from "sonner";

type CartItemInput = {
    productId: string;
    variantId: string;
    slug: string;
    name: string;
    price: number;
    size: string;
    color: string;
    image: string;
    quantity: number;
};

export default function WishlistPage() {
    const { data: session } = useSession();
    const { items, isLoading, error, fetchWishlist, removeFromWishlist } =
        useWishlistStore();

    const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>(
        {}
    );
    const { addItem } = useCartStore();

    useEffect(() => {
        if (session) {
            fetchWishlist();
        }
    }, [session, fetchWishlist]);

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-start min-h-screen py-8 text-center bg-secondary">
                <h2 className="text-2xl font-bold mb-4">
                    Please sign in to view your wishlist
                </h2>
                <Button asChild>
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-8 text-center bg-secondary">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin w-12 h-12 text-primary" />
                    <p className="text-xl font-medium text-gray-700">
                        Loading your wishlist...
                    </p>
                    <p className="text-sm text-gray-500">
                        We're gathering your favorite items
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start py-8 bg-secondary">
            <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg mb-4">Your wishlist is empty</p>
                    <Button asChild>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            ) : (
                <>
                    {items.map((item, index) => {
                        const product = item.product;
                        console.log("Product:", product);
                        const primaryImage = product.images[0];
                        const inStock = product.variants.some(
                            (v) => v.inventory?.stock && v.inventory.stock > 0
                        );
                        const size = product.variants[0]?.attributes.find(
                            (a) => a.name === "Size"
                        )?.value;
                        const color = product.variants[0]?.attributes.find(
                            (a) => a.name === "Color"
                        )?.value;

                        const handleAddToCart = async (productId: string) => {
                            setAddingToCart((prev) => ({
                                ...prev,
                                [productId]: true,
                            }));
                            try {
                                const wishlistItem = items.find(
                                    (item) => item.product.id === productId
                                );

                                if (!wishlistItem) {
                                    console.error("Wishlist item not found");
                                    return;
                                }

                                const product = wishlistItem.product;

                                const variant = product.variants[0]; // Assuming you want the first variant
                                if (!variant) {
                                    console.error(
                                        "No variant found for product"
                                    );
                                    return;
                                }

                                const cartItem: CartItemInput = {
                                    productId: product.id,
                                    variantId: variant.id,
                                    slug: product.slug,
                                    name: product.name,
                                    price: Number(
                                        product.discountedPrice ||
                                            product.basePrice
                                    ),
                                    size:
                                        variant.attributes.find(
                                            (a) => a.name === "Size"
                                        )?.value || "",
                                    color:
                                        variant.attributes.find(
                                            (a) => a.name === "Color"
                                        )?.value || "",
                                    image:
                                        variant.images?.[0]?.url ||
                                        primaryImage?.url ||
                                        "/assets/insta1.png",
                                    quantity: 1, // Default quantity
                                };

                                await addItem(cartItem);

                                toast.success(
                                    "Item added to cart successfully!"
                                );
                            } catch (error) {
                                console.error(
                                    "Failed to add item to cart:",
                                    error
                                );
                                toast.error(
                                    error instanceof Error
                                        ? error.message
                                        : "Failed to add item to cart"
                                );
                            } finally {
                                setAddingToCart((prev) => ({
                                    ...prev,
                                    [productId]: false,
                                }));
                            }
                        };

                        return (
                            <div
                                className="flex items-start justify-between gap-4 border-b py-6 px-4 w-md md:min-w-4xl lg:w-5xl bg-secondary shadow-sm hover:shadow-md transition-shadow duration-200"
                                key={index}
                            >
                                {/* Product Image */}
                                <Link
                                    href={`/product/${product.slug}`}
                                    className="w-32 h-40 relative"
                                >
                                    <Image
                                        src={
                                            primaryImage?.url ||
                                            "/assets/insta1.png"
                                        } // Replace with dynamic src
                                        alt={product.name}
                                        fill
                                        className="object-fit"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 space-y-2">
                                    <p>
                                        <Link
                                            href={`/product/${product.slug}`}
                                            className="text-lg font-semibold hover:underline"
                                        >
                                            {product.name}
                                        </Link>
                                    </p>
                                    <p className="font-medium text-base">
                                        {product.description ||
                                            "No description available"}
                                    </p>

                                    {size && (
                                        <p className="text-sm text-gray-600">
                                            Size: {size}
                                        </p>
                                    )}

                                    {color && (
                                        <p className="text-sm text-gray-600">
                                            Color: {color}
                                        </p>
                                    )}

                                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1 text-orange-500">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <span key={i}>★</span>
                                                )
                                            )}
                                        </div>
                                        <span className="font-medium text-black">
                                            4.7 Star Rating
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            (21,671 User feedback)
                                        </span>
                                    </div> */}

                                    <div className="flex items-center gap-2">
                                        {Number(product.discountedPrice) ? (
                                            <>
                                                <span className="line-through text-gray-500">
                                                    ₹
                                                    {Number(
                                                        product.basePrice
                                                    ).toFixed(2)}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    ₹
                                                    {Number(
                                                        product.discountedPrice
                                                    ).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-bold text-primary">
                                                ₹
                                                {Number(
                                                    product.basePrice
                                                ).toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={() =>
                                                handleAddToCart(product.id)
                                            }
                                            disabled={!inStock}
                                            className="bg-black text-white hover:bg-gray-800"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                            {addingToCart[product.id] ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : inStock ? (
                                                "Add to cart"
                                            ) : (
                                                "Out of stock"
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                            onClick={() =>
                                                removeFromWishlist(product.id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {/* Share Button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="self-start bg-secondary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${window.location.origin}/product/${product.slug}`
                                        );
                                        toast.success(
                                            "Link copied to clipboard!"
                                        );
                                    }}
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
