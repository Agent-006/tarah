import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="text-gray-600 max-w-md">
                    Sorry, we couldn't find the page you're looking for. 
                    It might have been moved, deleted, or you entered the wrong URL.
                </p>
                <div className="space-x-4">
                    <Button asChild>
                        <Link href="/">
                            Go Home
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/products">
                            Browse Products
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
