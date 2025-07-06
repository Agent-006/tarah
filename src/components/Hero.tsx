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
        <section className="w-full h-[800px] md:h-[688px] relative">
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {carauselItemList.map((src, index) => (
                        <CarouselItem key={index}>
                            <div className="w-full h-[800px] md:h-[688px] relative">
                                <h1 className="absolute z-10 top-1/3 left-4 md:left-1/12 text-secondary text-3xl md:text-7xl w-11/12 md:w-xl">
                                    Styled to empower, crafted to{" "}
                                    <span className="text-primary">
                                        COMFORTS
                                    </span>
                                </h1>
                                <Image
                                    src={src}
                                    alt={`Hero Banner ${index + 1}`}
                                    fill
                                    className="object-cover md:object-center"
                                    priority
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default Hero;
