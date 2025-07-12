// app/wishlist/page.tsx
"use client";


import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Share2, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/user/wishlistStore";
import { useCartStore } from "@/store/user/cartStore";

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
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, isLoading, error, fetchWishlist, removeFromWishlist } = useWishlistStore();
    const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});
    const { addItem } = useCartStore();

    useEffect(() => {
        if (status === "authenticated") {
            if (session?.user?.role === "ADMIN") {
                router.replace("/admin/dashboard");
                return;
            }
            fetchWishlist();
        }
    }, [status, session?.user?.role, fetchWishlist, router]);

    if (status === "unauthenticated") {
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
                        We&apos;re gathering your favorite items
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
        <div className="w-full min-h-screen flex flex-col items-center justify-start py-8 bg-secondary px-2">
            <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg mb-4">Your wishlist is empty</p>
                    <Button asChild>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-5xl space-y-6">
                    {items.map((item, index) => {
                        const product = item.product;
                        const primaryImage = product.coverImage[0];
                        const inStock = product.variants.some(
                            (v) => v.inventory?.stock && v.inventory.stock > 0
                        );
                        const size =
                            product.variants[0]?.variantAttributes.find(
                                (a) => a.name === "Size"
                            )?.value;
                        const color =
                            product.variants[0]?.variantAttributes.find(
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
                                        variant.variantAttributes.find(
                                            (a) => a.name === "Size"
                                        )?.value || "",
                                    color:
                                        variant.variantAttributes.find(
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
                                className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b py-6 px-2 sm:px-4 w-full bg-secondary shadow-sm hover:shadow-md transition-shadow duration-200"
                                key={index}
                            >
                                {/* Product Image */}
                                <div
                                    className="w-full sm:w-32 sm:h-40 relative flex-shrink-0 mb-4 sm:mb-0"
                                >
                                    <Link href={`/product/${product.slug}`}>
                                        <div className="relative w-full h-full sm:w-32 sm:h-40">
                                            <Image
                                                src={
                                                    primaryImage?.url ||
                                                    "/assets/insta1.png"
                                                }
                                                alt={product.name}
                                                height={600}
                                                width={600}
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, 8rem"
                                            />
                                        </div>
                                    </Link>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 space-y-2 w-full sm:ml-4">
                                    <p>
                                        <Link
                                            href={`/product/${product.slug}`}
                                            className="text-lg font-semibold hover:underline"
                                        >
                                            {product.name}
                                        </Link>
                                    </p>
                                    <p className="font-medium text-base line-clamp-2">
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
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2">
                                        <Button
                                            onClick={() =>
                                                handleAddToCart(product.id)
                                            }
                                            disabled={!inStock}
                                            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto rounded-none"
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
                                            className="border-red-500 text-red-500 hover:bg-red-50 w-full sm:w-auto rounded-none"
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
                                <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-secondary w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:bg-gray-50"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}/product/${product.slug}`
                                            );
                                            toast.success(
                                                "Link copied to clipboard!"
                                            );
                                        }}
                                    >
                                        <span className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors px-2 py-1">
                                            <Share2 className="w-5 h-5" />
                                            <span>Share</span>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
