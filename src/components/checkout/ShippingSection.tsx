// components/checkout/ShippingSection.tsx
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

export const ShippingSection = () => {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <FormField
                control={control}
                name="shipping.address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="shipping.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="shipping.state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="shipping.postalCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="shipping.country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
