import React from "react";
import Image from "next/image";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

const ForgotPasswordPage = () => {
    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 p-6">
            {/* Form Section */}
            <div className="flex flex-col justify-center px-8 py-12 max-w-md w-full mx-auto">
                <div className="space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold">
                            Forgot your password?
                        </h1>
                        <p className="text-gray-500 text-base mt-2">
                            Enter your email address and we'll send you a link
                            to reset your password.
                        </p>
                    </div>
                    <div className="rounded-xl shadow-lg bg-white/80 p-6 backdrop-blur-md border border-gray-100">
                        <ForgotPasswordForm />
                    </div>
                    <div className="text-center text-xs text-gray-400 pt-4">
                        <a href="/auth/sign-in" className="underline">
                            Back to Sign In
                        </a>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block overflow-hidden">
                <Image
                    src="/assets/login_signup_model2.jpg" // Replace with actual path
                    alt="Sign In Visual"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
