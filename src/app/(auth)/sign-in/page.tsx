// app/sign-in/page.tsx
import SignInForm from "@/components/auth/sign-in-form";
import Image from "next/image";

const SignInPage = () => {
    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 p-6">
            {/* Form Section */}
            <div className="flex flex-col justify-center px-8 py-12 max-w-md w-full mx-auto">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Welcome back!</h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your credentials to sign in
                        </p>
                    </div>
                    <SignInForm />
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

export default SignInPage;
