import { create } from "zustand";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: {
    url: string;
    altText?: string;
    isPrimary: boolean;
    order: number;
  }[];
  basePrice: number;
  discountedPrice: number | undefined;
  published: boolean;
  featured: boolean;
  categories: string[];
  attributes: {
    name: string;
    value: string;
  }[];
  variants: {
    id?: string | undefined;
    name: string;
    sku: string;
    priceOffset: number;
    variantAttributes: {
      name: string;
      value: string;
    }[];
    images: {
      url: string;
      altText?: string;
      isPrimary: boolean;
      order: number;
    }[];
    inventory: {
      stock: number;
      lowStockThreshold: number;
    };
  }[];
}

interface AdminProductStore {
  products: Product[];
  product?: Product;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export const useAdminProductStore = create<AdminProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/admin/products");

      set({ products: response.data });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data.message || error.message
          : "An unexpected error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/admin/products?id=${id}`);
      set({ product: response.data });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data.message || error.message
          : "An unexpected error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/admin/products", product);
      set((state) => ({ products: [...state.products, response.data] }));
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : "An unexpected error occurred";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      // Include the ID in the data payload as required by the API
      const requestData = { ...data, id };

      const response = await axios.put("/api/admin/products", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Update local state
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data : p)),
        product: response.data, // Also update the current product if it's being edited
      }));

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : "An unexpected error occurred";
      set({ error: errorMessage });
      console.error("Update failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/admin/products?id=${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete product";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.message || error.message;
      }
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));
