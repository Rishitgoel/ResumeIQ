"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Logo } from "@/components/ui/Logo";
import { Loader2, Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Loading ResumeIQ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#131627] text-white border-b border-[#1f243c] sticky top-0 z-20">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-1 text-slate-300 hover:text-white rounded-lg"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo size="sm" variant="dark" asLink href="/dashboard" />
        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
          {user?.full_name?.charAt(0) || (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
        </div>
      </div>

      <main className="flex-1 md:ml-64 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
