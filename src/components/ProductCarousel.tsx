import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

const products = [
    {
        tag: "New Arrival",
        image: "/assets/n1.png",
        title: "Cotton cable-knit short-sleeve POLO",
        oldPrice: "6400",
        newPrice: "5400",
    },
    {
        tag: "Best Seller",
        image: "/assets/n2.png",
        title: "Cotton cable-knit short-sleeve POLO",
        oldPrice: "6400",
        newPrice: "5400",
    },
    {
        tag: "Sold Out",
        image: "/assets/n3.png",
        title: "Cotton cable-knit short-sleeve POLO",
        oldPrice: "6400",
        newPrice: "5400",
    },
    {
        tag: "Sleepware",
        image: "/assets/n4.png",
        title: "Cotton cable-knit short-sleeve POLO",
        oldPrice: "6400",
        newPrice: "5400",
    },
    {
        tag: "Just In",
        image: "/assets/n5.png",
        title: "Cotton cable-knit short-sleeve POLO",
        oldPrice: "6400",
        newPrice: "5400",
    },
];

const ProductCarousel = ({
    heading,
    subHeading,
}: {
    heading: string;
    subHeading: string;
}) => {
    const plugin = React.useRef(Autoplay({ delay: 2000 }));

    return (
        <section className="w-full text-primary py-16 px-4 sm:px-6 lg:px-12">
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
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <Carousel
                        opts={{
                            align: "center",
                        }}
                        className="w-full"
                        plugins={[plugin.current]}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="px-2 py-2 md:px-4 md:py-4">
                            {products.map((product, index) => (
                                <CarouselItem
                                    key={index}
                                    className="relative basis-full sm:basis-1/2 lg:basis-1/4 group"
                                >
                                    {/* Heart Icon */}
                                    <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all duration-300 shadow-lg hover:shadow-xl z-20">
                                        <Heart
                                            size={16}
                                            className="transition-colors duration-300"
                                        />
                                    </div>

                                    {/* Image Container */}
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

                                    {/* Product Info */}
                                    <div className="p-3 space-y-2 bg-secondary/10 backdrop-blur-sm rounded-lg mt-3 shadow-lg">
                                        {/* Tag */}
                                        <p className="text-xs font-medium text-primary/80">
                                            {product.tag}
                                        </p>

                                        {/* Title */}
                                        <h3 className="text-md font-semibold text-primary leading-snug">
                                            {product.title}
                                        </h3>

                                        {/* Price */}
                                        <div className="text-sm text-primary">
                                            {product.oldPrice && (
                                                <span className="line-through mr-2 text-primary/40">
                                                    {product.oldPrice} INR
                                                </span>
                                            )}
                                            <span className="font-medium">
                                                {product.newPrice} INR
                                            </span>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <Button className="mt-6 rounded-none bg-primary text-secondary cursor-pointer px-8 py-6 text-lg hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/50">
                        View All Products
                        <span className="ml-2">→</span>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ProductCarousel;
