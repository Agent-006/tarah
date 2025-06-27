// blogs/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-full" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-t-xl" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
