import { create } from "zustand";
import axios from "axios";

interface OrderItem {
    id: string;
    variant: {
        id: string;
        name: string;
        product: {
            name: string;
            images: {
                url: string;
            }[];
        };
        images: {
            url: string;
        }[];
    };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
    };
}

interface Refund {
    id: string;
    status: string;
    amount: number;
    reason?: string;
    createdAt: string;
    transaction: {
        order: {
            items: {
                variant: {
                    product: {
                        name: string;
                    };
                };
                quantity: number;
            }[];
        };
    };
}

interface OrderStore {
    orders: Order[];
    returns: Refund[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    fetchReturns: () => Promise<void>;
    cancelOrder: (orderId: string) => Promise<void>;
    requestReturn: (orderId: string, itemId: string, reason: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [],
    returns: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/user/orders');
            set({ orders: response.data });
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : "Failed to fetch orders",
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchReturns: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/user/orders/returns");
            set({ returns: response.data });
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.error || error.message
                    : "Failed to fetch returns",
            });
        } finally {
            set({ isLoading: false });
        }
    },

    cancelOrder: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
            await axios.patch(`/api/user/orders/${orderId}/cancel`);
            await get().fetchOrders(); // refresh orders after cancellation
        } catch (error) {
            set({ 
                error: axios.isAxiosError(error)
                    ? error.response?.data?.error || error.message
                    : "Failed to cancel order",
            });
        } finally {
            set({ isLoading: false });
        }
    },

    requestReturn: async (orderId, itemId, reason) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`/api/user/orders/${orderId}/return`, {
                itemId, reason 
            });
            await get().fetchOrders(); // refersh orders
            await get().fetchReturns(); // refresh returns
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                        ? error.response?.data?.error || error.message
                        : "Failed to initiate return request"
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));