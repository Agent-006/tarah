// components/ProductSkeleton.tsx
export function ProductSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                    <div className="h-[340px] w-full rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
            ))}
        </div>
    );
}
