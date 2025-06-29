"use client";

import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Mail } from "lucide-react";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        setIsLoading(true);

        try {
            const response = await axios.post(`/api/auth/forgot-password`, {
                email: data.email,
            });

            console.log("Response from forgot password API:", response.data);

            toast.success("Reset code sent to your email!");
            form.reset();

            if (response.data.success) {
                router.push(`/reset-password/${response?.data?.id}`);
            }
        } catch (error) {
            console.error("Error sending reset code:", error);
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data.message ||
                    "An error occurred while sending the reset code.";
                form.setError("email", {
                    type: "manual",
                    message: errorMessage,
                });
                toast.error(errorMessage);
            } else {
                form.setError("email", {
                    type: "manual",
                    message:
                        "An unexpected error occurred. Please try again later.",
                });
                toast.error(
                    "An unexpected error occurred. Please try again later."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reset Code
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;
