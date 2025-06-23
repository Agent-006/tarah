// components/ProductSkeleton.tsx
export function ProductSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-8 animate-pulse">
            {/* Image Gallery Skeleton */}
            <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex md:flex-col gap-2 md:w-20">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-20 h-24 bg-gray-200 rounded-md"
                        />
                    ))}
                </div>
                <div className="w-full h-96 bg-gray-200 rounded-lg" />
            </div>

            {/* Product Info Skeleton */}
            <div className="border p-6 rounded-xl shadow-md w-full h-fit max-w-md bg-secondary space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />

                {/* Color Selector Skeleton */}
                <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="flex gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-7 h-7 bg-gray-200 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Size Selector Skeleton */}
                <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="flex gap-2 flex-wrap">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-12 h-8 bg-gray-200 rounded"
                            />
                        ))}
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
            </div>
        </div>
    );
}
