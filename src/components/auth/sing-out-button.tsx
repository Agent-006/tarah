"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOutButton = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const signOutResponse = await signOut({
                redirect: false, // Prevent automatic redirection
            });

            toast.success("Sign out successful!");
            router.push("/sign-in"); // Redirect to sign-in page or any other page you prefer
            router.refresh(); // Refresh the page to update the state
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred during sign out."
            );
        }
    };

    return (
        <Button variant="outline" onClick={handleSignOut}>
            Sign Out
        </Button>
    );
};

export default SignOutButton;
