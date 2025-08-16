"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const BlogNavbar = () => {

    return (
        <nav className="relative flex items-center p-4 bg-secondary min-h-[64px]">
            {/* Centered Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 mt-1">
                <Link href="/" className="flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={100}
                        height={50}
                        style={{ height: "auto" }}
                        priority
                    />
                </Link>
            </div>
        </nav>
    );
};

export default BlogNavbar;
