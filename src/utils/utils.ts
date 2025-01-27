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