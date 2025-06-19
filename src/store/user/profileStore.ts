import axios from 'axios';
import { create } from 'zustand';

interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
}

interface ProfileStore {
    profile: UserProfile;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: {
        email: "",
        firstName: "",
        lastName: "",
        fullName: "",
        phone: "",
    },
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get('/api/user/profile');

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Failed to fetch profile');
            }

            set({ profile: response.data });
        } catch (error) {
            set({ error: axios.isAxiosError(error) 
                ? (error.response?.data?.message || error.message) 
                : 'An error occurred' });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put('/api/user/profile', profileData);

            if (response?.status !== 200) {
                throw new Error(response.data.message || 'Failed to update profile');
            }

            set({ profile: response.data });
        } catch (error) {
            set({ error: axios.isAxiosError(error)
                ? (error.response?.data?.message || error.message)
                : 'An error occurred' });
        } finally {
            set({ isLoading: false });
        }
    },
}));