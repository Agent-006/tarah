import { create } from 'zustand';
import axios from 'axios';
import { BlogPost, BlogCategory, BlogTag } from '@prisma/client';

interface BlogPostWithRelations extends BlogPost {
    author: { 
        id: string;
        fullName: string | null;
    }
    categories: {
        category: BlogCategory;
    }[];
    tags: {
        tag: BlogTag;
    }[];
    views: {
        id: string;
    }[];
}

interface BlogState {
    posts: BlogPostWithRelations[];
    popularPosts: BlogPostWithRelations[];
    currentPost: BlogPostWithRelations | null;
    isLoading: boolean;
    error: string | null;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    fetchPosts: (params?: {
        page?: number;
        limit?: number;
        category?: string;
        tag?: string;
        search?: string;
    }) => Promise<void>;
    fetchPostBySlug: (slug: string) => Promise<void>;
    fetchPopularPosts: () => Promise<void>;
    clearCurrentPost: () => void;
    incrementViewCount: (slug: string) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set) => ({
    posts: [],
    popularPosts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    meta: {
        total: 0,
        page: 1,
        limit: 9,
        totalPages: 1,
    },

    fetchPosts: async (params = {}) => {
        set({ isLoading: true, error: null });

        try {
            const { page = 1, limit = 9, category, tag, search } = params;

            const response = await axios.get('/api/blog/posts', {
                params: {
                    page,
                    limit,
                    category,
                    tag,
                    search
                },
            });

            set({
                posts: response.data.posts,
                meta: response.data.meta,
                isLoading: false,
            });
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error) 
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while fetching posts.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPostBySlug: async (slug: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`/api/blog/posts/${slug}`);
            set({
                currentPost: response.data,
            });
        } catch (error) {
            set({
                error: axios.isAxiosError(error) 
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while fetching the post.',
                currentPost: null,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPopularPosts: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get('/api/blog/posts', {
                params: {
                    limit: 3, 
                    sort: 'views', 
                },
            });
            set({
                popularPosts: response.data.data,
            });
        } catch (error) {
            set({
                error: axios.isAxiosError(error) 
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while fetching popular posts.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    clearCurrentPost: () => {
        set({ currentPost: null, error: null, isLoading: false });
    },

    incrementViewCount: async (slug: string) => {
        try {
            set({ isLoading: true, error: null });
            await axios.post(`/api/blog/posts/${slug}/views`);
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error) 
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while incrementing view count.',
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));