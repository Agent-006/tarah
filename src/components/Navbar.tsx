"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Heart, Menu, ShoppingCart, User } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

// ✅ Importing Select from Shadcn UI
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Navbar = () => {
    return (
        <>
            {/* Top Banner */}
            <div className="flex justify-center items-center h-12 bg-primary text-secondary text-sm md:text-base px-2">
                <h3>FLAT 15% OFF ON ORDERS ABOVE 3000/-</h3>
            </div>

            {/* Navbar */}
            <div className="relative flex items-center justify-between p-4 md:justify-center">
                {/* Hamburger Drawer - Small devices only */}
                <div className="block md:hidden">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Menu className="w-6 h-6" />
                        </DrawerTrigger>
                        <DrawerContent className="p-4 h-full">
                            <DrawerHeader className="hidden">
                                <DrawerTitle>Menu</DrawerTitle>
                            </DrawerHeader>

                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold">
                                    Categories
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/docs">New Arrivals</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs">
                                            Jewellery & Accessories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/docs">Indian</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs">Western</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Plus Size - Indian</Link>
                                    </li>
                                    <li>
                                        <Link href="#">
                                            Plus Size - Western
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/docs">Night Dress</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs">माँ + Beti</Link>
                                    </li>
                                </ul>

                                <hr className="my-4" />

                                <h4 className="text-lg font-semibold">
                                    Your Account
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <Link href="/profile">Profile</Link>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Heart className="w-4 h-4" />
                                        <Link href="/wishlist">Wishlist</Link>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        <Link href="/cart">Cart</Link>
                                    </li>
                                </ul>

                                <hr className="my-4" />

                                {/* ✅ Currency Dropdown */}
                                <div className="space-y-2">
                                    <h4 className="text-lg font-semibold">
                                        Currency
                                    </h4>
                                    <Select defaultValue="INR">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">
                                                India (INR ₹)
                                            </SelectItem>
                                            <SelectItem value="USD">
                                                USA (USD $)
                                            </SelectItem>
                                            <SelectItem value="EUR">
                                                Europe (EUR €)
                                            </SelectItem>
                                            <SelectItem value="GBP">
                                                UK (GBP £)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                {/* Centered Logo (absolute on small screens) */}
                <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={100}
                            height={50}
                        />
                    </Link>
                </div>

                {/* Search (Desktop only) */}
                <div className="hidden md:block absolute left-4">
                    <Input
                        type="text"
                        placeholder="Search for products, brands and more"
                        className="w-72 rounded-full"
                        aria-label="Search"
                    />
                </div>

                {/* Right icons (Desktop only) */}
                <div className="hidden md:flex items-center gap-4 absolute right-4">
                    <span className="hidden md:flex items-center gap-2">
                        <div className="flex items-center">
                            <Select defaultValue="INR">
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">
                                        India (INR ₹)
                                    </SelectItem>
                                    <SelectItem value="USD">
                                        USA (USD $)
                                    </SelectItem>
                                    <SelectItem value="EUR">
                                        Europe (EUR €)
                                    </SelectItem>
                                    <SelectItem value="GBP">
                                        UK (GBP £)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </span>
                    <span className="flex items-center gap-3">
                        <Link href="/wishlist">
                            <Heart />
                        </Link>
                        <Link href="/cart">
                            <ShoppingCart />
                        </Link>
                        <Link href="/profile">
                            <User />
                        </Link>
                    </span>
                </div>
            </div>

            {/* Navigation Menu - Desktop only */}
            <div className="w-full hidden md:flex items-center justify-center z-10">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        {[
                            "New Arrivals",
                            "Jewellery & Accessories",
                            "Indian",
                            "Western",
                            "Night Dress",
                            "माँ + Beti",
                        ].map((label, i) => (
                            <NavigationMenuItem key={i}>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/docs">{label}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="relative">
                                Plus Size
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Indian</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Western</Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </>
    );
};

export default Navbar;
