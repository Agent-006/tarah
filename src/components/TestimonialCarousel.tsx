import Image from "next/image";
import { Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaOptionsType } from "embla-carousel";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

const testimonials = [
    {
        name: "Kyle Merwin 1",
        role: "CO-owner at LionEnergy",
        image: "/assets/kyle.jpg",
        text: "Ante facilisi ipsum sit eget dolor maecenas sed. Fringilla laoreet tincidunt nec nulla ullamcorper. Convallis viverra risus, facilisis erat gravida justo, urna ultrices.",
    },
    {
        name: "Kyle Merwin 2",
        role: "CO-owner at LionEnergy",
        image: "/assets/kyle.jpg",
        text: "Ante facilisi ipsum sit eget dolor maecenas sed. Fringilla laoreet tincidunt nec nulla ullamcorper. Convallis viverra risus, facilisis erat gravida justo, urna ultrices.",
    },
    {
        name: "Kyle Merwin",
        role: "CO-owner at LionEnergy",
        image: "/assets/kyle.jpg",
        text: "Ante facilisi ipsum sit eget dolor maecenas sed. Fringilla laoreet tincidunt nec nulla ullamcorper. Convallis viverra risus, facilisis erat gravida justo, urna ultrices.",
    },
    // Add more testimonials here as needed
];

const options: EmblaOptionsType = {
    loop: true,
};

export default function TestimonialSection() {
    return (
        <section className="w-full bg-[#f9f9f9] py-16 px-4">
            <div className="text-center mb-12">
                <p className="text-sm font-semibold tracking-wide uppercase text-zinc-700">
                    Hear What Others Think About Us
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-medium mt-2">
                    Our Customers Speaks
                </h2>
            </div>

            <div className="relative max-w-5xl mx-auto">
                <Carousel
                    opts={options}
                    plugins={[Autoplay({ delay: 5000 })]}
                    className="overflow-visible"
                >
                    <CarouselContent>
                        {testimonials.map((item, index) => (
                            <CarouselItem
                                key={index}
                                className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 px-4"
                            >
                                <div className="text-5xl text-zinc-600 -mb-6 -ml-4">
                                    <Quote className="w-10 h-10" />
                                </div>

                                <div className="flex flex-col md:flex-row items-center text-left bg-white rounded-lg shadow-md p-6 gap-6">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={200}
                                        height={200}
                                        className="rounded-md object-cover max-w-[200px] max-h-[250px]"
                                    />
                                    <div className="max-w-md text-zinc-700">
                                        <p className="text-lg leading-relaxed mb-4">
                                            {item.text}
                                        </p>
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-5xl text-zinc-600 -mt-6 -mr-4">
                                    <Quote className="w-10 h-10 rotate-180" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
