"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, MessageCircle, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/store/category/categoryStore";

const Footer = () => {
    const router = useRouter();
    const { categories, fetchCategories } = useCategoryStore();

    React.useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories.length, fetchCategories]);

    const handleCategoryClick = (categorySlug: string) => {
        router.push(`/category/${categorySlug}`);
    };

    return (
        <div className="relative bg-secondary text-primary text-sm">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between gap-10 relative z-10">
                {/* Left Column: Contact Info */}
                <div className="md:w-1/2 space-y-4">
                    <Link href="/" className="flex items-center mb-4">
                        <Image
                            src="/logo.svg"
                            alt="Tarah by Meena"
                            width={100}
                            height={50}
                            className="object-contain"
                        />
                    </Link>
                    <p>© 2025 Tarah. All rights reserved.</p>
                    <p>
                        <strong>Address:</strong> Building 23, Al Zahra Street,
                        Al Barsha 1, <br />
                        Dubai, UAE, P.O. Box 123456
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a
                            href="mailto:tarahbymeena@gmail.com"
                            className="underline hover:text-primary"
                        >
                            tarahbymeena@gmail.com
                        </a>
                    </p>
                    <p>
                        <strong>Mobile:</strong> +971 50 123 4567
                    </p>

                    {/* Social Icons */}
                    <div className="flex space-x-4 mt-4">
                        <Link href="https://www.instagram.com" target="_blank">
                            <Instagram className="w-5 h-5 hover:text-primary transition" />
                        </Link>
                        <Link href="https://www.facebook.com" target="_blank">
                            <Facebook className="w-5 h-5 hover:text-primary transition" />
                        </Link>
                        <Link href="https://twitter.com" target="_blank">
                            <Twitter className="w-5 h-5 hover:text-primary transition" />
                        </Link>
                        <Link href="https://wa.me/971501234567" target="_blank">
                            <MessageCircle className="w-5 h-5 hover:text-primary transition" />
                        </Link>
                    </div>
                </div>

                {/* Right Column: Links */}
                <div className="md:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-2">Quick Links</h4>
                        <ul className="space-y-1 text-gray-700">
                            {categories.slice(0, 8).map((category) => (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        className="hover:text-primary transition bg-transparent border-0 p-0 m-0 text-left cursor-pointer"
                                        onClick={() =>
                                            handleCategoryClick(category.slug)
                                        }
                                        suppressHydrationWarning
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legals */}
                    <div>
                        <h4 className="font-semibold mb-2">Legals</h4>
                        <ul className="space-y-1 text-gray-700">
                            {[
                                "Shipping & Returns",
                                "Shipping Policy",
                                "Privacy Policy",
                                "Terms & Conditions",
                            ].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="hover:text-primary transition"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Other Links */}
                    <div>
                        <h4 className="font-semibold mb-2">Other Links</h4>
                        <ul className="space-y-1 text-gray-700">
                            {[
                                { label: "Blogs", href: "/blogs" },
                                { label: "Contact Us", href: "#" },
                                { label: "Visit Us", href: "#" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-primary transition"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* TARAH Image Background */}
            <div className="w-full mt-5 flex items-center justify-center h-auto relative sm:h-40">
                <Image
                    src="/TARAH.svg"
                    alt="TARAH"
                    className="object-contain object-center"
                    width={900}
                    height={400}
                />
            </div>
        </div>
    );
};

export default Footer;
