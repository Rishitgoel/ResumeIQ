"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AnalysisDetail } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Sliders,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Lightbulb,
  Printer,
  Trash2,
  Loader2,
  Crosshair,
  Building,
  FileText,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [skillFilter, setSkillFilter] = useState<"ALL" | "MATCHED" | "MISSING">("ALL");

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this analysis report?")) return;
    setDeleting(true);
    try {
      await api.delete(`/analyses/${analysisId}`);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete analysis:", err);
      alert("Failed to delete analysis report.");
      setDeleting(false);
    }
  };

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const data = await api.get<AnalysisDetail>(`/analyses/${analysisId}`);
        setAnalysis(data);
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
      }
    }
    if (analysisId) loadAnalysis();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Generating intelligence report...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex-1 p-12 text-center text-slate-500">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-100 shadow-xs">
          <Crosshair className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Analysis report not found</h3>
          <p className="text-xs text-slate-400 mb-6">The analysis record does not exist or may have been deleted.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Radar chart data preparation
  const radarData = [
    { subject: "Required Skills", score: Math.round(analysis.required_skills_score), fullMark: 100 },
    { subject: "Preferred Skills", score: Math.round(analysis.preferred_skills_score), fullMark: 100 },
    { subject: "Experience", score: Math.round(analysis.experience_score), fullMark: 100 },
    { subject: "Projects", score: Math.round(analysis.project_score), fullMark: 100 },
    { subject: "Education", score: Math.round(analysis.education_score), fullMark: 100 },
  ];

  const filteredSkills = analysis.skill_matches.filter((m) => {
    if (skillFilter === "MATCHED") return m.match_status !== "MISSING";
    if (skillFilter === "MISSING") return m.match_status === "MISSING";
    return true;
  });

  const matchedCount = analysis.skill_matches.filter((m) => m.match_status !== "MISSING").length;
  const missingCount = analysis.skill_matches.filter((m) => m.match_status === "MISSING").length;

  const score = Math.round(analysis.overall_score);
  const isHighFit = score >= 75;
  const isMedFit = score >= 50 && score < 75;

  // Donut gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Link href="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <span>/</span>
          <span>Analysis Report</span>
          <span>/</span>
          <span className="text-slate-700 font-semibold truncate max-w-xs">{analysis.resume_title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <Link
            href={`/compare?jobId=${analysis.job_description_id}&resumeId=${analysis.resume_id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs transition-colors"
          >
            <span>Compare Candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200/90 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card with Donut Score Gauge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Circular Donut Gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#06B6D4] transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Match</span>
            </div>
          </div>

          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isHighFit
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isMedFit
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {isHighFit ? "✦ Strong Candidate Fit" : isMedFit ? "Moderate Candidate Fit" : "Needs Skill Alignment"}
              </span>
              <span className="text-xs text-slate-400">• Analyzed on {formatDate(analysis.created_at)}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {analysis.resume_title} ↔ {analysis.job_title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Target Company: <strong className="text-slate-700">{analysis.job_company || "Independent"}</strong>.
              Your candidate profile satisfies {score}% of technical prerequisites, required domains, and experience thresholds.
            </p>
          </div>
        </div>

        {/* Quick Stat Pill Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100/80">
            <p className="text-2xl font-extrabold text-emerald-600">{matchedCount}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Matched Skills</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100/80">
            <p className="text-2xl font-extrabold text-rose-600">{missingCount}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Missing Skills</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-2xl p-4 text-center border border-slate-100/80">
            <p className="text-2xl font-extrabold text-indigo-600">
              {Math.round(analysis.experience_score)}%
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Experience Fit</p>
          </div>
        </div>
      </div>

      {/* Row 2: 5 Progress Bars & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dimension Progress Bars */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Weighted Dimensions Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual score contributions according to mathematical linear weights.
            </p>
          </div>

          <div className="space-y-4">
            {/* Required Skills */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Required Skills (Weight: {Math.round((analysis.scoring_weights?.required_skills || 0.4) * 100)}%)</span>
                </span>
                <span className="font-bold text-slate-900">{Math.round(analysis.required_skills_score)}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${analysis.required_skills_score}%` }}
                />
              </div>
            </div>

            {/* Preferred Skills */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preferred / Bonus Skills (Weight: {Math.round((analysis.scoring_weights?.preferred_skills || 0.2) * 100)}%)</span>
                </span>
                <span className="font-bold text-slate-900">{Math.round(analysis.preferred_skills_score)}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${analysis.preferred_skills_score}%` }}
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Work Experience Duration (Weight: {Math.round((analysis.scoring_weights?.experience || 0.15) * 100)}%)</span>
                </span>
                <span className="font-bold text-slate-900">{Math.round(analysis.experience_score)}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-700"
                  style={{ width: `${analysis.experience_score}%` }}
                />
              </div>
            </div>

            {/* Projects */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Project Tech Alignment (Weight: {Math.round((analysis.scoring_weights?.projects || 0.1) * 100)}%)</span>
                </span>
                <span className="font-bold text-slate-900">{Math.round(analysis.project_score)}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${analysis.project_score}%` }}
                />
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Education Level (Weight: {Math.round((analysis.scoring_weights?.education || 0.1) * 100)}%)</span>
                </span>
                <span className="font-bold text-slate-900">{Math.round(analysis.education_score)}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${analysis.education_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Competency Coverage Radar</h2>
            <p className="text-xs text-slate-400 mt-0.5">360° candidate suitability mapping.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Skill Matches Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Semantic Skill Gap Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Line-by-line verification of job requirements against evidence extracted from candidate experience.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setSkillFilter("ALL")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                skillFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({analysis.skill_matches.length})
            </button>
            <button
              onClick={() => setSkillFilter("MATCHED")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                skillFilter === "MATCHED" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Matched ({matchedCount})
            </button>
            <button
              onClick={() => setSkillFilter("MISSING")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                skillFilter === "MISSING" ? "bg-white text-rose-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Missing ({missingCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-4">Skill Requirement</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Match Status</th>
                <th className="py-3.5 px-4">Evidence Level</th>
                <th className="py-3.5 px-4">Resume Context Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredSkills.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.skill_name}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.requirement_type === "REQUIRED_SKILL"
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {m.requirement_type === "REQUIRED_SKILL" ? "Required" : "Preferred"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {m.match_status === "EXACT_MATCH" && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Exact Match
                      </span>
                    )}
                    {m.match_status === "SEMANTIC_MATCH" && (
                      <span className="inline-flex items-center gap-1 font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        <Sparkles className="w-3.5 h-3.5" /> Semantic Match
                      </span>
                    )}
                    {m.match_status === "MISSING" && (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Missing Skill
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.resume_evidence_level === "STRONG"
                          ? "bg-emerald-50 text-emerald-700"
                          : m.resume_evidence_level === "MODERATE"
                          ? "bg-indigo-50 text-indigo-700"
                          : m.resume_evidence_level === "WEAK"
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-400"
                      }`}
                    >
                      {m.resume_evidence_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 italic max-w-md truncate">
                    {m.resume_snippet ? `"${m.resume_snippet}"` : <span className="text-slate-300">Not detected in text</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Actionable AI Suggestions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Actionable Optimization Recommendations
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">{analysis.suggestions.length} Suggestions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.suggestions.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-100/90 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      s.priority === "HIGH"
                        ? "bg-rose-100 text-rose-700"
                        : s.priority === "MEDIUM"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {s.priority} Priority
                  </span>
                  {s.action_category && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {s.action_category}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.description}</p>
              </div>

              <div className="pt-2 text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recommended action to increase score</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
