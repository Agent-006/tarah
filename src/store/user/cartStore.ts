import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

type CartItem = {
    id: string;
    slug: string;
    productId: string;
    variantId: string;
    name: string;
    price: number;
    size: string;
    color: string;
    image: string;
    quantity: number;
}

type CartState = {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    initializeCart: () => Promise<void>;
    syncWithDatabase: () => Promise<void>;
    addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeItem: (productId: string, variantId: string) => Promise<void>;
    updateQuantity: (ProductId: string, variantId: string, change: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState> () (
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            initializeCart: async () => {
                if (get().items.length === 0) {
                    await get().syncWithDatabase();
                }
            },

            syncWithDatabase: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.get('/api/user/cart');
                    const dbItems = response.data?.items || [];

                    const transformedItems = dbItems.map((item: any) => ({
                        id: item.id,
                        slug: item.product.slug,
                        productId: item.productId,
                        variantId: item.variantId,
                        name: item.product.name,
                        price: Number(item.product.discountedPrice || item.product.basePrice),
                        size: item.variant.attributes.find((a: any) => a.name === 'Size')?.value || '',
                        color: item.variant.attributes.find((a: any) => a.name === 'Color')?.value || '',
                        image: item.variant.images?.[0]?.url || item.product.coverImage?.[0]?.url || '',
                        quantity: item.quantity,
                    }));

                    set({ items: transformedItems });
                } catch (error) {
                    set({ 
                        error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to sync cart with database',
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            addItem: async (item ) => {
                set({ isLoading: true, error: null });
                try {
                    set((state) => {
                        const existing = state.items.find(
                            i => i.productId === item.productId && i.variantId === item.variantId
                        );
                        return {
                            items: existing
                                ? state.items.map(i =>
                                    i.productId === item.productId && i.variantId === item.variantId
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                                )
                                : [...state.items, { ...item, id: Date.now().toString() }]
                        };
                    });

                    await axios.post('/api/user/cart', {
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    });
                    
                    await get().syncWithDatabase(); // Refresh the cart
                } catch (error) {
                    set((state) => ({
                        items: state.items.filter(i => 
                            !(i.productId === item.productId && i.variantId === item.variantId) ||
                            i.quantity > item.quantity
                        ),
                        error: axios.isAxiosError(error) 
                            ? error.response?.data?.error || error.message 
                            : 'Failed to add item'
                    }));
                } finally {
                    set({ isLoading: false });
                }
            },

            removeItem: async (productId, variantId) => {
                set({ isLoading: true, error: null });
                try {

                    set((state) => ({
                        items: state.items.filter(
                            i => !(i.productId === productId && i.variantId === variantId)
                        )
                    }));
                    
                    await axios.delete('/api/user/cart', {
                        data: {
                            productId,
                            variantId,
                        }
                    });

                    await get().syncWithDatabase(); // Refresh the cart
                } catch (error) {
                    await get().syncWithDatabase(); // Ensure we have the latest state
                    set({
                        error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to remove item from cart',
                    });
                } finally {
                    set({ isLoading: false });
                }
            },
            
            updateQuantity: async (productId, variantId, change) => {
                set({ isLoading: true, error: null })
                try {
                    set((state) => ({
                        items: state.items.map(i => 
                            i.productId === productId && i.variantId === variantId
                                ? { ...i, quantity: Math.max(1, i.quantity + change) }
                                : i
                        ).filter(i => i.quantity > 0)
                    }));
                    
                    await axios.post('/api/user/cart', {
                        productId,
                        variantId,
                        quantity: change,
                    });
                    await get().syncWithDatabase(); // Refresh the cart
                } catch (error) {
                    await get().syncWithDatabase(); // Refresh the cart
                    set({
                        error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to update item quantity',
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            clearCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.delete('/api/user/cart/clear');
                    if (response.status === 200) {
                        set({ items: [] });
                        await get().syncWithDatabase();
                    }
                } catch (error) {
                    await get().syncWithDatabase();
                    set({
                        error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to clear cart',
                    });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'cart-storage', // unique name for the storage
            partialize: (state) => ({ items: state.items }), // only persist items
            // Add version to handle future migrations
            version: 1,
            migrate: (persistedState, version) => {
                if (version === 0) {
                // Migration from v0 to v1
                return { 
                    ...persistedState as any,
                    items: (persistedState as any).items.map((item: any) => ({
                    ...item,
                    variantId: item.variantId || 'default-variant' // Add default if missing
                    }))
                };
                }
                return persistedState as CartState;
            }
        }
    )
);

// Initialize the cart store when the application starts
useCartStore.getState().initializeCart();