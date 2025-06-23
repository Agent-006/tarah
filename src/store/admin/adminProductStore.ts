import { create } from 'zustand';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discountedPrice: number | undefined;
    published: boolean;
    featured: boolean;
    categories: string[];
    attributes: {
        name: string;
        value: string;
    }[];
    variants: {
        id?: string | undefined;
        name: string;
        sku: string;
        priceOffset: number;
        attributes: {
            name: string;
            value: string;
        }[];
        images: {
            url: string;
            altText?: string;
            isPrimary: boolean;
            order: number;
        }[];
        inventory: {
            stock: number;
            lowStockThreshold: number;
        };
    }[];
}

interface AdminProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<boolean>;
}

export const useAdminProductStore = create<AdminProductStore>((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/admin/products');

            set({ products: response.data });
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    createProduct: async (product) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/admin/products', product);
            set((state) => ({ products: [...state.products, response.data] }));
            return response.data;
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProduct: async (id, data) => {
        try {
        const response = await axios.put(`/api/admin/products?id=${id}`, data, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        
        // Update local state
        set((state) => ({
            products: state.products.map(p => 
            p.id === id ? response.data : p
            ),
        }));
        
        return response.data;
        } catch (error) {
        console.error('Update failed:', error);
        throw error;
        }
    },

    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/admin/products?id=${id}`);
            set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            }));
        return true;
        } catch (error) {
            let errorMessage = 'Failed to delete product';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data.message || error.message;
            }
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    }
}));