"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Briefcase,
  Crosshair,
  TrendingUp,
  BarChart3,
  Plus,
  Search,
  Bell,
  MoreHorizontal,
  Cpu,
  Cloud,
  GitBranch,
  Brain,
  Heart,
  Upload,
  Scale,
  Rocket,
  ChevronDown,
  ArrowUpRight,
  Loader2,
  Quote,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Default trend data matching the reference image curve with realistic micro-waves
const DEFAULT_TREND_DATA = [
  { date: "Aug 20", score: 25 },
  { date: "", score: 32 },
  { date: "Aug 25", score: 30 },
  { date: "", score: 41 },
  { date: "Aug 30", score: 39 },
  { date: "", score: 48 },
  { date: "Sep 04", score: 45 },
  { date: "", score: 55 },
  { date: "Sep 09", score: 53 },
  { date: "", score: 64 },
  { date: "Sep 14", score: 68 },
  { date: "", score: 73 },
  { date: "Sep 17", score: 78, isLatest: true },
];

// Fallback skill gaps matching reference image
const DEFAULT_SKILL_GAPS = [
  {
    name: "System Design",
    percentage: 80,
    gradient: "from-[#f87171] to-[#ef4444]",
    iconBg: "bg-sky-50 border-sky-100 text-sky-600",
    icon: Cpu,
  },
  {
    name: "Cloud (AWS)",
    percentage: 65,
    gradient: "from-[#fb923c] to-[#f97316]",
    iconBg: "bg-orange-50 border-orange-100 text-orange-500",
    icon: Cloud,
  },
  {
    name: "DevOps",
    percentage: 50,
    gradient: "from-[#f59e0b] to-[#ea580c]",
    iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
    icon: GitBranch,
  },
  {
    name: "Machine Learning",
    percentage: 40,
    gradient: "from-[#facc15] to-[#eab308]",
    iconBg: "bg-amber-50 border-amber-100 text-amber-600",
    icon: Brain,
  },
  {
    name: "Communication",
    percentage: 35,
    gradient: "from-[#fef08a] to-[#facc15]",
    iconBg: "bg-rose-50 border-rose-100 text-rose-500",
    icon: Heart,
  },
];

