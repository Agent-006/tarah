import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import axios from "axios";
import { useWishlistStore } from "@/store/user/wishlistStore";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discountedPrice?: number;
    variants?: any[];
    coverImage?: { url: string; altText?: string }[];
    categories?: { name: string }[];
    tag?: string;
}

const ProductCarousel = ({
    heading,
    subHeading,
}: {
    heading: string;
    subHeading: string;
}) => {
    const plugin = React.useRef(Autoplay({ delay: 2000 }));
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {
        items: wishlistItems,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
    } = useWishlistStore();

    useEffect(() => {
        const fetchTopProducts = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get("/api/products", {
                    params: { page: 1, limit: 5 },
                });
                setProducts(res.data.products || []);
            } catch (err) {
                // Optionally handle error
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopProducts();
        fetchWishlist();
    }, [fetchWishlist]);

    const handleWishlist = async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    return (
        <section className="w-full bg-secondary text-primary py-16 px-4 sm:px-6 lg:px-12">
            <div className="w-full mx-auto">
                {/* Headings */}
                <p className="text-center text-sm uppercase tracking-widest text-gray-400 mb-2">
                    {subHeading}
                </p>
                <h2 className="text-center text-4xl sm:text-5xl font-light mb-10">
                    {heading}{" "}
                    <span className="italic font-medium">Owns It</span>.
                </h2>

                {/* Product Slider */}
                <div className="w-full bg-secondary flex flex-col items-center justify-center gap-4">
                    <Carousel
                        opts={{ align: "center" }}
                        className="w-full bg-secondary"
                        plugins={[plugin.current]}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="px-2 bg-secondary py-2 md:px-4 md:py-4">
                            {isLoading
                                ? Array.from({ length: 5 }).map((_, idx) => (
                                    <CarouselItem
                                        key={idx}
                                        className="relative bg-background basis-full sm:basis-1/2 lg:basis-1/4 group animate-pulse"
                                    >
                                        <div className="absolute top-2 right-2 rounded-full p-2 bg-secondary/30 backdrop-blur-sm shadow-lg z-20">
                                            <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                        </div>
                                        <div className="relative overflow-hidden shadow-2xl bg-gray-200">
                                            <div className="w-full h-[450px] bg-gray-300" />
                                        </div>
                                        <div className="p-3 space-y-2 bg-secondary/10 backdrop-blur-sm mt-3 shadow-lg">
                                            <div className="h-4 w-1/3 bg-gray-300 rounded" />
                                            <div className="h-5 w-2/3 bg-gray-300 rounded" />
                                            <div className="h-4 w-1/2 bg-gray-200 rounded" />
                                        </div>
                                    </CarouselItem>
                                ))
                                : products.map((product, index) => (
                                    <CarouselItem
                                        key={product.id}
                                        className="relative bg-background basis-full sm:basis-1/2 lg:basis-1/4 group"
                                    >
                                        {/* Heart Icon */}
                                        <div
                                            className={`absolute top-2 right-2 rounded-full p-2 cursor-pointer bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all duration-300 shadow-lg hover:shadow-xl z-20 ${
                                                isInWishlist(product.id)
                                                    ? "text-red-500"
                                                    : "text-primary"
                                            }`}
                                            onClick={() =>
                                                handleWishlist(product.id)
                                            }
                                        >
                                            <Heart
                                                size={16}
                                                className="transition-colors duration-300"
                                                fill={
                                                    isInWishlist(product.id)
                                                        ? "#ef4444"
                                                        : "none"
                                                }
                                            />
                                        </div>

                                        {/* Image Container */}
                                        <Link
                                            href={`/product/${product.slug}`}
                                        >
                                            <div className="relative overflow-hidden shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
                                                <Image
                                                    src={
                                                        product.coverImage &&
                                                        product.coverImage[0]
                                                            ?.url
                                                            ? product
                                                                .coverImage[0]
                                                                .url
                                                            : "/assets/n1.png"
                                                    }
                                                    alt={product.name}
                                                    width={260}
                                                    height={340}
                                                    className="w-full h-[500px] object-top transform transition-all duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-3 space-y-2 bg-secondary/10 backdrop-blur-sm mt-3 shadow-lg">
                                                {/* Tag */}
                                                <p className="text-xs font-medium text-primary/80">
                                                    {product.categories &&
                                                        product.categories[0]
                                                            ?.name}
                                                </p>

                                                {/* Title */}
                                                <h3 className="text-md font-semibold text-primary leading-snug">
                                                    {product.name}
                                                </h3>

                                                {/* Price */}
                                                <div className="text-sm text-primary">
                                                    {product.basePrice && (
                                                        <span className="line-through mr-2 text-primary/40">
                                                            {
                                                                product.basePrice
                                                            }{" "}
                                                            INR
                                                        </span>
                                                    )}
                                                    <span className="font-medium">
                                                        {product.discountedPrice ||
                                                            product.basePrice}{" "}
                                                        INR
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                    </Carousel>
                    <Button className="mt-6 rounded-none bg-primary text-secondary cursor-pointer px-8 py-6 text-lg hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/50">
                        <Link
                            href="/products"
                            className="flex items-center justify-center gap-2"
                        >
                            View All Products
                            <span className="ml-2">→</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};
export default ProductCarousel;
