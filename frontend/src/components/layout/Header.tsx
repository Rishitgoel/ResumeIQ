"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actionText?: string;
  actionHref?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  children?: React.ReactNode;
}

export function Header({
  title,
  description,
  badge,
  actionText,
  actionHref,
  actionIcon,
  onActionClick,
  children,
}: HeaderProps) {
  return (
    <header className="px-6 lg:px-8 pt-6 pb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight">{title}</h1>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="text-xs sm:text-sm text-slate-400 mt-1">{description}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {children}
        {actionText &&
          (actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {actionIcon || <PlusCircle className="w-4 h-4" />}
              <span>{actionText}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {actionIcon || <PlusCircle className="w-4 h-4" />}
              <span>{actionText}</span>
            </button>
          ))}
      </div>
    </header>
  );
}
