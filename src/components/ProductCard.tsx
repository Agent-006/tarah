"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/user/wishlistStore";

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } =
        useWishlistStore();

    const primaryImage = product.coverImage?.[0] ||
        product.variants?.[0]?.images?.[0] || {
            url: "/assets/family.jpg",
            altText: product.name,
        };
    const inStock =
        product.variants?.some(
            (v: any) => v.inventory?.stock && v.inventory.stock > 0
        ) ?? false;
    const isWishlisted = isInWishlist(product.id);
    const firstCategory =
        (
            product.categories as { category?: { name?: string } }[] | undefined
        )?.[0]?.category?.name || "";
    const sizeAttribute = product.variants?.[0]?.variantAttributes?.find(
        (attr: any) => attr.name === "Size"
    );
    const size = sizeAttribute?.value || null;

    const handleWishlistToggle = async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    return (
        <div className="relative basis-full sm:basis-1/2 lg:basis-1/4 group">
            {/* Wishlist button */}
            <Button
                onClick={() => handleWishlistToggle(product.id)}
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
            <Link href={`/product/${product.slug}`}>
                <div className="relative overflow-hidden shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
                    {primaryImage && (
                        <Image
                            src={primaryImage.url}
                            alt={primaryImage.altText || product.name}
                            width={460}
                            height={460}
                            className="h-full transform transition-all duration-500 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                    {!inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Sold Out</Badge>
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
                        Size: <span className="font-medium">{size}</span>
                    </div>
                )}
                <div className="text-sm text-primary">
                    {product.discountedPrice &&
                        Number(product.discountedPrice) > 0 && (
                            <span className="line-through mr-2 text-primary/40">
                                ₹{Number(product.basePrice).toFixed(2)}
                            </span>
                        )}
                    <span className="font-medium">
                        ₹
                        {(
                            Number(product.discountedPrice) ||
                            Number(product.basePrice)
                        ).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
