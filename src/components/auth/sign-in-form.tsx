"use client";

import { signInSchema, TSignInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const SignInForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const form = useForm<TSignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: TSignInSchema) => {
        try {
            const signInResponse = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInResponse?.error) {
                throw new Error(signInResponse.error);
            }

            if (signInResponse?.ok) {
                toast.success("Sign in successful!");
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            console.error("Sign in error");
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred during sign in."
            );
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">
                                Email Address
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="your@email.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full bg-primary text-secondary rounded-md"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        "Sign In"
                    )}
                </Button>

                <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-sm text-gray-500">
                        Just Register If You
                    </span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                <p className="text-center text-sm text-muted-foreground mt-2">
                    Don't have an account?{" "}
                    <a href="/sign-up" className="font-medium underline">
                        Register Now
                    </a>
                </p>
            </form>
        </Form>
    );
};

export default SignInForm;
