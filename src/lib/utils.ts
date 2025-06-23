import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts
export const formatCurrency = (value: string | number | { toString(): string }) => {
  const amount = typeof value === 'string' ? parseFloat(value) : 
                typeof value === 'number' ? value :
                parseFloat(value.toString());
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};