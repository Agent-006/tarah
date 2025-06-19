"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AllProductsPage from '@/components/AllProducts';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    return <AllProductsPage initialCategory={category} />;
}