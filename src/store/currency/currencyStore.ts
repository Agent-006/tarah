import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

type Rates = Record<string, number> | null;

type CurrencyState = {
    selected: string;
    rates: Rates;
    isLoading: boolean;
    error: string | null;
    setSelected: (code: string) => void;
    fetchRates: () => Promise<void>;
    convertFromUSD: (amountInUSD: number, to?: string) => number;
};

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            selected: 'USD',
            rates: {
                USD: 1,
                EUR: 0.85,
                GBP: 0.73,
                INR: 83.5,
            },
            isLoading: false,
            error: null,
            setSelected: (code: string) => set({ selected: code }),
            fetchRates: async () => {
                set({ isLoading: true, error: null });
                try {
                    // Use exchangerate.host free API; base is USD to get rates relative to USD
                    const res = await axios.get('https://api.exchangerate.host/latest', {
                        params: {
                            base: 'USD',
                            places: 6,
                        },
                        timeout: 5000,
                    });

                    const rates = res.data?.rates || null;
                    set({ rates, isLoading: false });
                } catch (err: unknown) {
                    // Log the error for diagnostics and provide a useful message in state
                    console.error('fetchRates failed:', err);
                    // Fallback exchange rates (approximate)
                    const fallbackRates = {
                        USD: 1,
                        EUR: 0.85,
                        GBP: 0.73,
                        INR: 83.5,
                    };
                    const errorMessage = err instanceof Error ? err.message : 'Using fallback rates';
                    set({ rates: fallbackRates, error: errorMessage, isLoading: false });
                }
            },
            convertFromUSD: (amountInUSD: number, to?: string) => {
                const target = to || get().selected || 'USD';
                if (!get().rates || target === 'USD') return amountInUSD;
                const rate = get().rates?.[target];
                if (!rate) return amountInUSD;
                // rate is how much 1 USD equals in target currency (since base=USD)
                return amountInUSD * rate;
            },
        }),
        {
            name: 'currency-storage',
            partialize: (state) => ({ selected: state.selected }),
        }
    )
);

export default useCurrencyStore;