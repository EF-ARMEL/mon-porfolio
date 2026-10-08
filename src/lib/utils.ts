import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes without conflicts.
 * Standard implementation used in shadcn/ui and most modern Next.js projects.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}