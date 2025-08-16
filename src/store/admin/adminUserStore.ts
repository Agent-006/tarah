import { create } from 'zustand';
import axios from 'axios';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminUserStore {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useAdminUserStore = create<AdminUserStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/admin/customers');
      set({ users: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message || error.message || 'An unexpected error occurred' });
      } else {
        set({ error: 'An unexpected error occurred' });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
