import { create } from "zustand";
import axios from "axios";
import { CheckoutOrder, CheckoutFormValues } from "@/types/checkout";
import { useSession } from "next-auth/react";
import { useCartStore } from "./cartStore";

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
    orders: CheckoutOrder[];
    returns: Refund[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    fetchReturns: () => Promise<void>;
    createOrder: (values: CheckoutFormValues) => Promise<CheckoutOrder>;
    createStripePaymentIntent: (orderId: string, amount: number) => Promise<{url: string}>;
    verifyOrderPayment: (orderId: string) => Promise<void>;
    cancelOrder: (orderId: string) => Promise<void>;
    requestReturn: (orderId: string, itemId: string, reason: string) => Promise<void>;
    processRefund: (transactionId: string, amount: number, reason?: string) => Promise<void>;
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

    createOrder: async (values: CheckoutFormValues) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/api/user/orders", {
                ...values,
                items: useCartStore.getState().items,
                paymentMethod: values.payment.method
            });

            if (response.status !== 201) {
                throw new Error("Failed to create order");
            }

            const order = response.data;
            set((state) => ({ orders: [order, ...state.orders] }));
            
            return order;
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : "Failed to create order",
            });
            throw error; // rethrow to handle in component
        } finally {
            set({ isLoading: false });
        }
    },

    //FIXME: This function should accept orderId, cartId, and addressId
    createStripePaymentIntent: async (orderId: string, amount: number) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post("/api/payment/create-intent", {
                orderId,
                amount,
                metadata: {
                    orderId,
                    userId: useSession().data?.user?.id,
                }
            });

            return response.data;
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : "Failed to create payment intent",
            });
            throw error; // rethrow to handle in component
        } finally {
            set({ isLoading: false });
        }
    },

    verifyOrderPayment: async (orderId: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get(`/api/user/orders/${orderId}/verify-payment`); // Create this route
            await get().fetchOrders(); // refresh orders after verification
            return response.data; // Return the updated order
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : "Failed to verify order payment",
            });
            throw error; // rethrow to handle in component
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

            // if the order was paid, initiate refund
            const order = get().orders.find(ord => ord.id === orderId);
            if (order?.paymentStatus === "CAPTURED") {
                await get().processRefund(
                    order.transactions[0].id,
                    order.totalAmount,
                    "Order cancelled by user" // Reason for refund
                );
            }
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
                itemId, 
                reason 
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

    processRefund: async (transactionId, amount, reason) => {
        set({ isLoading: true, error: null });

        try {
            await axios.post("/api/payment/refund", {
                transactionId,
                amount,
                reason
            });

            await get().fetchOrders(); // refresh orders after refund
            await get().fetchReturns(); // refresh returns after refund
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.error || error.message
                    : "Failed to process refund",
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));