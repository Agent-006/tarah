import { create } from 'zustand';
import axios from 'axios';
import { BlogPost, BlogCategory, BlogTag } from '@prisma/client';

import { deleteImage } from '@/lib/uploadthing';

export interface BlogPostWithRelations extends BlogPost {
    id: string;
    title: string;
    slug: string;
    content: any;
    coverImageKey?: string;
    published: boolean;
    author: {
        id: string;
        fullName: string | null;
    },
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
    allPosts: BlogPostWithRelations[];
    currentEditablePost: BlogPostWithRelations | null;
    isLoading: boolean;
    error: string | null;
    uploadProgress: number;
    fetchAllPosts: () => Promise<void>;
    fetchPostById: (id: string) => Promise<void>;
    createPost: (data: {
        title: string;
        content: any;
        coverImage?: File | null;
    }) => Promise<void>;
    updatePost: (id: string, data: {
        title: string;
        content: any;
        coverImage?: File | null;
        removeCoverImage?: boolean;
    }) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    publishPost: (id: string) => Promise<void>;
    unpublishPost: (id: string) => Promise<void>;
    clearCurrentEditablePost: () => void;
}

export const useAdminBlogStore = create<BlogState>((set) => ({
    allPosts: [],
    currentEditablePost: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
    
    fetchAllPosts: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get('/api/admin/blog/posts');
            set({
                allPosts: response.data,
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

    fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`/api/admin/blog/posts/${id}`);

            set({
                currentEditablePost: response.data,
            });
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while fetching the post.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    createPost: async (data) => {
        set({ isLoading: true, error: null, uploadProgress: 0 });

        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', JSON.stringify(data.content));
            if (data.coverImage) {
                formData.append('coverImage', data.coverImage);
            }
            
            const response = await axios.post('/api/admin/blog/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    set({ uploadProgress: percentCompleted });
                },
            });
            set((state) => ({
                allPosts: [...state.allPosts, response.data],
                uploadProgress: 0,
            }));
        } catch (error: any) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while creating the post.',
                uploadProgress: 0,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    updatePost: async (id: string, data) => {
        set({ isLoading: true, error: null, uploadProgress: 0 });

        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', JSON.stringify(data.content));
            if (data.coverImage) {
                formData.append('coverImage', data.coverImage);
            }
            if (data.removeCoverImage) {
                formData.append('removeCoverImage', 'true');
            }
            
            const response = await axios.put(`/api/admin/blog/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    set({ uploadProgress: percentCompleted });
                },
            });

            if (data.coverImage && response.data.oldImageKey) {
                await deleteImage(response.data.oldImageKey);
            }

            set((state) => ({
                allPosts: state.allPosts.map(post => 
                    post.id === id ? response.data : post
                ),
                currentEditablePost: response.data,
                uploadProgress: 0,
            }));
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while updating the post.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    deletePost: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.delete(`/api/admin/blog/posts/${id}`);

            if (response.data.imageKey) {
                await deleteImage(response.data.imageKey);
            }

            set((state) => ({
                allPosts: state.allPosts.filter(post => post.id !== id),
            }));
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while deleting the post.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    publishPost: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            await axios.post(`/api/admin/blog/posts/${id}/publish`);

            set((state) => ({
                allPosts: state.allPosts.map(post => post.id === id ? { ...post, published: true } : post),
            }));
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while publishing the post.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    unpublishPost: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            await axios.post(`/api/admin/blog/posts/${id}/unpublish`);

            set((state) => ({
                allPosts: state.allPosts.map(post => post.id === id ? { ...post, published: false } : post), 
            }));
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error)
                    ? error.response?.data.message || error.message
                    : 'An unexpected error occurred while unpublishing the post.',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    clearCurrentEditablePost: () => set({ currentEditablePost: null }),
}))