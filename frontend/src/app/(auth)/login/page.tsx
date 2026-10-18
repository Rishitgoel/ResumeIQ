"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import {
  ArrowRight,
  AlertCircle,
  Target,
  BarChart3,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const testimonials = [
    {
      quote:
        "ResumeIQ helped me identify key skills I was missing and helped me ace interviews at top product companies!",
      author: "Rishit Goel",
      role: "Software Engineer",
    },
    {
      quote:
        "The JD match score and skill gap suggestions gave me the exact edge I needed for my SDE applications.",
      author: "Aanya Sharma",
      role: "Full Stack Developer",
    },
    {
      quote:
        "Saved me hours of guesswork. My interview callback rate jumped significantly after tailoring my resume.",
      author: "David Chen",
      role: "Backend Engineer",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("engineer@example.com");
    setPassword("password123");
    setError(null);
  };

  const handleSocialClick = (provider: string) => {
    // Fill demo credentials for testing convenience
    fillDemo();
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6fb] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient background soft glow blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-10 w-[500px] h-[500px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none" />

      {/* Main App Container */}
      <div className="w-full max-w-6xl bg-[#fcfdff]/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-300/40 border border-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* ================= LEFT COLUMN: HERO & PREVIEWS ================= */}
        <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100/90 relative bg-gradient-to-br from-white via-[#f8faff] to-[#f0f4ff]/50">
          
          {/* Subtle decorative glow behind mockup cards */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-96 h-80 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Slogan */}
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              {/* Logo */}
              <Logo size="md" withSubtitle asLink href="/" />

              {/* Slogan */}
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-400 font-medium leading-snug">
                  &ldquo;A better resume.
                  <br />
                  A brighter future.&rdquo;
                </p>
                <div className="w-7 h-0.5 bg-indigo-400/50 ml-auto mt-1 rounded-full" />
              </div>
            </div>

            {/* Main Headline */}
            <div className="mt-8 sm:mt-9">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Turn Your Resume <br />
                Into{" "}
                <span className="text-[#4f46e5] bg-clip-text text-transparent bg-gradient-to-r from-[#4f46e5] to-[#6366f1]">
                  Opportunities
                </span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
                Get AI-powered insights, match your resume with job descriptions, and bridge skill gaps — all in one place.
              </p>
            </div>

            {/* 3 Feature Highlight Badges */}
            <div className="mt-6 space-y-3.5 max-w-md">
              {/* Feature 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Accurate JD Matching
                  </h3>
                  <p className="text-xs text-slate-500">
                    See how well your resume fits a job role with transparent scoring.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Identify Skill Gaps
                  </h3>
                  <p className="text-xs text-slate-500">
                    Find missing skills and get personalized suggestions.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Improve &amp; Grow
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get actionable feedback to land your dream job.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Illustration Mockup (Resume + Match Gauge Cards) */}
            <div className="mt-8 sm:mt-9 relative flex flex-col items-center">
              <div className="relative flex items-center justify-center -space-x-4 sm:-space-x-5">
                
                {/* Left Card: Resume preview (tilted) */}
                <div className="w-44 sm:w-48 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/70 border border-slate-100/90 -rotate-6 transition-all duration-300 hover:-rotate-3 z-10">
                  <div className="text-xs font-bold text-slate-900">Rishit Goel</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">Software Engineer</div>
                  
                  <div className="mt-3">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Experience
                    </span>
                    <div className="h-1.5 bg-slate-200/80 rounded-full w-full mt-1.5" />
                    <div className="h-1.5 bg-slate-100 rounded-full w-4/5 mt-1" />
                  </div>

                  <div className="mt-3">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Education
                    </span>
                    <div className="h-1.5 bg-slate-200/80 rounded-full w-11/12 mt-1.5" />
                    <div className="h-1.5 bg-slate-100 rounded-full w-3/4 mt-1" />
                  </div>

                  <div className="mt-3">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Skills
                    </span>
                    <div className="h-1.5 bg-slate-200/80 rounded-full w-5/6 mt-1.5" />
                  </div>
                </div>

                {/* Right Card: Match Breakdown */}
                <div className="w-52 sm:w-56 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl shadow-indigo-200/50 border border-slate-100 rotate-1 transition-all duration-300 hover:rotate-0 z-20">
                  {/* Gauge */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          className="text-emerald-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          className="text-[#10b981]"
                          strokeWidth="3.5"
                          strokeDasharray={119.38}
                          strokeDashoffset={119.38 * (1 - 0.87)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-base font-extrabold text-slate-900">
                        87%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#10b981] mt-1">
                      Great Match!
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="mt-3.5 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
                        <span>Skills Matched</span>
                      </div>
                      <span className="font-bold text-slate-900">8/10</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span>Relevant Experience</span>
                      </div>
                      <span className="font-bold text-slate-900">4/5</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>Missing Skills</span>
                      </div>
                      <span className="font-bold text-slate-900">2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Handwritten note & arrow */}
              <div className="flex items-center justify-center gap-3 mt-3 text-[#3730a3] font-handwriting select-none">
                <span className="text-lg font-bold">From resume</span>
                <svg
                  className="w-16 h-7 text-[#3730a3] -mt-1"
                  viewBox="0 0 70 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M 5 8 Q 35 22 62 7" />
                  <path d="M 53 5 L 62 7 L 59 15" />
                </svg>
                <span className="text-lg font-bold">To opportunities</span>
              </div>
            </div>
          </div>

          {/* Testimonial & Pagination Dots */}
          <div className="mt-8 pt-5 border-t border-slate-100/90 relative z-10">
            <p className="text-xs text-slate-500 italic max-w-lg min-h-[30px] transition-all leading-relaxed">
              &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeTestimonial === i
                      ? "w-5 bg-indigo-600"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SIGN IN FORM ================= */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex items-center justify-center bg-[#f8faff]/70">
          {/* Dedicated Floating Card */}
          <div className="w-full max-w-[420px] bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/50 border border-slate-100 relative">
            
            {/* Header */}
            <div className="text-center mb-7">
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sign in to your ResumeIQ account
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialClick("Google")}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 cursor-pointer"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="whitespace-nowrap">Continue with Google</span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => handleSocialClick("GitHub")}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 cursor-pointer"
              >
                <svg className="w-4 h-4 flex-shrink-0 fill-slate-900" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span className="whitespace-nowrap">Continue with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest absolute">
                OR
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-xs font-medium text-[#4f46e5] hover:text-[#4338ca] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pill */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={fillDemo}
                className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Click to load demo credentials
              </button>
            </div>

            {/* Bottom Links */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#4f46e5] hover:text-[#4338ca] font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Legal Agreement */}
            <div className="mt-6 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                By signing in, you agree to our{" "}
                <Link href="#" className="hover:underline text-slate-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="hover:underline text-slate-500">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

