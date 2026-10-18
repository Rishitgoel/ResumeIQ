"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Crosshair,
  Scale,
  Star,
  Settings,
  LogOut,
  Crown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Resumes", href: "/resumes", icon: FileText },
  { name: "Job Descriptions", href: "/job-descriptions", icon: Briefcase },
  { name: "Match Analysis", href: "/analysis/new", icon: Crosshair },
  { name: "Compare Resumes", href: "/compare", icon: Scale },
  { name: "Saved Jobs", href: "/saved-jobs", icon: Star },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          "w-64 bg-[#131627] text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-[#1f243c] z-40 select-none transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Logo & Mobile Close */}
        <div className="p-6 pb-5 flex items-center justify-between">
          <Logo size="sm" variant="dark" withSubtitle asLink href="/dashboard" />
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden"
              title="Close menu"
            >
              <span className="sr-only">Close menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all",
                  isActive
                    ? "bg-[#1e2342] text-white font-medium border border-[#2e3766] shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-[#181d36]"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-400" : "text-slate-400")} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade to Pro Card */}
        <div className="mx-3.5 mb-3 p-4 rounded-2xl bg-gradient-to-b from-[#181c35] to-[#14172b] border border-[#272e55] shadow-lg shadow-black/20">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <h4 className="text-xs font-bold text-white">Upgrade to Pro</h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
            Get unlimited analyses, advanced insights and more.
          </p>
          <Link
            href="/pricing"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>Upgrade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-[#1e233f] bg-[#101323]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                {user?.full_name?.charAt(0) || (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.full_name || "User"}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
