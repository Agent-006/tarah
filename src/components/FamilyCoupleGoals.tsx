import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const FamilyCoupleGoals = () => {
    return (
        <section className="bg-background py-16 px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {/* Couple Goals */}
                <div className="relative w-full h-[700px] md:h-[1000px] group overflow-hidden">
                    <Image
                        src="/assets/couple-goals.png"
                        alt="Couple Goals"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
                    <div className="absolute bottom-10 left-10 bg-white/80 p-6 backdrop-blur-md max-w-xs shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary/30 animate-fade-in-up">
                        <h2 className="text-2xl md:text-4xl font-semibold mb-2 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                            Couple Goals
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground mb-4">
                            Explore the exclusive collections of 2025
                        </p>
                        <Button
                            variant="default"
                            size="sm"
                            className="cursor-pointer rounded-none px-6 py-4 bg-primary hover:bg-primary/90 text-secondary shadow-md transition-all duration-300 group-hover:scale-105"
                            suppressHydrationWarning
                        >
                            <Link
                                href="/products"
                                className="flex items-center justify-center gap-2"
                            >
                                Shop Now
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Family Goals */}
                <div className="relative w-full h-[700px] md:h-[1000px] group overflow-hidden">
                    <Image
                        src="/assets/family-goals.png"
                        alt="Family Goals"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
                    <div className="absolute bottom-10 left-10 bg-white/80 p-6 backdrop-blur-md max-w-xs shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary/30 animate-fade-in-up">
                        <h2 className="text-2xl md:text-4xl font-semibold mb-2 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                            Family Goals
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground mb-4">
                            Explore the exclusive collections of 2025
                        </p>
                        <Button
                            variant="default"
                            size="sm"
                            className="cursor-pointer rounded-none px-6 py-4 bg-primary hover:bg-primary/90 text-secondary shadow-md transition-all duration-300 group-hover:scale-105"
                            suppressHydrationWarning
                        >
                            <Link
                                href="/products"
                                className="flex items-center justify-center gap-2"
                            >
                                Shop Now
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FamilyCoupleGoals;
