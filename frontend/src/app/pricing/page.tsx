"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import {
  Check,
  ArrowRight,
  Sparkles,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Award,
  ArrowLeft,
} from "lucide-react";

export default function PricingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the match scoring engine work?",
      a: "ResumeIQ utilizes a multi-layered NLP semantic matching pipeline that tokenizes required skills, preferred qualifications, experience durations, education, and domain competencies. It calculates a weighted linear combination that is 100% explainable, avoiding black-box guesswork.",
    },
    {
      q: "Can I cancel or change my plan anytime?",
      a: "Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings. If you cancel, your benefits remain active until the end of your billing cycle.",
    },
    {
      q: "What file formats does ResumeIQ support?",
      a: "Currently, ResumeIQ specializes in native PDF resume parsing to maintain precise typographic layout and section boundary extraction without losing semantic context.",
    },
    {
      q: "What is Multi-Resume Comparison?",
      a: "Multi-Resume Comparison allows you to select 2 to 5 candidate resumes and evaluate them side-by-side against a single target job description. You get an instant ranked leaderboard, shared skill matrices, and unique differentiator breakdowns.",
    },
    {
      q: "Is there a free trial for Pro features?",
      a: "Every new account includes 5 free resume analyses and full access to our core matching engine with no credit card required.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" asLink href="/" />

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-[#4F46E5]/20 text-[#4F46E5]" />
            <span>Investment in Your Tech Career</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transparent, Predictable <span className="text-[#4F46E5]">Plans</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed">
            Gain the competitive edge for your next technical interview. Upgrade for unlimited analyses, deep skill gap suggestions, and multi-candidate comparisons.
          </p>

          {/* Billing Switcher */}
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {/* Free Starter */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Starter Free</h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  Basic
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Perfect for students starting out with their first tech resumes.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>5 Resume Analyses per month</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Single Resume PDF Storage</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Core 0–100% Match Score</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Top 5 Missing Skills Identification</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <Check className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Multi-Resume Comparison</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <Check className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Custom Linear Scoring Weights</span>
                </div>
              </div>
            </div>

            <Link
              href={user ? "/dashboard" : "/register"}
              className="mt-8 w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs text-center border border-slate-200/90 transition-all block"
            >
              {user ? "Current Free Plan" : "Get Started Free"}
            </Link>
          </div>

          {/* Pro Candidate */}
          <div className="relative bg-white rounded-3xl p-8 border-2 border-[#4F46E5] shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Pro Career Booster</h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">For active job seekers who want to maximize their interview callback rate.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {billingCycle === "annual" ? "$9.60" : "$12"}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              {billingCycle === "annual" && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Billed annually ($115/year)</p>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                  <span>Unlimited Resume PDF Uploads</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                  <span>Unlimited Match Analyses</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                  <span>Side-by-Side Multi-Resume Comparison</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                  <span>Personalized AI Bullet Point Suggestions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                  <span>Custom Linear Scoring Weights Adjustment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#4F46E5] shrink-0 stroke-[3]" />
                  <span>Priority High-Speed NLP Processing</span>
                </div>
              </div>
            </div>

            <Link
              href={user ? "/analysis/new" : "/register"}
              className="mt-8 w-full py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs text-center shadow-lg shadow-indigo-600/25 transition-all block cursor-pointer"
            >
              Upgrade to Pro Now
            </Link>
          </div>

          {/* Recruiter / Enterprise */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Campus & Recruiter</h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  Team
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">For university career centers, bootcamps, and hiring teams.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {billingCycle === "annual" ? "$39" : "$49"}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              {billingCycle === "annual" && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Billed annually ($468/year)</p>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 font-medium text-slate-800">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Everything in Pro Plan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Batch Candidate Screening & Ranking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Shared Team Job & Resume Repositories</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>REST API Access & Webhook Integrations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                  <span>Dedicated Account Manager & SLA</span>
                </div>
              </div>
            </div>

            <Link
              href={user ? "/settings" : "/register"}
              className="mt-8 w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs text-center border border-slate-200/90 transition-all block"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-24 overflow-x-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Full Plan Feature Comparison</h2>
            <p className="text-xs text-slate-400 mt-1">Detailed breakdown of capabilities across all tiers.</p>
          </div>

          <table className="w-full text-left text-xs text-slate-600 min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-4 font-semibold">Platform Capabilities</th>
                <th className="py-4 px-4 font-semibold">Starter (Free)</th>
                <th className="py-4 px-4 font-semibold text-indigo-600">Pro ($12/mo)</th>
                <th className="py-4 px-4 font-semibold">Campus & Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 font-medium text-slate-800">Monthly Analyses</td>
                <td className="py-3.5 px-4">5 / month</td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">Unlimited</td>
                <td className="py-3.5 px-4">Unlimited (Batch)</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-slate-800">PDF Parsing & Skill Extraction</td>
                <td className="py-3.5 px-4">Standard</td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">High-Precision NLP</td>
                <td className="py-3.5 px-4">High-Precision NLP</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-slate-800">Skill Gap Breakdown Radar</td>
                <td className="py-3.5 px-4">Top 5 Skills</td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">Full 360° Matrix</td>
                <td className="py-3.5 px-4">Full 360° Matrix</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-slate-800">Multi-Resume Side-by-Side Comparison</td>
                <td className="py-3.5 px-4 text-slate-300">—</td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">Up to 5 Resumes</td>
                <td className="py-3.5 px-4">Unlimited Batch</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-slate-800">Custom Scoring Weight Sliders</td>
                <td className="py-3.5 px-4 text-slate-300">—</td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">Included</td>
                <td className="py-3.5 px-4">Included & Configurable</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-slate-800">AI Bullet Point Rewrite Suggestions</td>
                <td className="py-3.5 px-4 text-slate-300">—</td>
                <td className="py-3.5 px-4 font-semibold text-indigo-600">Full Access</td>
                <td className="py-3.5 px-4">Full Access</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-slate-800">API Access & Webhooks</td>
                <td className="py-3.5 px-4 text-slate-300">—</td>
                <td className="py-3.5 px-4 text-slate-300">—</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-600">REST API & Webhooks</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Have a question? We&apos;re here to help.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-20">
        ResumeIQ &copy; 2026. Built with FastAPI, PostgreSQL, Next.js & NLP.
      </footer>
    </div>
  );
}
