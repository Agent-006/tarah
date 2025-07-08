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
];

const options: EmblaOptionsType = {
    loop: true,
};

export default function TestimonialSection() {
    return (
        <section className="w-full bg-secondary py-20 px-4">
            <div className="text-center mb-16">
                <p className="text-sm font-semibold tracking-widest uppercase text-zinc-600 mb-2 animate-fadeIn">
                    Hear What Others Think About Us
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-zinc-800 animate-fadeIn delay-200">
                    Our Customers Speak
                </h2>
            </div>

            <div className="relative max-w-4xl mx-auto">
                <Carousel
                    opts={options}
                    plugins={[Autoplay({ delay: 5000 })]}
                    className="overflow-visible"
                >
                    <CarouselContent className="h-[500px] md:h-[400px]">
                        {testimonials.map((item, index) => (
                            <CarouselItem
                                key={index}
                                className="flex justify-center items-center px-2"
                            >
                                <div className="relative w-full flex flex-col md:flex-row items-center bg-white/90 shadow-xl border border-zinc-100 p-8 md:p-12 gap-8 transition-transform duration-500 hover:scale-[1.025] hover:shadow-2xl animate-fadeUp">
                                    {/* Left Quote */}
                                    <div className="absolute -top-8 left-8 text-zinc-300 opacity-70 animate-fadeIn">
                                        <Quote className="w-12 h-12 rotate-180" />
                                    </div>
                                    {/* Right Quote */}
                                    <div className="absolute -bottom-8 right-8 text-zinc-300 opacity-70 animate-fadeIn">
                                        <Quote className="w-12 h-12" />
                                    </div>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="rounded-full overflow-hidden border-4 border-secondary shadow-lg animate-bounce">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={120}
                                                height={120}
                                                className="object-cover w-28 h-28"
                                            />
                                        </div>
                                    </div>
                                    {/* Testimonial Content */}
                                    <div className="flex-1 text-zinc-700">
                                        <p className="text-xl md:text-2xl font-light leading-relaxed mb-6 italic transition-colors duration-300 hover:text-zinc-900">
                                            {item.text}
                                        </p>
                                        <div>
                                            <p className="font-bold text-lg text-zinc-800">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-zinc-500">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            {/* Tailwind custom animations */}
            <style jsx global>{`
                .animate-fadeIn {
                    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                .animate-fadeUp {
                    animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
}
