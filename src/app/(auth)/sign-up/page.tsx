// app/signup/page.tsx

import { SignUpForm } from "@/components/auth/sign-up-form";
import Image from "next/image";

export default function SignupPage() {
    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Form */}
            <div className="flex flex-col justify-center px-8 py-12 max-w-md w-full mx-auto">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">
                            Create an account
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Fill in the details below to get started
                        </p>
                    </div>
                    <SignUpForm />
                </div>
            </div>

            {/* Right Side: Image */}
            <div className="hidden lg:block overflow-hidden">
                <Image
                    src="/assets/family.jpg"
                    alt="Sign up visual"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover rounded-l-none rounded-r-xl"
                />
            </div>
        </div>
    );
}