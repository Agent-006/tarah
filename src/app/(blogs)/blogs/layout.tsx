import BlogNavbar from "@/components/blog/blog-navbar";
import Footer from "@/components/Footer";
interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <div>
            <BlogNavbar />
            {children}
            <Footer />
        </div>
    );
}
