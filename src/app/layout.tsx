import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
    title: "Tarah By Meena",
    description: "Threads of Tradition",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        noimageindex: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`antialiased`}>
                <AuthProvider>
                        {children}
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
