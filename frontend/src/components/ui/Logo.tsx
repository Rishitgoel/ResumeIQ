"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** Size variant for the logo icon and typography */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color theme for dark vs light backgrounds */
  variant?: "light" | "dark";
  /** Whether to render the wordmark text next to the icon */
  showWordmark?: boolean;
  /** Whether to render the subtitle tagline below the wordmark */
  withSubtitle?: boolean;
  /** Custom subtitle text */
  subtitleText?: string;
  /** Whether the logo should be wrapped in Next.js Link */
  asLink?: boolean;
  /** Target link href (default: "/") */
  href?: string;
  /** Outer container class */
  className?: string;
  /** Custom class for the icon container box */
  iconBoxClassName?: string;
}

/**
 * Bespoke ResumeIQ Mark:
 * Represents a clean structured resume folio with credential lines
 * and an integrated precision analytical lens / Q-monogram.
 */
export function ResumeIQMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Document Folio Sheet */}
      <path
        d="M6 3.5C6 2.67157 6.67157 2 7.5 2H14.25L18.5 6.25V20.5C18.5 21.3284 17.8284 22 17 22H7.5C6.67157 22 6 21.3284 6 20.5V3.5Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Corner Fold Flap */}
      <path
        d="M14 2V6.25H18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Primary Credential / Headline Bar */}
      <path
        d="M9 10.5H15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Secondary Skills / Experience Bar */}
      <path
        d="M9 14.5H12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Precision Intelligence Lens / Q-Monogram Anchor */}
      <circle
        cx="15.5"
        cy="15"
        r="1.8"
        fill="currentColor"
      />
      <path
        d="M16.8 16.3L18.2 17.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  size = "md",
  variant = "light",
  showWordmark = true,
  withSubtitle = false,
  subtitleText,
  asLink = false,
  href = "/",
  className,
  iconBoxClassName,
}: LogoProps) {
  const isDark = variant === "dark";

  // Size styling maps
  const boxSizes = {
    sm: "w-9 h-9 rounded-xl",
    md: "w-10 h-10 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
    xl: "w-14 h-14 rounded-2xl",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-5.5 h-5.5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  const titleSizes = {
    sm: "text-lg font-bold leading-tight",
    md: "text-xl font-extrabold leading-none",
    lg: "text-2xl font-bold tracking-tight",
    xl: "text-3xl font-extrabold tracking-tight",
  };

  const subtitleDefault = size === "md" ? "SMARTER CAREER DECISIONS" : "Smarter Career Decisions";
  const subtitle = subtitleText || subtitleDefault;

  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Icon Box */}
      <div
        className={cn(
          "bg-gradient-to-tr from-[#4338CA] via-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20 ring-1 ring-white/10 transition-transform group-hover:scale-105",
          boxSizes[size],
          iconBoxClassName
        )}
      >
        <ResumeIQMark className={iconSizes[size]} />
      </div>

      {/* Typography / Wordmark */}
      {showWordmark && (
        <div className="min-w-0">
          <span
            className={cn(
              "tracking-tight block",
              titleSizes[size],
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Resume<span className={isDark ? "text-indigo-400" : "text-indigo-600"}>IQ</span>
          </span>

          {withSubtitle && (
            <span
              className={cn(
                "block font-medium",
                size === "md"
                  ? "text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1"
                  : "text-[11px] text-slate-400 tracking-normal mt-0.5"
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
