"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  User,
  Shield,
  Cpu,
  Database,
  Server,
  HardDrive,
  Settings as SettingsIcon,
  Crown,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Key,
  LogOut,
  Sliders,
  Sparkles,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "weights" | "system">("profile");

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <span>Settings & Configuration</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account profile, plan tier, scoring weight preferences, and view platform architecture.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          User Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "subscription"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Plan & Subscription
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("weights")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "weights"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Default Weights
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "system"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          System Architecture
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-2xl flex items-center justify-center shrink-0">
                {user?.full_name?.charAt(0) || (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.full_name || "User"}</h3>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>JWT Verified</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Free Tier Account</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Full Legal Name</span>
                <span className="font-bold text-slate-800 text-sm">{user?.full_name || "User"}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Account Email</span>
                <span className="font-bold text-slate-800 text-sm">{user?.email || "user@example.com"}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Account User ID</span>
                <span className="font-mono text-slate-700 text-xs truncate block">{user?.id || "N/A"}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Role & Permissions</span>
                <span className="font-bold text-slate-800 text-sm">
                  {user?.is_superuser ? "Administrator" : "Standard Developer"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of ResumeIQ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subscription & Plans */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  Current Plan
                </span>
                <h3 className="text-xl font-bold text-slate-900">Starter Free</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                You have access to 5 resume analyses per month and standard skill extraction.
              </p>
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Upgrade to Pro ($12/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Starter (Free)</h4>
              <p className="text-xs text-slate-400">Current tier active on your account</p>
              <ul className="text-xs space-y-2 text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5 Analyses / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Core Match Scoring</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-indigo-500 shadow-md shadow-indigo-500/5 space-y-3 relative">
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                Popular
              </span>
              <h4 className="text-sm font-bold text-slate-900">Pro Career ($12/mo)</h4>
              <p className="text-xs text-slate-400">Unlimited analyses & candidate comparison</p>
              <ul className="text-xs space-y-2 text-slate-700 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Unlimited Analyses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Multi-Resume Comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Custom Weights Sliders</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs text-center block mt-3"
              >
                Upgrade Plan
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Campus & Team ($49/mo)</h4>
              <p className="text-xs text-slate-400">Batch screening & API integration</p>
              <ul className="text-xs space-y-2 text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Batch Candidate Screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>REST API & Webhooks</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="w-full py-2 rounded-xl bg-slate-50 text-slate-700 font-semibold text-xs text-center border border-slate-200 block mt-3"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Weights */}
      {activeTab === "weights" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Default Linear Combination Scoring Weights
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These weights are applied when running match analyses unless overridden in custom weights mode.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-xs block">Required Skills</span>
              <span className="text-2xl font-extrabold text-indigo-600">40%</span>
              <p className="text-[10px] text-slate-400 mt-1">Core technical requirements</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-xs block">Preferred Skills</span>
              <span className="text-2xl font-extrabold text-indigo-600">20%</span>
              <p className="text-[10px] text-slate-400 mt-1">Bonus qualifications & tools</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-xs block">Experience Duration</span>
              <span className="text-2xl font-extrabold text-indigo-600">15%</span>
              <p className="text-[10px] text-slate-400 mt-1">Years in relevant roles</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-xs block">Project Alignment</span>
              <span className="text-2xl font-extrabold text-indigo-600">10%</span>
              <p className="text-[10px] text-slate-400 mt-1">Portfolio & GitHub projects</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-xs block">Education Level</span>
              <span className="text-2xl font-extrabold text-indigo-600">10%</span>
              <p className="text-[10px] text-slate-400 mt-1">Degrees & academic fields</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-xs block">Certifications & Other</span>
              <span className="text-2xl font-extrabold text-indigo-600">5%</span>
              <p className="text-[10px] text-slate-400 mt-1">Credentials & awards</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Architecture */}
      {activeTab === "system" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Production Architecture & Infrastructure
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Overview of the high-throughput stack powering ResumeIQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>FastAPI Async Backend Gateway</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Asynchronous ASGI runtime, Pydantic V2 type validation, auto OpenAPI schemas, and concurrent request pipeline.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Database className="w-4 h-4 text-sky-600" />
                <span>PostgreSQL 16 Relational Engine</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Strict foreign keys, relational JOINs, transactional consistency, and JSONB storage for complex resume sections.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HardDrive className="w-4 h-4 text-purple-600" />
                <span>Redis 7 In-Memory Cache</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Transient analysis score caching, sliding-window rate limiting, and background queue orchestration.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Semantic NLP & Taxonomy Engine</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                500+ canonical technical skill taxonomy, boundary protection, and contextual evidence classification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
