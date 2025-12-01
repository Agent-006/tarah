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
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams<{ userId: string }>() as any;
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);

    try {
      const userId = params?.userId;
      if (!userId) {
        toast.error("Missing user identifier. Please retry the link.");
        setIsLoading(false);
        return;
      }
      const response = await axios.post(`/api/auth/reset-password`, {
        id: userId,
        verificationCode: data.verificationCode,
        newPassword: data.newPassword,
      });

      if (
        !response.data.success &&
        response.data.message === "Invalid verification code"
      ) {
        form.setError("verificationCode", {
          type: "manual",
          message: "Invalid verification code. Please try again.",
        });
        toast.error("Invalid verification code. Please try again.");
      }

      toast.success(
        "Password reset successfully! You can now sign in with your new password."
      );

      if (response.data.success) {
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message ||
          "An error occurred while resetting your password.";
        form.setError("verificationCode", {
          type: "manual",
          message: errorMessage,
        });
        toast.error(errorMessage);
      } else {
        form.setError("verificationCode", {
          type: "manual",
          message: "An unexpected error occurred. Please try again later.",
        });
        toast.error("An unexpected error occurred. Please try again later.");
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
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Verification Code
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your verification code" {...field} />
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
              <FormLabel className="text-sm font-medium">
                New Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
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
              <FormLabel className="text-sm font-medium">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
