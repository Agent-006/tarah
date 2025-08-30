import { create } from 'zustand';
import axios from 'axios';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CategoryStore {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    getCategoryBySlug: (slug: string) => Category | undefined;
    getFeaturedCategories: () => Category[];
    getMainCategories: () => Category[];
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        
        try {
            const response = await axios.get('/api/categories');
            set({ 
                categories: response.data.categories || [],
                isLoading: false 
            });
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? (error.response?.data?.message || error.message)
                    : "Failed to fetch categories",
                isLoading: false
            });
        }
    },

    getCategoryBySlug: (slug: string) => {
        return get().categories.find(category => category.slug === slug);
    },

    getFeaturedCategories: () => {
        return get().categories.filter(category => category.featured);
    },

    getMainCategories: () => {
        return get().categories.filter(category => !category.parentId);
    }
}));
