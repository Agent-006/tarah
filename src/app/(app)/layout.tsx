import Navbar from "@/components/Navbar";
interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <div>
            <header className="flex flex-col gap-1">
                <Navbar />
            </header>
            {children}
        </div>
    );
}
