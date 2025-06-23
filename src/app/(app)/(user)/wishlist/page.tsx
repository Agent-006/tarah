// app/wishlist/page.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/user/wishlistStore";

export default function WishlistPage() {
    const { data: session } = useSession();
    const { items, isLoading, error, fetchWishlist, removeFromWishlist } =
        useWishlistStore();

    useEffect(() => {
        if (session) {
            fetchWishlist();
        }
    }, [session, fetchWishlist]);

    if (!session) {
        return (
            <div className="container mx-auto py-8 text-center">
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
            <div className="container mx-auto py-8 text-center">
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
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg mb-4">Your wishlist is empty</p>
                    <Button asChild>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const product = item.product;
                        const primaryImage = product.images[0];
                        const inStock = product.variants.some(
                            (v) => v.inventory?.stock && v.inventory.stock > 0
                        );
                        const size = product.variants[0]?.attributes.find(
                            (a) => a.name === "size"
                        )?.value;

                        return (
                            <div
                                key={item.id}
                                className="relative group border rounded-lg p-4"
                            >
                                <button
                                    onClick={() =>
                                        removeFromWishlist(product.id)
                                    }
                                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                    aria-label="Remove from wishlist"
                                >
                                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                </button>

                                <Link
                                    href={`/product/${product.slug}`}
                                    className="block mb-3"
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-lg">
                                        {primaryImage && (
                                            <Image
                                                src={primaryImage.url}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        )}
                                        {!inStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Badge variant="destructive">
                                                    Sold Out
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="mt-2">
                                    <Link href={`/product/${product.slug}`}>
                                        <h3 className="font-medium text-lg hover:underline">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    {size && (
                                        <p className="text-sm text-gray-600">
                                            Size: {size}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        {Number(product.discountedPrice) ? (
                                            <>
                                                <span className="line-through text-gray-500 mr-2">
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
