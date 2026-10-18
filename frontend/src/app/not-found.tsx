"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.04)] flex flex-col items-center">
        <Logo size="md" asLink href="/" />

        <div className="mt-8 mb-4">
          <span className="text-6xl font-black text-indigo-600 tracking-tight">404</span>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-8 max-w-xs">
          The page or route you are looking for does not exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200/90 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
