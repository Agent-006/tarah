"use client";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import ProductCarousel from "@/components/ProductCarousel";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import SummerCollection from "@/components/SummerCollection";
import FamilyCoupleGoals from "../../components/FamilyCoupleGoals";


const ph = [
    { path: "/assets/p1.jpg", description: "Exclusive Collection" },
    { path: "/assets/p2.jpg", description: "Summer Wears" },
    { path: "/assets/p3.jpg", description: "Classic Outfits" },
    { path: "/assets/p4.jpg", description: "Professional Outfits" },
];

export default function Home() {

    const plugin = React.useRef(Autoplay({ delay: 2000 }));

    return (
        <>
            <main className="pt-5 bg-background">
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
                                            <div className="h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden shadow-2xl hover:shadow-primary/50 transition-shadow duration-300">
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
                        <Button className="rounded-none cursor-pointer py-6 px-8 text-lg bg-primary hover:bg-primary/90 text-secondary shadow-lg hover:shadow-primary/50 transition-all duration-300 mt-10" suppressHydrationWarning>
                            <Link
                                href={"/products"}
                                className="flex items-center justify-center gap-2"
                            >
                                Explore Now
                            </Link>
                        </Button>
                    </div>
                </section>

                <FamilyCoupleGoals />

                <SummerCollection />

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
