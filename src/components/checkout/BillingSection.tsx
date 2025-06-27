// components/checkout/BillingSection.tsx
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

export const BillingSection = () => {
    const { control, watch } = useFormContext();
    const sameAsShipping = watch("billing.sameAsShipping");

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Billing Information</h2>
            <FormField
                control={control}
                name="billing.sameAsShipping"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                        <FormControl>
                            <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </FormControl>
                        <FormLabel className="!mt-0">
                            Same as shipping address
                        </FormLabel>
                    </FormItem>
                )}
            />

            {!sameAsShipping && (
                <>
                    <FormField
                        control={control}
                        name="billing.address"
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
                            name="billing.city"
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
                            name="billing.state"
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
                            name="billing.postalCode"
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
                            name="billing.country"
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
                </>
            )}
        </div>
    );
};
