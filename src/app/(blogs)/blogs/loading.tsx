// blogs/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-14">
            <div className="text-center mb-16">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-10 w-full max-w-xl mx-auto mt-4" />
                <Skeleton className="h-4 w-full max-w-2xl mx-auto mt-4" />
            </div>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
