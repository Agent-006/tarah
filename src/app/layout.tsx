import type { Metadata } from "next";
import "./globals.css";

// const IvyMode = Geist_Mono({
//   variable: "--font-ivy-mode",
//   subsets: ["latin"],
// });

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
        <html lang="en">
            <body className={`antialiased`}>{children}</body>
        </html>
    );
}
