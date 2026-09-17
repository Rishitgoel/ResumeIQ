"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types";
import { getScoreColor, formatDate } from "@/lib/utils";
import {
  FileText,
  Briefcase,
  Crosshair,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Loader2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.get<DashboardStats>("/analytics/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const barColors = ["#f43f5e", "#f59e0b", "#3b82f6", "#6366f1", "#10b981"];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Intelligence Dashboard"
        description="Overview of your analyzed resumes, active job descriptions, and match metrics."
        actionText="New Analysis"
        actionHref="/analysis/new"
      />

      <div className="p-8 space-y-8 max-w-7xl">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Resumes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.total_resumes || 0}</h3>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Descriptions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.total_jobs || 0}</h3>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Analyses</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.total_analyses || 0}</h3>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Match Score</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.average_match_score || 0}%</h3>
            </div>
          </Card>
        </div>

        {/* Charts & Missing Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Distribution Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Match Score Distribution</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of resume-to-job match scores across 5 scoring tiers
              </p>
            </CardHeader>
            <CardContent className="h-72">
              {stats?.score_distribution && stats.score_distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.score_distribution} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="range_label" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {stats.score_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Run analyses to view distribution curves.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Missing Skills */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Skill Gaps</CardTitle>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Frequently missing skills required by your jobs
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.top_missing_skills && stats.top_missing_skills.length > 0 ? (
                stats.top_missing_skills.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-sm font-semibold text-slate-800">{s.skill_name}</span>
                    <Badge variant="warning" size="sm">
                      {s.frequency} {s.frequency === 1 ? "job" : "jobs"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No missing skills detected yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Match Analyses</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Your latest candidate vs. job description evaluations</p>
            </div>
            <Link href="/analysis/new">
              <Button variant="outline" size="sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Analyze New Pair
              </Button>
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Candidate Resume</th>
                  <th className="px-6 py-3.5">Target Job</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Match Score</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
                  stats.recent_analyses.map((a) => {
                    const colors = getScoreColor(a.overall_score);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {a.resume_title}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{a.job_title}</td>
                        <td className="px-6 py-4 text-slate-500">{a.company || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors.badge}`}>
                            {a.overall_score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{formatDate(a.created_at)}</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/analysis/${a.id}`}>
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">
                              View Report
                              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                      No analyses recorded yet. Upload a resume and job description to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
