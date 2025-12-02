import { create } from 'zustand';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discountedPrice?: number;
    variants?: Variant[];
    coverImage?: ProductImage[];
    categories?: Category[];
    status?: 'available' | 'soldout'; 
}

interface Variant {
    id: string;
    variantAttributes: VariantAttribute[];
    inventory?: {
        stock: number;
    };
    images?: ProductImage[];
}

interface VariantAttribute {
    name: string;
    value: string;
}

interface ProductImage {
    url: string;
    altText?: string;
    order?: number;
}

interface Category {
    id: string;
    name: string;
}

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    fetchProducts: (params: {
        page?: number;
        size?: string | null;
        categorySlug?: string | null;
        inStockOnly?: boolean;
    }) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    
    fetchProducts: async (params) => {
        set({ isLoading: true, error: null });

        try {
            const { page = 1, size, inStockOnly, categorySlug } = params;
            const response = await axios.get('/api/products', {
                params: {
                    page,
                    size,
                    inStockOnly,
                    categorySlug,
                    limit: 8
                }
            });

            const transformedProducts = response.data.products.map((product: Product) => ({
                ...product,
                status: product.variants?.some((v: Variant) => v.inventory && v.inventory.stock > 0)
                    ? 'available' as const
                    : 'soldout' as const,
            }));

            set({
                products: transformedProducts,
                totalPages: response.data.totalPages,
                currentPage: page,
            });
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error) 
                ? (error.response?.data?.message || error.message)
                : "An unexpected error occurred.",
            });
        } finally {
            set({ isLoading: false });
        }
    }
}));