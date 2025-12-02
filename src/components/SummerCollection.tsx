
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const SummerCollection = () => {
    return (
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-secondary w-full overflow-hidden py-20 md:pb-0 lg:pb-0">
            <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                {/* Left Text */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-8 animate-fade-in-up">
                    <h1 className="text-5xl md:text-8xl font-light leading-tight flex flex-col space-y-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary/80 to-secondary">
                            Summer
                        </span>
                        <span className="italic font-semibold bg-clip-text text-transparent bg-gradient-to-r from-secondary/90 to-secondary/70 animate-fade-in animate-delay-500">
                            Collections
                        </span>
                    </h1>
                    <p className="text-xl md:text-3xl text-secondary/90 max-w-[600px] leading-relaxed animate-fade-in animate-delay-700">
                        Explore the exclusive summer collections of 2025 - where
                        vibrant colors meet effortless elegance
                    </p>
                    <Button
                        variant="outline"
                        className="rounded-none text-primary bg-secondary hover:bg-secondary/90 border-2 border-secondary/50 hover:border-secondary/80 px-10 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-secondary/20 animate-fade-in animate-delay-1000"
                        suppressHydrationWarning
                    >
                        <Link
                            href="/products"
                            className="flex items-center justify-center gap-2"
                        >
                            <span className="flex items-center gap-2">
                                <span className="animate-pulse">Shop Now</span>
                                <svg
                                    className="w-5 h-5 animate-slide-right"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </span>
                        </Link>
                    </Button>
                </div>

                {/* Right Image */}
                <div className="relative w-full md:w-1/2 flex justify-center md:justify-end animate-float">
                    <div className="relative group">
                        {/* Very subtle background: faint shadow only */}
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                            <div className="w-80 h-80 md:w-[400px] md:h-[400px] rounded-full bg-black/5 blur-md opacity-40" />
                        </div>
                        <Image
                            src="/assets/woman-holding-bag.png"
                            alt="Summer Collection Model"
                            width={600}
                            height={600}
                            className="object-contain relative z-10 transition-all duration-500 group-hover:scale-105"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SummerCollection;
