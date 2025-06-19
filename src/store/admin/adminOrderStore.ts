import { create } from 'zustand';
import axios from 'axios';

interface OrderItem {
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customer: {
        id: string;
        name: string;
        email: string;
    }
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

interface AdminOrderStore {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useAdminOrderStore = create<AdminOrderStore>((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/admin/orders');
            set({ orders: response.data });
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

    updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            await axios.patch(`/api/admin/orders/${id}`, { status });

            set((state) => ({
                orders: state.orders.map((order) => 
                    order.id === id ? { ...order, status } : order
            )
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
}))