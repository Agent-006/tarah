import React from "react";
import Image from "next/image";
import ResetPasswordForm from "@/components/auth/reset-password-form";

const ResetPasswordPage = () => {
    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 p-6">
            {/* Form Section */}
            <div className="flex flex-col justify-center px-8 py-12 max-w-md w-full mx-auto">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">
                            Reset your password
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your new password below
                        </p>
                    </div>
                    <ResetPasswordForm />
                </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block overflow-hidden">
                <Image
                    src="/assets/login_signup_model2.jpg"
                    alt="Reset Password Visual"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                />
            </div>
        </div>
    );
};

export default ResetPasswordPage;
