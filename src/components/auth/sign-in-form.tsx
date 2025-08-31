"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signInSchema, TSignInSchema } from "@/schemas/signInSchema";
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
        console.log("Starting sign in attempt...");

        const signInResponse = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        console.log("SignIn response:", signInResponse);

        // Handle error case
        if (signInResponse?.error) {
            console.log("SignIn error detected:", signInResponse.error);

            let errorMessage = "An unexpected error occurred during sign in.";

            // Handle specific NextAuth error messages
            switch (signInResponse.error) {
                case "CredentialsSignin":
                    errorMessage =
                        "Invalid email or password. Please check your credentials and try again.";
                    break;
                case "Invalid password":
                    errorMessage =
                        "The password you entered is incorrect. Please try again.";
                    break;
                case "User not found":
                    errorMessage =
                        "No account found with this email address. Please check your email or register.";
                    break;
                case "Configuration":
                    errorMessage =
                        "There was a configuration error. Please try again later.";
                    break;
                case "AccessDenied":
                    errorMessage =
                        "Access denied. Please contact support if you believe this is an error.";
                    break;
                case "Verification":
                    errorMessage =
                        "Please verify your account before signing in.";
                    break;
                default:
                    // For any other error, still show user-friendly message
                    if (
                        signInResponse.error.toLowerCase().includes("password")
                    ) {
                        errorMessage =
                            "The password you entered is incorrect. Please try again.";
                    } else if (
                        signInResponse.error.toLowerCase().includes("email")
                    ) {
                        errorMessage =
                            "No account found with this email address. Please check your email or register.";
                    } else {
                        errorMessage = signInResponse.error;
                    }
            }

            console.log("Showing error message:", errorMessage);
            toast.error(errorMessage);
            return; // Exit early on error
        }

        // Handle success case
        if (signInResponse?.ok) {
            console.log("SignIn successful, fetching session...");
            try {
                // Fetch session to get user role
                const res = await fetch("/api/auth/session");
                const session = await res.json();
                let redirectTo = callbackUrl;
                if (session?.user?.role === "ADMIN") {
                    redirectTo = "/admin/dashboard";
                } else if (session?.user?.role === "CUSTOMER") {
                    // If callbackUrl is an admin route, force home
                    if (callbackUrl.startsWith("/admin")) {
                        redirectTo = "/";
                    }
                }
                toast.success("Sign in successful!");
                router.push(redirectTo);
                router.refresh();
            } catch (sessionError) {
                console.error("Error fetching session:", sessionError);
                toast.error(
                    "Sign in successful, but couldn't fetch user details. Please refresh the page."
                );
            }
            return;
        }

        // If we get here, something unexpected happened
        console.log("Unexpected sign in response:", signInResponse);
        toast.error("Sign in failed for unknown reason. Please try again.");
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

                <div className="space-y-2 mt-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/sign-up"
                            className="font-medium underline text-primary hover:text-primary/80 transition-colors"
                        >
                            Register Now
                        </a>
                    </p>

                    <p className="text-center text-sm text-muted-foreground">
                        Forgot your password?{" "}
                        <a
                            href="/forgot-password"
                            className="font-medium underline text-primary hover:text-primary/80 transition-colors"
                        >
                            Reset Password
                        </a>
                    </p>
                </div>
            </form>
        </Form>
    );
};

export default SignInForm;
