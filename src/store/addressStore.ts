import axios from "axios";
import { create } from "zustand";

interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
}

interface AddressStore {
    addresses: Address[];
    isLoading: boolean;
    error: string | null;
    fetchAddresses: () => Promise<void>;
    addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
    updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressStore>((set) => ({
    addresses: [],
    isLoading: false,
    error: null,

    fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/user/addresses");
            set({ addresses: response.data });
        } catch (error) {
            set({ error: axios.isAxiosError(error) 
                ? (error.response?.data?.message || error.message)
                : "An unexpected error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },

    addAddress: async (address) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/api/user/addresses", {
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                isDefault: address.isDefault,
            });
            set((state) => ({
                addresses: [...state.addresses, response.data]
            }));
        } catch (error) {
            set({ error: axios.isAxiosError(error)
                ? (error.response?.data?.message || error.message)
                : "An unexpected error occurred." });
            throw error; // Re-throw to handle it in the component if needed
        } finally {
            set({ isLoading: false });
        }
    },

    updateAddress: async (id, address) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`/api/user/addresses/${ id }`, address);
            set((state) => ({
                addresses: state.addresses.map((addr) => {
                    return addr.id === id
                        ? response.data 
                        : addr;
                }),
            }));
            return response.data; // Return the updated address for further use if needed
        } catch (error) {
            set({ error: axios.isAxiosError(error)
                ? (error.response?.data?.message || error.message)
                : "An unexpected error occurred." });
            throw error; // Re-throw to handle it in the component if needed
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAddress: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/user/addresses/${id}`);
            set((state) => ({
                addresses: state.addresses.filter((addr) => {
                    return addr.id !== id;
                }),
            }));
        } catch (error) {
            set({ error: axios.isAxiosError(error)
                ? (error.response?.data?.message || error.message)
                : "An unexpected error occurred."
            });
            throw error; // Re-throw to handle it in the component if needed
        } finally {
            set({ isLoading: false });
        }
    },

    setDefaultAddress: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.patch('/api/user/addresses/set-default', { id });
            set((state) => ({
                addresses: state.addresses.map((addr) => ({
                    ...addr,
                    isDefault: addr.id === id ? true : false,
                })),
            }));
        } catch (error) {
            set({ error: axios.isAxiosError(error)
                ? (error.response?.data?.message || error.message)
                : "An unexpected error occurred."
            });
            throw error; // Re-throw to handle it in the component if needed
        } finally {
            set({ isLoading: false });
        }
    }
}));