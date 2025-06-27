// components/checkout/ContactSection.tsx
"use client";

import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export const ContactSection = () => {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="contact.firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="contact.lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name="contact.email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="contact.phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                            <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
