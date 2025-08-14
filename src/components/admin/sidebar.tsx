"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Shirt,
    SettingsIcon,
    LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { signOut } from "next-auth/react";

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
            href:"/admin/categories",
            icon: Shirt,
            label: "Categories",
        }
    ];

    return (
        <div className="w-64 h-full flex flex-col border-r bg-background">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold tracking-tight text-left">Admin Panel</h1>
            </div>

            <nav className="flex-1 p-4 flex flex-col justify-between">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} passHref>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full flex items-center gap-3 justify-start px-4 py-2 rounded-md transition-colors text-left",
                                        pathname === item.href &&
                                            "bg-accent text-accent-foreground font-semibold"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-base">{item.label}</span>
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div>
                    <Separator className="my-6" />

                    <Link href="/admin/settings" passHref>
                        <Button
                            variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
                            className={cn(
                                "w-full flex items-center gap-3 justify-start px-4 py-2 rounded-md transition-colors mb-2 text-left",
                                pathname === "/admin/settings" &&
                                    "bg-accent text-accent-foreground font-semibold"
                            )}
                        >
                            <SettingsIcon className="w-5 h-5" />
                            <span className="text-base">Settings</span>
                        </Button>
                    </Link>
                    <Button
                        onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
                        variant="ghost"
                        className="w-full flex items-center gap-3 justify-start px-4 py-2 rounded-md text-destructive font-semibold hover:underline transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-base">Logout</span>
                    </Button>
                </div>
            </nav>
        </div>
    );
}
