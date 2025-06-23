import { create } from "zustand";
import axios from "axios";

interface WishlistItem {
    id: string;
    product: {
        id: string,
        name: string;
        slug: string;
        images: { url: string }[];
        variants: {
            attributes: { name: string; value: string }[];
            inventory?: { stock: number };
        }[];
        basePrice: number;
        discountedPrice?: number;
    };
}

interface WishlistStore {
    items: WishlistItem[];
    isLoading: boolean;
    error: string | null;
    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/user/wishlist");
            set({ items: response.data});
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error) 
                    ? (error.response?.data?.message || error.message)
                    : "Failed to fetch wishlist"
            });
        } finally {
            set({ isLoading: false });
        }
    },

    addToWishlist: async (productId) => {
        try {
            const response = await axios.post("/api/user/wishlist", { productId });
            set((state) => ({
                items: [...state.items, response.data]
            }));
            await get().fetchWishlist(); // Refresh wishlist after adding
            return response.data; // Return the added item
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            throw error;
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            await axios.delete("api/user/wishlist", { data: { productId } });
            set((state) => ({
                items: state.items.filter(item => item.product.id !== productId)
            }));
            await get().fetchWishlist(); // Refresh wishlist after removing
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
            throw error;
        }
    },

    isInWishlist: (productId) => {
        return get().items.some(item => item.product.id === productId);
    }
}));