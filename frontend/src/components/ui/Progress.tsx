import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  indicatorColor?: string;
}

export function Progress({ value, max = 100, className, indicatorColor }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getColor = (pct: number) => {
    if (indicatorColor) return indicatorColor;
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-indigo-500";
    if (pct >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className={cn("w-full bg-slate-100 rounded-full h-2.5 overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-500 rounded-full", getColor(percentage))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
