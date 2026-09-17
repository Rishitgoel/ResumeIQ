"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Sliders,
  ShieldCheck,
  BarChart3,
  Layers
} from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <span className="font-bold text-xl text-white tracking-tight">ResumeIQ</span>
            <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
              Talent Intelligence Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="md" className="text-slate-300 hover:text-white hover:bg-slate-800">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="md">
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Explainable Candidate Matching & NLP Engine
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Transparent Resume Intelligence.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
            No Black Boxes.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload PDF resumes, extract structured taxonomy skills, parse job descriptions, and evaluate candidates with mathematical transparency and actionable improvement insights.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/register">
            <Button variant="primary" size="lg" className="px-8 py-3 text-base shadow-xl shadow-indigo-600/30">
              Launch Platform
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white px-6">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-2">Multi-Tier PDF Parser</h3>
            <p className="text-sm text-slate-400">
              Extracts text, section headers, work history, projects, and educational credentials with layout preservation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-2">Explainable Scoring</h3>
            <p className="text-sm text-slate-400">
              Configurable 5-dimension scoring model (40% Required, 20% Preferred, 15% Experience, 10% Projects, 10% Education).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-2">Side-by-Side Comparison</h3>
            <p className="text-sm text-slate-400">
              Compare 2 to 5 resumes simultaneously against a single job description with a boolean skill coverage matrix.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        ResumeIQ Architecture &copy; 2026. Built with FastAPI, PostgreSQL, Next.js & NLP.
      </footer>
    </div>
  );
}
