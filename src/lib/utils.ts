import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts
export const formatCurrency = (
  value: string | number | { toString(): string },
  currency: string = 'USD',
  rates: Record<string, number> | null = null,
  fromCurrency: string = 'INR'
) => {
  const amount = typeof value === 'string' ? parseFloat(value) : 
                typeof value === 'number' ? value :
                parseFloat(value.toString());

  let converted = amount;
  
  // Convert from INR (backend) to target currency using USD as base
  if (rates && fromCurrency === 'INR' && currency !== 'INR') {
    const inrRate = rates['INR'] || 83.5; // Fallback INR rate
    const targetRate = rates[currency] || 1;
    
    // Convert: INR -> USD -> Target Currency
    const usdAmount = amount / inrRate;
    converted = usdAmount * targetRate;
  }

  // pick locale by currency for nicer formatting
  const localeMap: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
  };
  const locale = localeMap[currency] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(converted);
};

export function formatDate(dateString: string | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

export function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
}