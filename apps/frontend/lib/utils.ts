import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

if(!process.env.NEXT_PUBLIC_API_URL){
  console.log("NEXT_PUBLIC_API_URL DOES NOT AVAILABLE")
}

export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ;
