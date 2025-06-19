import { create } from 'zustand';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discountedPrice?: number;
    published: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AdminProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
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

    updateProduct: async (id, product) => {
        set({ isLoading: true, error: null });
        try {
            await axios.patch(`/api/admin/products/${id}`, product);

            set((state) => ({
                products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p))
            }));
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

    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/admin/products/${id}`);
            set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            }));
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred',
            });
        } finally {
            set({ isLoading: false });
        }
    }
}));