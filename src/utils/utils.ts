import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const safeJson = (json: any, defaultValue?: any)=>{
  try {
    return JSON.parse(json)
  } catch (e){
    return defaultValue
  }
}

export function formatToSocialMediaNumber(amount: number) {
  if (amount < 1000) {
    return amount.toString(); 
  } else if (amount >= 1000 && amount < 1_000_000) {
    return (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1) + "k";
  } else if (amount >= 1_000_000 && amount < 1_000_000_000) {
    return (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1) + "M";
  } else {
    return (amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1) + "B";
  }
}

export const formatToCurrency = (number: number, locale = "en-US",) => {
  return new Intl.NumberFormat(locale, {
  }).format(number);
};