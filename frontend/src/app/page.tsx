"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import {
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Play,
  X,
  Target,
  Zap,
  BarChart2,
  Briefcase,
  Layers,
  Code2,
  Cloud,
  MessageCircle,
  GitBranch,
  Star,
  ShieldCheck,
  Award,
  GraduationCap,
  ChevronRight,
  Users,
  CheckCircle,
  FileCheck,
  HelpCircle,
} from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"skills" | "missing" | "suggestions">("skills");
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // 3D Tilt State for Match Insights Card
  const [dashboardTilt, setDashboardTilt] = useState({
    rotateX: 7,
    rotateY: -12,
    rotateZ: 1.5,
    scale: 1,
    translateY: 0,
  });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Interactive 3D angle change tracking cursor
    const tiltX = -((y - centerY) / centerY) * 9;
    const tiltY = ((x - centerX) / centerX) * 11;
    setDashboardTilt({
      rotateX: Math.round(tiltX * 10) / 10,
      rotateY: Math.round(tiltY * 10) / 10,
      rotateZ: 0,
      scale: 1.025,
      translateY: -6,
    });
  };

  const handleCardMouseEnter = () => {
    setIsCardHovered(true);
    // Smooth angle change on hover
    setDashboardTilt({
      rotateX: 2,
      rotateY: -3,
      rotateZ: 0,
      scale: 1.025,
      translateY: -6,
    });
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    // Return to the default 3D tilt from reference photo
    setDashboardTilt({
      rotateX: 7,
      rotateY: -12,
      rotateZ: 1.5,
      scale: 1,
      translateY: 0,
    });
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="w-full bg-transparent z-40 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-24 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="lg" asLink href="/" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#use-cases" className="hover:text-slate-900 transition-colors">
              Use Cases
            </a>
            <a href="#testimonials" className="hover:text-slate-900 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-[15px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[15px] font-medium shadow-sm hover:shadow-md transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-10 pt-2 pb-16 w-full relative">
        {/* Multi-layered Luminous Ambient Glowing Effects behind Mockup */}
        <div className="absolute top-2 right-6 w-[640px] h-[580px] bg-gradient-to-tr from-indigo-300/30 via-sky-200/35 to-violet-300/25 rounded-full blur-[110px] -z-10 pointer-events-none" />
        <div className="absolute top-16 right-20 w-[420px] h-[400px] bg-gradient-to-bl from-blue-400/25 via-indigo-500/20 to-purple-400/15 rounded-full blur-[75px] -z-10 pointer-events-none" />
        <div className="absolute top-32 right-36 w-[280px] h-[260px] bg-cyan-300/20 rounded-full blur-[60px] -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-2">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-[#4F46E5]/30 text-[#4F46E5]" />
              <span>AI-Powered Resume Intelligence</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Get Hired Faster <br />
              with Smarter <br />
              <span className="text-[#4F46E5]">Resume Matching</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg mb-8">
              Upload your resume, paste a job description, and get AI-powered insights on your match score, missing skills, and personalized improvement suggestions.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-9">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <button
                onClick={() => setShowDemoModal(true)}
                type="button"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200/90 shadow-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5]">
                  <Play className="w-3 h-3 fill-[#4F46E5] ml-0.5" />
                </div>
                <span>Watch Demo</span>
                <span className="text-xs text-slate-400 font-normal ml-1">
                  2 min
                </span>
              </button>
            </div>

            {/* Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                <span>Instant analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                <span>Actionable insights</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Showcase with 3D Perspective & Glowing Effects */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end [perspective:1200px]">
            {/* Ambient Radial Glow behind the entire card showcase */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[520px] bg-gradient-to-tr from-indigo-300/25 via-blue-200/20 to-purple-300/25 rounded-full blur-[90px] pointer-events-none -z-20" />
            <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none -z-20" />

            <div className="relative w-full max-w-[640px] flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-10 sm:pt-14 pb-12 [transform-style:preserve-3d]">
              
              {/* Handwritten Note: Upload your resume */}
              <div className="absolute top-0 left-6 hidden sm:flex flex-col items-center pointer-events-none select-none z-30">
                <span className="font-handwriting text-[#253488] text-2xl font-bold -rotate-6 tracking-wide">
                  Upload your resume
                </span>
                <svg
                  className="w-11 h-11 text-[#253488] -mt-1 ml-6"
                  viewBox="0 0 50 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 8 C 30 14, 34 28, 26 40" />
                  <path d="M19 35 L 26 40 L 32 33" />
                </svg>
              </div>

              {/* Left Stack: Upload Inputs & Analyze Button with 3D perspective tilt */}
              <div
                className="w-full sm:w-[260px] flex flex-col gap-3.5 z-20 sm:mt-12 relative cursor-default"
                style={{
                  transform: "perspective(1100px) rotateX(4deg) rotateY(6deg) rotateZ(-1deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Resume Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06),0_0_20px_rgba(99,102,241,0.04)] flex items-center justify-between gap-3 transition-transform">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                      <FileText className="w-5 h-5 fill-red-500/15 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        Your Resume
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5">
                        Rishit_Goel_Resume.pdf
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">2.1 MB</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  </div>
                </div>

                {/* Job Description Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06),0_0_20px_rgba(99,102,241,0.04)] flex items-center justify-between gap-3 transition-transform">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                      <FileText className="w-5 h-5 fill-blue-500/15 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        Job Description
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5">
                        SDE - Software Engineer
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Tech Company</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  </div>
                </div>

                {/* Dotted Connector Line down to Button */}
                <div className="relative pl-8 py-0.5">
                  <div className="w-0.5 h-6 border-l-2 border-dashed border-indigo-300" />
                </div>

                {/* Analyze Match Button with curved dotted connector line */}
                <div className="relative">
                  <Link
                    href="/analysis/new"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4338CA] text-white text-xs font-bold shadow-[0_12px_28px_-6px_rgba(67,56,202,0.45)] hover:shadow-[0_18px_36px_-6px_rgba(67,56,202,0.6)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-[transform,box-shadow,filter] duration-200 ease-out"
                  >
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Analyze Match</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>

                  {/* Dotted connector curve from Analyze Button to Dashboard */}
                  <div className="hidden sm:block absolute top-1/2 -right-6 w-8 h-9 border-b-2 border-r-2 border-dashed border-indigo-300 pointer-events-none rounded-br-2xl" />
                </div>
              </div>

              {/* Right Stack: Match Insights 3D Dashboard Card with tilt and hover angle shift */}
              <div className="relative z-10">
                {/* Ambient Glow behind the Card */}
                <div
                  className="absolute -inset-3 bg-gradient-to-tr from-indigo-500/20 via-blue-500/15 to-purple-500/20 rounded-[38px] blur-xl pointer-events-none transition-opacity duration-300 -z-10"
                  style={{ opacity: isCardHovered ? 1 : 0.65 }}
                />

                <div 
                  onMouseMove={handleCardMouseMove}
                  onMouseEnter={handleCardMouseEnter}
                  onMouseLeave={handleCardMouseLeave}
                  className="w-full sm:w-[390px] bg-white rounded-[32px] p-6 sm:p-7 border border-slate-100/90 flex flex-col cursor-pointer select-none"
                  style={{
                    transform: `perspective(1100px) rotateX(${dashboardTilt.rotateX}deg) rotateY(${dashboardTilt.rotateY}deg) rotateZ(${dashboardTilt.rotateZ}deg) scale3d(${dashboardTilt.scale}, ${dashboardTilt.scale}, 1) translateY(${dashboardTilt.translateY}px)`,
                    transformStyle: "preserve-3d",
                    boxShadow: isCardHovered
                      ? "0 35px 80px -15px rgba(79, 70, 229, 0.28), 0 0 55px rgba(99, 102, 241, 0.22), 0 16px 36px -8px rgba(15, 23, 42, 0.08)"
                      : "0 28px 70px -15px rgba(79, 70, 229, 0.18), 0 0 40px rgba(99, 102, 241, 0.12), 0 12px 28px -8px rgba(15, 23, 42, 0.06)",
                    transition: isCardHovered
                      ? "transform 0.15s ease-out, box-shadow 0.3s ease"
                      : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
                  }}
                >
                  {/* Score Section */}
                  <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                    {/* Circular Score Ring */}
                    <div className="relative w-[72px] h-[72px] flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#F1F5F9"
                          strokeWidth="3.2"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#00D2B4"
                          strokeWidth="3.2"
                          strokeDasharray="94.2"
                          strokeDashoffset="20.7"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-extrabold text-slate-800">
                        78%
                      </span>
                    </div>

                    {/* Score Details */}
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        Overall Match Score
                      </p>
                      <p className="text-sm font-extrabold text-slate-900 leading-tight mt-0.5">
                        Great Match!
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Your profile matches 78% of the job requirements.
                      </p>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 py-3.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab("skills"); }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === "skills"
                          ? "bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/30"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Skills Match
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab("missing"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === "missing"
                          ? "bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/30"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Missing Skills
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab("suggestions"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === "suggestions"
                          ? "bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/30"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Suggestions
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "skills" && (
                    <div className="flex flex-col gap-3.5 pt-1">
                      {/* Item 1 */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                            <GitBranch className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 text-[11px] truncate">
                            Data Structures & Algorithms
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#10B981] h-full w-[90%] rounded-full" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold w-7 text-right">
                            90%
                          </span>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-500">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 text-[11px] truncate">
                            System Design
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#10B981] h-full w-[75%] rounded-full" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold w-7 text-right">
                            75%
                          </span>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                            <Code2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 text-[11px] truncate">
                            Python
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#10B981] h-full w-[85%] rounded-full" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold w-7 text-right">
                            85%
                          </span>
                        </div>
                      </div>

                      {/* Item 4 */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500">
                            <Cloud className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 text-[11px] truncate">
                            Cloud (AWS)
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#F59E0B] h-full w-[60%] rounded-full" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold w-7 text-right">
                            60%
                          </span>
                        </div>
                      </div>

                      {/* Item 5 */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
                            <MessageCircle className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 text-[11px] truncate">
                            Communication
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#10B981] h-full w-[80%] rounded-full" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold w-7 text-right">
                            80%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "missing" && (
                    <div className="flex flex-col gap-2.5 pt-2">
                      <div className="p-2.5 bg-rose-50/60 border border-rose-100 rounded-xl text-xs">
                        <p className="font-semibold text-rose-800 text-[11px]">Kubernetes & Docker</p>
                        <p className="text-slate-500 text-[10px]">Container orchestration specified in preferred qualifications.</p>
                      </div>
                      <div className="p-2.5 bg-rose-50/60 border border-rose-100 rounded-xl text-xs">
                        <p className="font-semibold text-rose-800 text-[11px]">GraphQL Architecture</p>
                        <p className="text-slate-500 text-[10px]">Mentioned in backend API stack requirements.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "suggestions" && (
                    <div className="flex flex-col gap-2.5 pt-2">
                      <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl text-xs">
                        <p className="font-semibold text-amber-900 text-[11px]">Highlight AWS Deployments</p>
                        <p className="text-slate-600 text-[10px]">Add metric-driven bullet points for cloud architecture in your experience.</p>
                      </div>
                      <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs">
                        <p className="font-semibold text-indigo-900 text-[11px]">System Design Scope</p>
                        <p className="text-slate-600 text-[10px]">Include high-scale throughput numbers on distributed database projects.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Handwritten Note: Get detailed insights */}
              <div className="absolute -bottom-8 right-0 hidden sm:flex items-center gap-2 pointer-events-none select-none z-30">
                <svg
                  className="w-12 h-12 text-[#253488] -rotate-12"
                  viewBox="0 0 50 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M38 38 C 28 26, 20 18, 12 10" />
                  <path d="M10 20 L 12 10 L 22 12" />
                </svg>
                <span className="font-handwriting text-[#253488] text-2xl font-bold rotate-2 tracking-wide whitespace-nowrap">
                  Get detailed insights
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <section id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16 pt-2">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Accurate Matching
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                AI-powered semantic analysis
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Skill Gap Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Identify missing skills instantly
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center flex-shrink-0">
              <BarChart2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Actionable Suggestions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Get personalized improvement tips
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Multiple JD Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Compare across multiple job roles
              </p>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="mt-20 pb-8 text-center">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-8">
            TRUSTED BY STUDENTS AND PROFESSIONALS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-9 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            {/* Google */}
            <div className="flex items-center text-slate-700 font-bold text-xl tracking-tight hover:text-slate-900 transition-colors">
              <span className="font-semibold text-2xl tracking-tight">Google</span>
            </div>

            {/* Microsoft */}
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xl hover:text-slate-900 transition-colors">
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-slate-600 rounded-[1px]" />
                <div className="bg-slate-600 rounded-[1px]" />
                <div className="bg-slate-600 rounded-[1px]" />
                <div className="bg-slate-600 rounded-[1px]" />
              </div>
              <span>Microsoft</span>
            </div>

            {/* Amazon */}
            <div className="flex flex-col items-center justify-center text-slate-700 hover:text-slate-900 transition-colors">
              <span className="font-bold text-xl tracking-tight lowercase">amazon</span>
              <svg className="w-14 h-3 text-slate-600 -mt-1" viewBox="0 0 60 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 3 C 20 12, 40 12, 56 3" strokeLinecap="round" />
                <path d="M50 5 L 56 3 L 52 10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xl hover:text-slate-900 transition-colors">
              <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5C10.5 15.5 9.2 14.1 9.2 12C9.2 9.9 10.5 8.5 12 8.5C13.5 8.5 14.8 9.9 14.8 12C14.8 14.1 13.5 15.5 12 15.5ZM17.4 7C15.4 7 13.7 8.2 12.8 9.9C11.9 8.2 10.2 7 8.2 7C4.8 7 2 9.8 2 13.2C2 17.5 5.5 20.5 10.5 20.5C11.4 20.5 12.3 20.2 13 19.8C13.7 20.2 14.6 20.5 15.5 20.5C20.5 20.5 24 17.5 24 13.2C24 9.8 21.2 7 17.8 7H17.4Z" />
              </svg>
              <span>Meta</span>
            </div>

            {/* Adobe */}
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xl hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.5 3H21V21L14.5 3ZM9.5 3H3V21L9.5 3ZM12 9.5L16.2 21H13.8L12.5 17.5H10.5L12 13.2V9.5Z" />
              </svg>
              <span>Adobe</span>
            </div>

            {/* Goldman Sachs */}
            <div className="text-slate-700 font-serif font-bold text-lg hover:text-slate-900 transition-colors">
              Goldman Sachs
            </div>

            {/* Atlassian */}
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-lg tracking-wider hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5 2.5C11.2 3 11 3.5 11 4.2C11 6.5 12.5 8.2 14.5 9.5L7 21H12.5L18 12.5C16.5 10 15 7.5 15 4.5C15 3.5 15.2 2.8 15.5 2.5H11.5Z" />
              </svg>
              <span>ATLASSIAN</span>
            </div>

            {/* and more... */}
            <div className="text-slate-400 text-sm font-medium italic">
              and more...
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS SECTION ================= */}
        <section id="how-it-works" className="mt-28 pt-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#4F46E5]/20 text-[#4F46E5]" />
              <span>Seamless 3-Step Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Land Top Tech Interviews in <span className="text-[#4F46E5]">3 Simple Steps</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Our explainable NLP pipeline parses complex resumes, matches multi-faceted requirements, and delivers actionable clarity in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-4xl font-extrabold text-slate-200 group-hover:text-indigo-200 transition-colors">
                  01
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">Upload Your Resume PDF</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                Upload your existing PDF resume. Our parser extracts technical competencies, work history, education, and projects without losing semantic structure.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant PDF tokenization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero manual data entry needed</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100/80 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-4xl font-extrabold text-slate-200 group-hover:text-sky-200 transition-colors">
                  02
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">Add Target Job Description</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                Paste any job description. ResumeIQ extracts mandatory requirements, preferred skills, minimum experience levels, and primary domains.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Distinguishes required vs preferred</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Isolates experience duration criteria</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <span className="text-4xl font-extrabold text-slate-200 group-hover:text-emerald-200 transition-colors">
                  03
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">Get Match Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                Receive an explainable 0–100% score, categorized skill gap radar, and personalized line-by-line rewrite suggestions to maximize interview callbacks.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Mathematical scoring transparency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Targeted bullet point recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= USE CASES SECTION ================= */}
        <section id="use-cases" className="mt-32 pt-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold mb-4 shadow-xs">
              <Briefcase className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Tailored Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Engineered for Every <span className="text-[#4F46E5]">Career Objective</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Whether you are an aspiring software engineer, recent grad, or hiring team, ResumeIQ adapts to your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case 1 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Software Engineers & Tech Talent</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Beat modern ATS filters for Big Tech and hyper-growth unicorns. Align your resumes with DSA, Distributed Systems, Cloud architectures, and specific framework keywords.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600">SDE I, II, & Senior Roles</span>
                <Link href="/register" className="text-xs font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Students & New Graduates</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Bridge the gap between academic projects and enterprise requirements. Understand what recruiter filters look for in entry-level engineering applications.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">Internships & Campus Placements</span>
                <Link href="/register" className="text-xs font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Career Switchers</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Transition into tech with confidence. Identify transferable strengths from previous roles and pinpoint the exact technical skills to feature prominently.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">Cross-Disciplinary Transitions</span>
                <Link href="/register" className="text-xs font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Case 4 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Recruiters & Hiring Managers</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Compare multiple candidate resumes simultaneously against a target job specification. View ranked skill coverage with complete objectivity.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600">Candidate Screening & Audits</span>
                <Link href="/register" className="text-xs font-semibold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        <section id="testimonials" className="mt-32 pt-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold mb-4 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-[#4F46E5]/20 text-[#4F46E5]" />
              <span>Real Candidate Outcomes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Loved by Candidates at <span className="text-[#4F46E5]">Top Tech Companies</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Don&apos;t just take our word for it. Here is how candidates utilized ResumeIQ to secure high-paying engineering offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">
                  &ldquo;The skill gap breakdown identified that my resume was missing AWS serverless and Kafka keywords that Google specifically required for the SDE team. Tailored my experience and received a callback in 48 hours!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                  RG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Rishit Goel</h4>
                  <p className="text-xs text-slate-400">Software Engineer @ Tech Unicorn</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">
                  &ldquo;Comparing my resume across 4 different job postings at the same time is an incredible superpower. ResumeIQ showed me exactly which skills were universal across all roles and which were nice-to-haves.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-sm shrink-0">
                  AS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Aanya Sharma</h4>
                  <p className="text-xs text-slate-400">Full Stack Developer @ Atlassian</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">
                  &ldquo;Other platforms give you a black-box percentage with zero explanation. ResumeIQ transparently shows the exact required skills and formula weights. It gave me the competitive edge I needed.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 text-purple-700 font-bold flex items-center justify-center text-sm shrink-0">
                  DC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">David Chen</h4>
                  <p className="text-xs text-slate-400">Backend Engineer @ Microsoft</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRICING SECTION ================= */}
        <section id="pricing" className="mt-32 pt-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold mb-4 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Predictable Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Start Free, Scale as You <span className="text-[#4F46E5]">Apply</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              No hidden fees, no credit card required to start. Cancel or upgrade anytime.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Free Starter */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter Free</h3>
                <p className="text-xs text-slate-500 mt-1">Ideal for students preparing their first tech resume.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>

                <ul className="mt-8 space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>5 Resume Analyses per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Standard PDF Parser & Skill Extraction</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Basic 0–100% Match Score</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Top 5 Missing Skill Highlights</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs text-center border border-slate-200/90 transition-all block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Plan 2: Pro Candidate (Highlighted) */}
            <div className="relative bg-white rounded-3xl p-8 border-2 border-[#4F46E5] shadow-xl shadow-indigo-500/10 hover:shadow-2xl transition-all flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                Most Popular
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Pro Career Booster</h3>
                <p className="text-xs text-slate-500 mt-1">For active job seekers applying to competitive roles.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billingCycle === "annual" ? "$9.60" : "$12"}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <ul className="mt-8 space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                    <span>Unlimited Resume PDF Uploads</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                    <span>Unlimited Match Analyses</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                    <span>Side-by-side Multi-Resume Comparison</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                    <span>Personalized AI Bullet Point Suggestions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                    <span>Custom Linear Weight Adjustments</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                    <span>Priority High-Speed NLP Processing</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs text-center shadow-lg shadow-indigo-600/25 transition-all block"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Plan 3: Recruiter / Campus */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campus & Recruiter</h3>
                <p className="text-xs text-slate-500 mt-1">For placement cells, bootcamps, and hiring teams.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billingCycle === "annual" ? "$39" : "$49"}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <ul className="mt-8 space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Everything in Pro Plan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Batch Candidate Resume Screening</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Shared Team Job Repositories</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>REST API Access & Webhooks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>Dedicated Technical Account Manager</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs text-center border border-slate-200/90 transition-all block"
              >
                Get Started with Campus
              </Link>
            </div>
          </div>
        </section>

        {/* ================= PRE-FOOTER CTA BANNER ================= */}
        <section className="mt-32 mb-12">
          <div className="relative rounded-[2.5rem] bg-gradient-to-tr from-[#3730A3] via-[#4338CA] to-[#4F46E5] text-white p-10 sm:p-14 overflow-hidden shadow-2xl shadow-indigo-900/20 text-center flex flex-col items-center">
            {/* Luminous Glow Orbs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-indigo-100 text-xs font-semibold mb-5 border border-white/20">
                ✦ Unlock Your True Callback Potential
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Ready to Land More Tech Interviews?
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 mt-4 leading-relaxed max-w-xl mx-auto">
                Join thousands of software engineers using ResumeIQ to turn rejected applications into confident interview invitations.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#4338CA] font-bold text-sm shadow-xl transition-all hover:scale-105"
                >
                  <span>Start Free Analysis</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Watch Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4F46E5]">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  ResumeIQ Walkthrough
                </h3>
                <p className="text-xs text-slate-500">2-minute interactive product overview</p>
              </div>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-300 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/60 to-slate-900/80 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 mb-3 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <p className="font-semibold text-white text-base">Watch Match Analysis in Action</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  See how ResumeIQ extracts skills, scores candidate resumes with mathematical transparency, and flags missing qualifications.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to test with your own resume?</span>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Try It Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        ResumeIQ &copy; 2026. Built with FastAPI, PostgreSQL, Next.js & NLP.
      </footer>
    </div>
  );
}


