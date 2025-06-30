"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    profileSchema,
    TProfileSchema,
} from "@/schemas/userSchema/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useProfileStore } from "@/store/user/profileStore";
import { Loader2 } from "lucide-react";

const ProfileDetails = () => {
    const { profile, isLoading, updateProfile } = useProfileStore();

    const form = useForm<TProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            fullName: profile.fullName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            // currentPassword: "", // Optional for update operations
            // newPassword: "", // Optional for update operations
            // confirmPassword: "", // Optional for update operations
        },
    });

    useEffect(() => {
        const { firstName, lastName, fullName, email, phone } = profile;

        if (profile) {
            form.reset({
                firstName: firstName || "",
                lastName: lastName || "",
                fullName: fullName || "",
                email: email || "",
                phone: phone || "",
                // currentPassword: "", // Optional for update operations
                // newPassword: "", // Optional for update operations
                // confirmPassword: "", // Optional for update operations
            });
        }
    }, [profile, form]);

    const onSubmit = async (data: TProfileSchema) => {
        try {
            const response = await updateProfile(data);
            toast.success(
                `${response?.message || "Profile updated successfully!"}`
            );
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
            console.error("Profile update error:", error);
        }
    };

    return (
        <div className="w-full bg-secondary p-8 rounded-md border border-gray-200  shadow-xl">
            <h1 className="text-xl font-medium mb-6">Edit Your Profile</h1>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/* Name & Address Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700">
                                        First Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700">
                                        Last Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Last Name"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700">
                                        Phone Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your full address"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-700">
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your full address"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel className="text-sm text-gray-700">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            className="h-10 rounded-none"
                                            {...field}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Password Section */}
                    {/* <div className="pt-2 space-y-4">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Password Changes
                        </h2>

                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Current Password"
                                            type="password"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="New Password"
                                            type="password"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm Password"
                                            type="password"
                                            className="h-10 rounded-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}

                    {/* Button Group */}
                    <div className="flex justify-end gap-4 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ProfileDetails;
