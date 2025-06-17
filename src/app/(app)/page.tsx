"use client";

import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, Heart, Quote } from "lucide-react";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { useCartStore } from "@/store/cartStore";

const ph = [
    { path: "/assets/p1.jpg", description: "Exclusive Collection" },
    { path: "/assets/p2.jpg", description: "Summer Wears" },
    { path: "/assets/p3.jpg", description: "Classic Outfits" },
    { path: "/assets/p4.jpg", description: "Professional Outfits" },
];

const testimonials = [
    {
        name: "Kyle Merwin",
        title: "CO-owner at LionEnergy",
        image: "/assets/kyle.jpg", // place image in public folder
        quote: `Ante facilisi ipsum sit eget dolor maecenas sed. Fringilla laoreet tincidunt nec nulla ullamcorper. Convallis viverra risus, facilisis erat gravida justo, urna ultrices.`,
    },
    {
        name: "Jane Doe",
        title: "Founder at BrightTech",
        image: "/assets/jane.jpg",
        quote: `Fringilla laoreet tincidunt nec nulla ullamcorper. Convallis viverra risus, facilisis erat gravida justo, urna ultrices.`,
    },
    {
        name: "John Smith",
        title: "CEO at CloudGrid",
        image: "/assets/john.jpg",
        quote: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit arcu in pretium molestie.`,
    },
];

export default function Home() {
    const [value, setValue] = useState(" ");

    const plugin = React.useRef(Autoplay({ delay: 2000 }));

    useEffect(() => {
        useCartStore.getState().initializeCart();
    }, []);

    return (
        <>
            <main className="pt-5">
                <Hero />

                <section className="w-full space-y-2">
                    <div className="flex flex-col items-center justify-center gap-2 h-48 md:h-72">
                        <p className="h-5 text-base md:text-lg font-bold text-center text-primary drop-shadow-md">
                            effortlessly stunning, everyday
                        </p>
                        <h1 className="h-20 text-3xl md:text-6xl font-bold text-center px-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                            Because You Deserve to Stand Out.
                        </h1>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <Carousel
                            opts={{
                                align: "center",
                            }}
                            plugins={[plugin.current]}
                            className="w-full"
                            onMouseLeave={plugin.current.reset}
                        >
                            <CarouselContent className="px-2 md:px-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-full sm:basis-1/2 lg:basis-1/4"
                                    >
                                        <div className="py-1 px-2 flex flex-col items-center justify-center">
                                            <div className="h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden rounded-lg shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
                                                <Image
                                                    src={`${ph[index].path}`}
                                                    alt={`Product ${index + 1}`}
                                                    width={400}
                                                    height={500}
                                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <h1 className="text-2xl md:text-4xl font-bold text-center mt-6 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                                                    {ph[index].description}
                                                </h1>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <Button className="rounded-none cursor-pointer py-6 px-8 text-lg bg-primary hover:bg-primary/90 text-secondary shadow-lg hover:shadow-primary/50 transition-all duration-300 mt-10">
                            Explore Now
                        </Button>
                    </div>
                </section>

                <section className="bg-background py-16 px-4 md:px-12">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                        {/* Image */}
                        <div className="w-full group relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-md shadow-2xl group-hover:shadow-primary/50 transition-shadow duration-500 -rotate-1 translate-x-2 translate-y-2"></div>
                            <Image
                                src={
                                    value === "family"
                                        ? "/assets/family.jpg"
                                        : "/assets/maa-beti.jpg"
                                }
                                alt="Fashion model"
                                width={600}
                                height={800}
                                className="rounded-md object-cover relative transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl"
                            />
                        </div>

                        {/* Content */}
                        <div className="text-center md:text-center space-y-6 flex flex-col items-center justify-center">
                            <p className="uppercase text-sm font-semibold tracking-wide text-gray-500 animate-fade-in">
                                Cherishing Moments, Crafting Memories
                            </p>

                            <h2 className="text-4xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent animate-slide-up">
                                Style That Always Moves With You
                            </h2>

                            <p className="text-gray-600 text-base md:text-lg max-w-prose animate-fade-in delay-100">
                                Explore the curated collection of suit sets —
                                where timeless tradition meets modern flair.
                                From soft pastels to striking prints, each piece
                                is designed for comfort, grace, and effortless
                                versatility. Whether you're heading to work,
                                celebrating a special moment, or simply stepping
                                out in style, dress up without the drama.
                            </p>

                            <Button className="rounded-none bg-primary text-secondary cursor-pointer px-8 py-6 text-lg hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 hover:shadow-primary/50 shadow-lg">
                                Shop Now
                            </Button>

                            <ToggleGroup
                                type="single"
                                className="pt-4 space-x-2 animate-fade-in delay-200"
                            >
                                <ToggleGroupItem
                                    value="maa-beti"
                                    className={cn(
                                        value === "maa-beti"
                                            ? "bg-primary text-secondary border-b-2 border-primary shadow-lg"
                                            : "text-gray-600 hover:bg-primary/10",
                                        "uppercase px-6 py-3 transition-all duration-300 hover:shadow-md"
                                    )}
                                    onClick={() => setValue("maa-beti")}
                                >
                                    Couple Goals
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="family"
                                    className={cn(
                                        value === "family"
                                            ? "bg-primary text-secondary border-b-2 border-primary shadow-lg"
                                            : "text-gray-600 hover:bg-primary/10",
                                        "uppercase px-6 py-3 transition-all duration-300 hover:shadow-md"
                                    )}
                                    onClick={() => setValue("family")}
                                >
                                    Family Goals
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-secondary w-full overflow-hidden py-20 md:pb-0 lg:pb-0">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                        {/* Left Text */}
                        <div className="w-full md:w-1/2 text-center md:text-left space-y-8 animate-slide-up">
                            <h1 className="text-5xl md:text-8xl font-light leading-tight flex flex-col space-y-2">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary/80 to-secondary animate-text-glow">
                                    Summer
                                </span>
                                <span className="italic font-semibold bg-clip-text text-transparent bg-gradient-to-r from-secondary/90 to-secondary/70">
                                    Collections
                                </span>
                            </h1>
                            <p className="text-xl md:text-3xl text-secondary/90 max-w-[600px] leading-relaxed">
                                Explore the exclusive summer collections of 2025
                                - where vibrant colors meet effortless elegance
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-none text-primary bg-secondary hover:bg-secondary/90 border-2 border-secondary/50 hover:border-secondary/80 px-10 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-secondary/20"
                            >
                                Shop Now
                            </Button>
                        </div>

                        {/* Right Image */}
                        <div className="relative w-full md:w-1/2 flex justify-center md:justify-end animate-float">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-xl animate-pulse-slow" />
                                <Image
                                    src="/assets/woman-holding-bag.png"
                                    alt="Summer Collection Model"
                                    width={600}
                                    height={600}
                                    className="object-contain relative z-10 transform transition-all duration-500 hover:scale-105"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <ProductCarousel
                    subHeading={"Gracefully Bold, Effortlessly You."}
                    heading={"For The Woman Who"}
                />

                <TestimonialCarousel />

                <InstagramSection />
            </main>

            <Footer />
        </>
    );
}