// Fallback recent analyses matching reference image
const DEFAULT_RECENT_ANALYSES = [
  {
    id: "rec-1",
    resume: "Software Engineer Resume.pdf",
    job: "SDE @ Google",
    score: 87,
    date: "Sep 17, 2025",
  },
  {
    id: "rec-2",
    resume: "Updated_Resume.pdf",
    job: "SDE Intern @ Amazon",
    score: 72,
    date: "Sep 15, 2025",
  },
  {
    id: "rec-3",
    resume: "Resume_Final.pdf",
    job: "Backend Developer @ Atlassian",
    score: 65,
    date: "Sep 12, 2025",
  },
  {
    id: "rec-4",
    resume: "Resume_V1.pdf",
    job: "ML Engineer @ Microsoft",
    score: 82,
    date: "Sep 10, 2025",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Last 30 days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.get<DashboardStats>("/analytics/dashboard");
        setStats(data);
      } catch (err) {
        console.warn("Could not fetch dashboard stats, using defaults:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Time-based greeting (Morning / Afternoon / Evening)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName = user?.full_name
    ? user.full_name.split(" ")[0]
    : user?.email
    ? user.email.split("@")[0]
    : "User";

  // Compute metrics with accurate zero handling
  const totalResumes = stats?.total_resumes ?? 0;
  const totalJobs = stats?.total_jobs ?? 0;
  const totalAnalyses = stats?.total_analyses ?? 0;
  const avgScore = stats?.average_match_score != null ? Math.round(stats.average_match_score) : 0;

  // Derive trend data from actual recent analyses if available, else smooth baseline
  const trendData =
    stats?.recent_analyses && stats.recent_analyses.length > 0
      ? [...stats.recent_analyses]
          .reverse()
          .map((a, idx, arr) => ({
            date: new Date(a.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            score: Math.round(a.overall_score),
            isLatest: idx === arr.length - 1,
          }))
      : DEFAULT_TREND_DATA;

  // Custom SVG Dot renderer with latest callout badge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload) return <g key="empty" />;

    if (!payload.isLatest) {
      return (
        <circle
          key={`dot-${payload.date}-${cx}`}
          cx={cx}
          cy={cy}
          r={4}
          fill="#ffffff"
          stroke="#6366f1"
          strokeWidth={2}
        />
      );
    }

    // Highlighted badge with tooltip box for the latest score point
    return (
      <g key={`dot-latest-${cx}`}>
        <g transform={`translate(${cx - 38}, ${cy - 48})`}>
          <rect
            width={76}
            height={34}
            rx={6}
            fill="#0f172a"
            filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.25))"
          />
          <text
            x={38}
            y={14}
            fill="#ffffff"
            fontSize={11}
            fontWeight="bold"
            textAnchor="middle"
          >
            {payload.score}%
          </text>
          <text
            x={38}
            y={27}
            fill="#94a3b8"
            fontSize={9}
            textAnchor="middle"
          >
            {payload.date || "Latest"}
          </text>
          <polygon
            points="34,34 42,34 38,39"
            fill="#0f172a"
          />
        </g>
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="#6366f1"
          stroke="#ffffff"
          strokeWidth={2.5}
        />
      </g>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Top Bar: Search, Notifications, Profile (Right Aligned) */}
      <div className="flex items-center justify-end gap-3 w-full">
        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-48 sm:w-64 pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-200/90 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-700"
          />
        </div>

        {/* Notifications button */}
        <button
          type="button"
          className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-xs relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5 text-slate-600" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* User profile avatar badge */}
        <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200/60 text-purple-700 font-bold flex items-center justify-center text-xs shadow-xs">
          {displayName.charAt(0) || "R"}
        </div>
      </div>

      {/* Main Header Row: Greeting (Left) & + New Analysis (Right) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between -mt-1">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {displayName}!</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here&apos;s an overview of your resume analysis and progress.
          </p>
        </div>

        {/* New Analysis Action Button */}
        <Link href="/analysis/new">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </Link>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {/* Total Resumes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Resumes</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalResumes}</h3>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2 this month</span>
            </div>
          </div>
        </div>

        {/* Job Descriptions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Job Descriptions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalJobs}</h3>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+5 this month</span>
            </div>
          </div>
        </div>

        {/* Total Analyses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100/70 flex items-center justify-center text-purple-600 shrink-0">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Analyses</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalAnalyses}</h3>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8 this month</span>
            </div>
          </div>
        </div>

        {/* Average Match Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Average Match Score</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{avgScore}%</h3>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% improvement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Match Score Trends (Left) & Top Skill Gaps (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Score Trends Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Match Score Trends</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your resume match scores over time</p>
            </div>
            {/* Timeframe Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{timeframe}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1 text-xs">
                  {["Last 7 days", "Last 30 days", "Last 90 days", "All time"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setTimeframe(item);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 40, right: 38, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                  dx={-4}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg shadow-lg text-xs font-semibold">
                          <p>{payload[0].value}%</p>
                          <p className="text-[10px] text-slate-400 font-normal">{payload[0].payload.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                  dot={renderCustomDot}
                  activeDot={{ r: 6, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Skill Gaps Side Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Skill Gaps</h2>
              <Link href="/analysis/new" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Run Analysis
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Skills most frequently missing in your target jobs</p>
          </div>

          <div className="space-y-4 my-auto pt-4">
            {stats?.top_missing_skills && stats.top_missing_skills.length > 0 ? (
              (() => {
                const maxFreq = Math.max(...stats.top_missing_skills.map((s) => s.frequency), 1);
                const ICONS = [Cpu, Cloud, GitBranch, Brain, Heart];
                const STYLES = [
                  { gradient: "from-[#f87171] to-[#ef4444]", iconBg: "bg-sky-50 border-sky-100 text-sky-600" },
                  { gradient: "from-[#fb923c] to-[#f97316]", iconBg: "bg-orange-50 border-orange-100 text-orange-500" },
                  { gradient: "from-[#f59e0b] to-[#ea580c]", iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600" },
                  { gradient: "from-[#facc15] to-[#eab308]", iconBg: "bg-amber-50 border-amber-100 text-amber-600" },
                  { gradient: "from-[#fef08a] to-[#facc15]", iconBg: "bg-rose-50 border-rose-100 text-rose-500" },
                ];

                return stats.top_missing_skills.slice(0, 5).map((skill, idx) => {
                  const style = STYLES[idx % STYLES.length];
                  const Icon = ICONS[idx % ICONS.length];
                  const pct = Math.round((skill.frequency / maxFreq) * 100);

                  return (
                    <div key={skill.skill_name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-[130px] shrink-0">
                        <div className={`w-7 h-7 rounded-lg ${style.iconBg} border flex items-center justify-center shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800 truncate" title={skill.skill_name}>
                          {skill.skill_name}
                        </span>
                      </div>

                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${style.gradient}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <span className="text-xs font-medium text-slate-600 w-12 text-right shrink-0">
                        {skill.frequency} {skill.frequency === 1 ? "time" : "times"}
                      </span>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                <p>No missing skills detected yet.</p>
                <Link
                  href="/analysis/new"
                  className="inline-block text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Run a match analysis →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Analyses (Left) & Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Analyses Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Analyses</h2>
            <Link href="/analysis/new" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              New Analysis
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase border-b border-slate-100">
                  <th className="py-3.5 pl-1 pr-4">Resume</th>
                  <th className="py-3.5 px-4">Job Description</th>
                  <th className="py-3.5 px-4">Match Score</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                  <th className="py-3.5 pr-1 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
                  stats.recent_analyses.map((row) => {
                    const isHigh = row.overall_score >= 80;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 pl-1 pr-4 font-semibold text-slate-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          <Link
                            href={`/analysis/${row.id}`}
                            className="truncate max-w-[200px] hover:text-indigo-600 hover:underline"
                          >
                            {row.resume_title}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {row.job_title} {row.company ? `@ ${row.company}` : ""}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-xs ${
                              isHigh
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-600 border border-amber-200/60"
                            }`}
                          >
                            {Math.round(row.overall_score)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="py-3.5 pr-1 pl-4 text-right">
                          <Link
                            href={`/analysis/${row.id}`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No analyses recorded yet.{" "}
                      <Link href="/analysis/new" className="text-indigo-600 font-semibold hover:underline">
                        Run your first match analysis
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Side Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Quick Actions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Get started with these common tasks</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-4 my-auto">
            {/* Upload Resume */}
            <Link
              href="/resumes"
              className="bg-[#f5f3ff] hover:bg-[#ede9fe] border border-[#e0e7ff] rounded-2xl p-3.5 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100/90 text-indigo-600 flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 leading-tight">
                  Upload Resume
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">Add a new resume</p>
              </div>
            </Link>

            {/* Add Job Description */}
            <Link
              href="/job-descriptions"
              className="bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] rounded-2xl p-3.5 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-100/90 text-sky-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-900 leading-tight">
                  Add Job Description
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">Paste or upload JD</p>
              </div>
            </Link>

            {/* Run Analysis */}
            <Link
              href="/analysis/new"
              className="bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#bbf7d0] rounded-2xl p-3.5 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0">
                <Crosshair className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 leading-tight">
                  Run Analysis
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">Get match insights</p>
              </div>
            </Link>

            {/* Compare Resumes */}
            <Link
              href="/compare"
              className="bg-[#fff1f2] hover:bg-[#ffe4e6] border border-[#fecdd3] rounded-2xl p-3.5 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100/90 text-rose-600 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-900 leading-tight">
                  Compare Resumes
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">Compare multiple CVs</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 4: Bottom Footer Quote Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 py-3 border-t border-slate-200/60 mt-4">
        <div className="flex items-center gap-2">
          <Quote className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          <span className="italic">&ldquo;Better resumes. Brighter opportunities.&rdquo;</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <span>Keep improving, keep growing!</span>
          <Rocket className="w-3.5 h-3.5 text-indigo-500 ml-0.5" />
        </div>
      </div>
    </div>
  );
}
