"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AllProductsPage from '@/components/AllProducts';

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    return <AllProductsPage initialCategory={category} />;
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsPageContent />
        </Suspense>
    );
}
