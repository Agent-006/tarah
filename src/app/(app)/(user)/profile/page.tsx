"use client";

import Footer from "@/components/Footer";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/store/profileStore";
import { useAddressStore } from "@/store/addressStore";
import AddressBook from "@/components/profile/AddressBook";
import ProfileDetails from "@/components/profile/ProfileDetails";
import OrderBook from "@/components/profile/OrderBook";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { fetchProfile } = useProfileStore();
    const { fetchAddresses } = useAddressStore();

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
            fetchAddresses();
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, fetchProfile, fetchAddresses, router]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-900 min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-10">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full max-w-xs">
                        <TabsTrigger value="profile">
                            Profile Details
                        </TabsTrigger>
                        <TabsTrigger value="addresses">
                            Address Book
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-6">
                        <ProfileDetails />
                    </TabsContent>

                    <TabsContent value="addresses" className="mt-6">
                        <AddressBook />
                    </TabsContent>

                    <TabsContent value="orders" className="mt-6">
                        <OrderBook />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default ProfilePage;
