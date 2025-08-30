"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Heart, Menu, ShoppingCart, User } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/user/cartStore";
import { useProductStore } from "@/store/product/productsStore";
import { useCategoryStore } from "@/store/category/categoryStore";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { fetchProducts } = useProductStore();
    const { categories, fetchCategories } = useCategoryStore();
    const cartQuantity = useCartStore((state) =>
        state.items.reduce((total, item) => total + item.quantity, 0)
    );

    // Fetch categories on component mount
    React.useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories.length, fetchCategories]);

    const handleCategoryClick = (categorySlug: string) => {
        router.push(`/category/${categorySlug}`);
    };

    const closeDrawer = () => {
        const openDialog = document.querySelector('[role="dialog"]');
        if (openDialog) {
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true });
            openDialog.dispatchEvent(escEvent);
        }
    };

    return (
        <>
            {/* Top Banner */}
            <div className="flex justify-center items-center h-12 bg-primary text-secondary text-sm md:text-base px-2">
                <h3>FLAT 15% OFF ON ORDERS ABOVE 3000/-</h3>
            </div>

            {/* Navbar */}
            <div className="relative bg-secondary flex items-center justify-between p-4 md:justify-center">
                {/* Hamburger Drawer - Small devices only */}
                <div className="block md:hidden">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Menu className="w-6 h-6" />
                        </DrawerTrigger>
                        <DrawerContent className="p-4 h-screen">
                            <DrawerHeader className="">
                                <DrawerTitle>Menu</DrawerTitle>
                            </DrawerHeader>

                            <div className="space-y-4 p-4 h-[900px] overflow-y-auto">
                                {/* <h4 className="text-lg font-semibold">
                                    Categories
                                </h4> */}
                                <ul className="space-y-2">
                                    {/* All Products Mobile Nav Item */}
                                    <li key="all-products">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (pathname === "/products") {
                                                    fetchProducts({ page: 1 });
                                                } else {
                                                    router.push("/products");
                                                }
                                                closeDrawer();
                                            }}
                                        >
                                            All Products
                                        </div>
                                    </li>
                                    {/* Dynamic Category Mobile Nav Items */}
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    handleCategoryClick(category.slug);
                                                    closeDrawer();
                                                }}
                                            >
                                                {category.name}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <hr className="my-4" />

                                <h4 className="text-lg font-semibold">
                                    Your Account
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <Link href="/profile" onClick={closeDrawer}>Profile</Link>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Heart className="w-4 h-4" />
                                        <Link href="/wishlist" onClick={closeDrawer}>Wishlist</Link>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        <Link href="/cart" onClick={closeDrawer}>Cart</Link>
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
                            style={{ height: "auto" }}
                            priority
                        />
                    </Link>
                </div>

                {/* Search (Desktop only) */}
                {/* <div className="hidden md:flex items-center gap-2 absolute left-4 bg-white rounded-none px-2 py-1 shadow-md border-[1px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                        />
                    </svg>
                    <Input
                        type="text"
                        placeholder="Search for products, brands and more"
                        className="w-72 border-0 focus:ring-0 outline-none bg-transparent text-sm"
                        aria-label="Search"
                        suppressHydrationWarning
                    />
                </div> */}

                {/* Right icons (Desktop only) */}
                <div className="hidden md:flex items-center gap-4 absolute right-4">
                    <span className="hidden md:flex items-center gap-2">
                        <div className="flex items-center">
                            <Select defaultValue="INR">
                                <SelectTrigger className="w-[140px]" suppressHydrationWarning>
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
                        <Link className="relative" href="/cart">
                            <ShoppingCart />
                            {cartQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartQuantity}
                                </span>
                            )}
                        </Link>
                        <Link href="/profile">
                            <User />
                        </Link>
                    </span>
                </div>
            </div>

            {/* Navigation Menu - Desktop only */}
            <div className="w-full bg-secondary hidden md:flex items-center justify-center z-10">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        {/* All Products Navigation Item */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                                onClick={() => {
                                    if (pathname === "/products") {
                                        fetchProducts({ page: 1 });
                                    } else {
                                        router.push("/products");
                                    }
                                }}
                            >
                                <div className="cursor-pointer">
                                    All Products
                                </div>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Dynamic Category Navigation Items */}
                        {categories.filter(category => !category.parentId).map((category) => (
                            <NavigationMenuItem key={category.id}>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                    onClick={() => handleCategoryClick(category.slug)}
                                >
                                    <div className="cursor-pointer">
                                        {category.name}
                                    </div>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}

                        {/* Plus Size Dropdown (if it has children) */}
                        {categories.find(cat => cat.name.toLowerCase().includes('plus size')) && (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="relative">
                                    Plus Size
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4">
                                        {categories
                                            .filter(category => 
                                                category.name.toLowerCase().includes('plus size') &&
                                                !category.parentId
                                            )
                                            .map((category) => (
                                                <li key={category.id}>
                                                    <NavigationMenuLink asChild>
                                                        <div
                                                            className="cursor-pointer p-2"
                                                            onClick={() => handleCategoryClick(category.slug)}
                                                        >
                                                            {category.name.replace('Plus Size - ', '')}
                                                        </div>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </>
    );
};

export default Navbar;
