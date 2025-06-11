import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const InstagramSection = () => {
    return (
        <div className="bg-primary text-secondary py-20 px-4 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-20 -z-0"/>
            
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-serif mb-6">
                    Follow Products And Discounts On Instagram
                </h2>
                <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mb-12 px-6 py-3 bg-secondary/10 backdrop-blur-sm rounded-full hover:bg-secondary/20 transition-all duration-300"
                >
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm font-medium">@tarahbymeena</span>
                </a>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 max-w-6xl mx-auto mb-20">
                    {[
                        "/assets/insta1.jpg",
                        "/assets/insta2.jpg",
                        "/assets/insta3.jpg",
                        "/assets/insta4.jpg",
                        "/assets/insta5.jpg",
                        "/assets/insta6.jpg",
                    ].map((src, idx) => (
                        <div 
                            key={idx}
                            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Image
                                src={src}
                                alt={`Instagram ${idx + 1}`}
                                width={300}
                                height={300}
                                className="object-cover w-full h-full transform transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto bg-secondary/10 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                    <h3 className="text-3xl md:text-4xl font-serif mb-3">
                        Subscribe Newsletter
                    </h3>
                    <p className="mb-8 text-sm md:text-base text-secondary/80">
                        Get exclusive updates, early access to sales, and special offers
                    </p>

                    <form className="flex flex-col sm:flex-row justify-center gap-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-secondary text-primary p-5 rounded-lg border-none focus:ring-2 focus:ring-secondary/50"
                        />
                        <Button
                            type="submit"
                            className="bg-secondary text-primary font-semibold px-8 py-5 rounded-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            Subscribe Now
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InstagramSection;