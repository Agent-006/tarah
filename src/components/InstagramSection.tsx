import Image from "next/image";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const images = [
    "/assets/insta1.jpg",
    "/assets/insta2.jpg",
    "/assets/insta3.jpg",
    "/assets/insta4.jpg",
    "/assets/insta5.jpg",
    "/assets/insta6.jpg",
];

const InstagramSection = () => {
    return (
        <div className="bg-primary text-secondary py-20 px-4 text-center relative overflow-hidden">
            {/* Animated Background pattern */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-20 -z-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />

            <div className="relative z-10">
                <motion.h2
                    className="text-3xl md:text-5xl font-serif mb-6"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Follow Products And Discounts On Instagram
                </motion.h2>
                <motion.a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mb-12 px-6 py-3 bg-secondary/10 backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300 rounded-full shadow-md hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Instagram className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium">@tarahbymeena</span>
                </motion.a>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 max-w-6xl mx-auto mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.12 } },
                        hidden: {},
                    }}
                >
                    {images.map((src, idx) => (
                        <motion.div
                            key={idx}
                            className="relative group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            whileHover={{ scale: 1.05, zIndex: 2 }}
                        >
                            <Image
                                src={src}
                                alt={`Instagram ${idx + 1}`}
                                width={300}
                                height={300}
                                className="object-cover w-full h-full transform transition-all duration-500 group-hover:scale-110"
                            />
                            <motion.div
                                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                initial={false}
                                whileHover={{ opacity: 1 }}
                            >
                                <Instagram className="text-white w-8 h-8 opacity-80" />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="max-w-2xl mx-auto bg-secondary/10 backdrop-blur-sm p-8 shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <h3 className="text-3xl md:text-4xl font-serif mb-3">
                        Subscribe Newsletter
                    </h3>
                    <p className="mb-8 text-sm md:text-base text-secondary/80">
                        Get exclusive updates, early access to sales, and
                        special offers
                    </p>

                    <form className="flex flex-col sm:flex-row justify-center gap-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-secondary rounded-none text-primary p-5 border-none focus:ring-2 focus:ring-secondary/50 shadow"
                            suppressHydrationWarning
                        />
                        <Button
                            type="submit"
                            className="bg-secondary rounded-none text-primary font-semibold px-8 py-5 hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                            suppressHydrationWarning
                        >
                            Subscribe Now
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default InstagramSection;
