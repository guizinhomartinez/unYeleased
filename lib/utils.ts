import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const lyricsDelay = 1002; // might tweak this value a little bit

export const capitalizeFirstLetter = (val: string) => String(val).charAt(0).toUpperCase() + String(val).slice(1);