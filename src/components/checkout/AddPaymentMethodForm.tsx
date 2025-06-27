// components/checkout/AddPaymentMethodForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

const paymentMethodSchema = z.object({
    type: z.enum(["CREDIT_CARD", "DEBIT_CARD", "UPI"]),
    cardNumber: z.string().min(16, "Must be 16 digits").max(16).optional(),
    cardExpiry: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date")
        .optional(),
    cardCvc: z.string().min(3).max(4).optional(),
    upiId: z.string().email("Must be a valid UPI ID").optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export const AddPaymentMethodForm = () => {
    const form = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: "CREDIT_CARD",
        },
    });

    const paymentType = form.watch("type");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (values: PaymentMethodFormValues) => {
        setIsSubmitting(true);
        try {
            let payload;

            if (values.type === "UPI") {
                payload = {
                    type: "UPI",
                    upiId: values.upiId,
                };
            } else {
                payload = {
                    type: values.type,
                    cardNumber: values.cardNumber,
                    cardExpiry: values.cardExpiry,
                    cardCvc: values.cardCvc,
                };
            }

            const response = await axios.post("/user/payment-methods", payload);
            toast.success("Payment method added successfully");
            // Close dialog or refresh payment methods list
        } catch (error) {
            toast.error("Failed to add payment method");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg">
                            Add Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="CREDIT_CARD">
                                                Credit Card
                                            </SelectItem>
                                            <SelectItem value="DEBIT_CARD">
                                                Debit Card
                                            </SelectItem>
                                            <SelectItem value="UPI">
                                                UPI
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {paymentType !== "UPI" ? (
                            <>
                                <FormField
                                    control={form.control}
                                    name="cardNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Card Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="1234 5678 9012 3456"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            );
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="cardExpiry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Expiry Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="MM/YY"
                                                        {...field}
                                                        onChange={(e) => {
                                                            let value =
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    ""
                                                                );
                                                            if (
                                                                value.length > 2
                                                            ) {
                                                                value = `${value.slice(
                                                                    0,
                                                                    2
                                                                )}/${value.slice(
                                                                    2
                                                                )}`;
                                                            }
                                                            field.onChange(
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cardCvc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Security Code
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="CVC"
                                                        type="password"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    ""
                                                                );
                                                            field.onChange(
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        ) : (
                            <FormField
                                control={form.control}
                                name="upiId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>UPI ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="yourname@upi"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Add Payment Method"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
};
