import Link from "next/link";
import { Button } from "../ui/button";

export function ProductError({
    error,
    onRetry,
}: {
    error: string;
    onRetry: () => void;
}) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
            <h1 className="text-3xl font-semibold mb-6">Product Not Found</h1>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="space-x-4">
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
                <Button variant="outline" onClick={onRetry}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}
