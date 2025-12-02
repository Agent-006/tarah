import { create } from 'zustand';
import axios from 'axios';
import { BlogPost, BlogCategory, BlogTag, Author } from '@prisma/client';

interface BlogPostWithRelations extends BlogPost {
    author: Author;
    categories: BlogCategory[];
    tags: BlogTag[];
    _count: {
        views: number;
    };
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
        published?: string;
    }) => Promise<void>;
    fetchPostBySlug: (slug: string) => Promise<void>;
    fetchPopularPosts: () => Promise<void>;
    clearCurrentPost: () => void;
    incrementViewCount: (slug: string) => Promise<number>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
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
            const { page = 1, limit = 9, category, tag, search, published = "true" } = params;

            const response = await axios.get('/api/blog/posts', {
                params: {
                    page,
                    limit,
                    category,
                    tag,
                    search,
                    published
                },
            });

            set({
                posts: response.data.posts,
                meta: {
                    total: response.data.meta.total,
                    page: response.data.meta.page,
                    limit: response.data.meta.limit,
                    totalPages: response.data.meta.pages,
                },
            });
        } catch (error) {
            console.error('Fetch posts error:', error);
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
            console.error('Fetch post by slug error:', error);
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
                    published: 'true',
                },
            });
            set({ popularPosts: response.data.posts });
        } catch (error) {
            console.error('Fetch popular posts error:', error);
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
        set({ currentPost: null, error: null });
    },

    incrementViewCount: async (slug: string) => {
        try {
            const response = await axios.post(`/api/blog/posts/${slug}/views`);
            return response.data.views as number;
        } catch (error) {
            console.error('Increment view count error:', error);
            return 0;
        }
    },
}));