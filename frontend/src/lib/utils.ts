import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(val: number): string {
  return `${Math.round(val)}%`;
}

export function formatDate(isoStr?: string | null): string {
  if (!isoStr) return "N/A";
  try {
    return new Date(isoStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoStr;
  }
}

export function getScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  if (score >= 80) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-300",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-300",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
    };
  }
  if (score >= 40) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-300",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
    };
  }
  return {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-300",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
  };
}
