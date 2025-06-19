"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    Users,
    SettingsIcon,
    LogOutIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/admin/products",
            label: "Products",
            icon: Package,
        },
        {
            href: "/admin/orders",
            label: "Orders",
            icon: ShoppingCart,
        },
        {
            href: "/admin/customers",
            icon: Users,
            label: "Customers",
        },
        {
            href: "/admin/settings",
            icon: Settings,
            label: "Settings",
        },
    ];

    return (
        <div className="w-64 h-full flex flex-col border-r bg-background">
            <div className="p-4 border-b">
                <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Button
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start h-10",
                                    pathname === item.href &&
                                        "bg-accent text-accent-foreground"
                                )}
                            >
                                <Link href={item.href}>
                                    <item.icon className="w-4 h-4 mr-3" />
                                    {item.label}
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>

                <Separator className="my-4" />

                {/* Optional: Add additional sections */}
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-gray-500"
                    >
                        <SettingsIcon className="w-4 h-4 mr-3" />
                        Settings
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-gray-500"
                    >
                        <LogOutIcon className="w-4 h-4 mr-3" />
                        Logout
                    </Button>
                </div>
            </nav>
        </div>
    );
}
