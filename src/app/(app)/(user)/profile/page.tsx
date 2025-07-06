"use client";

import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession, signOut } from "next-auth/react";
import { useProfileStore } from "@/store/user/profileStore";
import { useAddressStore } from "@/store/user/addressStore";
import AddressBook from "@/components/profile/AddressBook";
import ProfileDetails from "@/components/profile/ProfileDetails";
import OrderBook from "@/components/profile/OrderBook";
import Link from "next/link";
import { Loader2, LogOut } from "lucide-react";
import ReturnBook from "@/components/profile/ReturnBook";
import CalcellationBook from "@/components/profile/CalcellationBook";
import { Button } from "@/components/ui/button";

const sidebarItemBase =
    "cursor-pointer ml-3 transition-colors duration-150 rounded px-2 py-1";
const sidebarItemActive =
    "text-primary bg-primary/10 font-semibold";
const sidebarItemInactive =
    "text-muted-foreground hover:text-primary";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { fetchProfile } = useProfileStore();
    const { fetchAddresses } = useAddressStore();

    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
            fetchAddresses();
        } else if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, fetchProfile, fetchAddresses, router]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-10">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        {/* Left Sidebar */}
                        <aside className="space-y-8 text-sm font-medium bg-card rounded-lg p-6 shadow-sm border">
                            <div>
                                <h3 className="mb-2 text-base font-semibold text-primary">
                                    Manage My Account
                                </h3>
                                <ul className="space-y-2">
                                    <li
                                        onClick={() => setActiveTab("profile")}
                                        className={`${sidebarItemBase} ${
                                            activeTab === "profile"
                                                ? sidebarItemActive
                                                : sidebarItemInactive
                                        }`}
                                    >
                                        My Profile
                                    </li>
                                    <li
                                        onClick={() =>
                                            setActiveTab("addresses")
                                        }
                                        className={`${sidebarItemBase} ${
                                            activeTab === "addresses"
                                                ? sidebarItemActive
                                                : sidebarItemInactive
                                        }`}
                                    >
                                        Address Book
                                    </li>
                                    <li
                                        onClick={() =>
                                            setActiveTab("payment_options")
                                        }
                                        className={`${sidebarItemBase} ${
                                            activeTab === "payment_options"
                                                ? sidebarItemActive
                                                : sidebarItemInactive
                                        }`}
                                    >
                                        My Payment Options
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-2 text-base font-semibold text-primary">
                                    My Orders
                                </h3>
                                <ul className="space-y-2">
                                    <li
                                        onClick={() => setActiveTab("orders")}
                                        className={`${sidebarItemBase} ${
                                            activeTab === "orders"
                                                ? sidebarItemActive
                                                : sidebarItemInactive
                                        }`}
                                    >
                                        All Orders
                                    </li>
                                    <li
                                        onClick={() => setActiveTab("returns")}
                                        className={`${sidebarItemBase} ${
                                            activeTab === "returns"
                                                ? sidebarItemActive
                                                : sidebarItemInactive
                                        }`}
                                    >
                                        My Returns
                                    </li>
                                    <li
                                        onClick={() =>
                                            setActiveTab("cancellations")
                                        }
                                        className={`${sidebarItemBase} ${
                                            activeTab === "cancellations"
                                                ? sidebarItemActive
                                                : sidebarItemInactive
                                        }`}
                                    >
                                        My Cancellations
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <Link
                                    href={"/wishlist"}
                                    className="mb-2 text-base font-semibold block text-primary hover:underline"
                                >
                                    My WishList
                                </Link>
                            </div>
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-2 text-left font-semibold mt-4 transition-colors duration-150 border-destructive text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </Button>
                            </div>
                        </aside>

                        {/* Right Content */}
                        <section className="lg:col-span-3">
                            {/* We keep the TabsList hidden but required */}
                            <TabsList className="hidden">
                                <TabsTrigger value="profile">
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="addresses">
                                    Addresses
                                </TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="space-y-6">
                                <ProfileDetails />
                            </TabsContent>

                            <TabsContent
                                value="addresses"
                                className="space-y-6"
                            >
                                <AddressBook />
                            </TabsContent>

                            <TabsContent value="orders" className="space-y-6">
                                <OrderBook />
                            </TabsContent>

                            <TabsContent value="returns" className="space-y-6">
                                <ReturnBook />
                            </TabsContent>

                            <TabsContent
                                value="cancellations"
                                className="space-y-6"
                            >
                                <CalcellationBook />
                            </TabsContent>
                        </section>
                    </div>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
