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
    attributes: VariantAttribute[];
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
        category?: string | null;
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
            const { page = 1, size, inStockOnly, category } = params;
            const response = await axios.get('/api/products', {
                params: {
                    page,
                    size,
                    inStockOnly,
                    category,
                    limit: 8
                }
            });

            const transformedProducts = response.data.products.map((product: any) => ({
                ...product,
                status: product.variants.some((v: any) => v.inventory?.stock > 0)
                    ? 'available'
                    : 'soldout',
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