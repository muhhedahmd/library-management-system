import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) return "N/A"
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
export const languages = [
  { id: "1", code: "en", name: "English" },
  { id: "2", code: "es", name: "Spanish" },
  { id: "3", code: "fr", name: "French" },
  { id: "4", code: "de", name: "German" },
  { id: "5", code: "zh", name: "Chinese" },
  { id: "6", code: "hi", name: "Hindi" },
  { id: "7", code: "ar", name: "Arabic" },
  { id: "8", code: "pt", name: "Portuguese" },
  { id: "9", code: "ru", name: "Russian" },
  { id: "10", code: "ja", name: "Japanese" },
  { id: "11", code: "it", name: "Italian" },
  { id: "12", code: "ko", name: "Korean" },
  { id: "13", code: "nl", name: "Dutch" },
  { id: "14", code: "tr", name: "Turkish" },
  { id: "15", code: "sv", name: "Swedish" },
  { id: "16", code: "pl", name: "Polish" },
  { id: "17", code: "vi", name: "Vietnamese" },
  { id: "18", code: "th", name: "Thai" },
  { id: "19", code: "el", name: "Greek" },
  { id: "20", code: "he", name: "Hebrew" },
];

