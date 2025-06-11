"use client";

import React from "react";

import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";

const carauselItemList = [
    "/assets/hero_banner_1.jpg",
    "/assets/hero_banner_2.jpg",
    "/assets/hero_banner_3.jpg",
];

const Hero = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 2000 })
    );
    return (
        <section>
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="py-1">
                                <div className="relative">
                                    <h1 className="absolute top-1/3 left-1/12 text-secondary text-7xl w-xl">
                                        Styled to empower, crafted to{" "}
                                        <span className="text-primary">
                                            COMFORTS
                                        </span>
                                    </h1>
                                    <Image
                                        src={`${carauselItemList[index]}`}
                                        alt={`Hero Banner ${index + 1}`}
                                        width={1920}
                                        height={688}
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default Hero;
