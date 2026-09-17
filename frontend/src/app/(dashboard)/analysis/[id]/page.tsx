"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { api } from "@/lib/api";
import { AnalysisDetail, SkillMatch, Suggestion } from "@/types";
import { getScoreColor, formatDate } from "@/lib/utils";
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
  Loader2
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
  const analysisId = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState<"ALL" | "MATCHED" | "MISSING">("ALL");

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
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex-1 p-12 text-center text-slate-500">
        Analysis report not found.
      </div>
    );
  }

  const colors = getScoreColor(analysis.overall_score);

  // Radar chart data preparation
  const radarData = [
    { subject: "Required Skills", score: analysis.required_skills_score, fullMark: 100 },
    { subject: "Preferred Skills", score: analysis.preferred_skills_score, fullMark: 100 },
    { subject: "Experience", score: analysis.experience_score, fullMark: 100 },
    { subject: "Projects", score: analysis.project_score, fullMark: 100 },
    { subject: "Education", score: analysis.education_score, fullMark: 100 },
  ];

  const filteredSkills = analysis.skill_matches.filter((m) => {
    if (skillFilter === "MATCHED") return m.match_status !== "MISSING";
    if (skillFilter === "MISSING") return m.match_status === "MISSING";
    return true;
  });

  const matchedCount = analysis.skill_matches.filter((m) => m.match_status !== "MISSING").length;
  const missingCount = analysis.skill_matches.filter((m) => m.match_status === "MISSING").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Candidate Match Intelligence Report"
        description={`Evaluated ${analysis.resume_title} against ${analysis.job_title} (${analysis.job_company || "Company"})`}
      />

      <div className="p-8 max-w-7xl space-y-8">
        {/* Navigation Actions */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-slate-700"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print / PDF Export
            </Button>
            <Link href={`/compare?jobId=${analysis.job_description_id}&resumeId=${analysis.resume_id}`}>
              <Button variant="primary" size="sm">
                Compare With Other Candidates
              </Button>
            </Link>
          </div>
        </div>

        {/* Overall Score Banner */}
        <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bg} flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200/80 shadow-md flex flex-col items-center justify-center text-center p-2">
              <span className={`text-3xl font-extrabold ${colors.text}`}>
                {analysis.overall_score}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Match Score
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors.badge}`}>
                  {analysis.overall_score >= 80
                    ? "Strong Candidate Match"
                    : analysis.overall_score >= 60
                    ? "Moderate Candidate Fit"
                    : "Partial Match"}
                </span>
                <span className="text-xs text-slate-500">
                  Calculated {formatDate(analysis.created_at)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {analysis.resume_title} ↔ {analysis.job_title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Internal compatibility metric based on weighted skill overlap, evidence strength, work experience, and educational alignment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="bg-white/80 border border-slate-200/60 px-4 py-2.5 rounded-xl">
              <p className="text-lg font-bold text-emerald-600">{matchedCount}</p>
              <p className="text-[11px] text-slate-500 font-medium">Matched Skills</p>
            </div>
            <div className="bg-white/80 border border-slate-200/60 px-4 py-2.5 rounded-xl">
              <p className="text-lg font-bold text-rose-600">{missingCount}</p>
              <p className="text-[11px] text-slate-500 font-medium">Missing Skills</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown Bars & Radar Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dimension Progress Bars */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Weighted Dimensions Breakdown</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed scores across all 5 evaluation criteria
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Required Skills */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    Required Skills (Weight: {Math.round((analysis.scoring_weights?.required_skills || 0.4) * 100)}%)
                  </span>
                  <span className="font-bold text-slate-900">{analysis.required_skills_score}%</span>
                </div>
                <Progress value={analysis.required_skills_score} />
              </div>

              {/* Preferred Skills */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Preferred / Bonus Skills (Weight: {Math.round((analysis.scoring_weights?.preferred_skills || 0.2) * 100)}%)
                  </span>
                  <span className="font-bold text-slate-900">{analysis.preferred_skills_score}%</span>
                </div>
                <Progress value={analysis.preferred_skills_score} />
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    Experience Duration & Scope (Weight: {Math.round((analysis.scoring_weights?.experience || 0.15) * 100)}%)
                  </span>
                  <span className="font-bold text-slate-900">{analysis.experience_score}%</span>
                </div>
                <Progress value={analysis.experience_score} />
              </div>

              {/* Projects */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    Project Tech Stack Relevance (Weight: {Math.round((analysis.scoring_weights?.projects || 0.1) * 100)}%)
                  </span>
                  <span className="font-bold text-slate-900">{analysis.project_score}%</span>
                </div>
                <Progress value={analysis.project_score} />
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Education Level Match (Weight: {Math.round((analysis.scoring_weights?.education || 0.1) * 100)}%)
                  </span>
                  <span className="font-bold text-slate-900">{analysis.education_score}%</span>
                </div>
                <Progress value={analysis.education_score} />
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="lg:col-span-5 flex flex-col">
            <CardHeader>
              <CardTitle>Compatibility Radar</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Multivariate balance of candidate strengths</p>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-2 min-h-[260px]">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Candidate Score"
                    dataKey="score"
                    stroke="#4f46e5"
                    fill="#6366f1"
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Explainability & Mathematical Narrative */}
        {analysis.explanation_summary && (
          <Card className="border-indigo-100 bg-indigo-50/20">
            <CardHeader className="border-indigo-100">
              <CardTitle className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Score Explanation & Evaluation Rationale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap space-y-2">
                {analysis.explanation_summary}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skill Matching Grid */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Skill Match Breakdown</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact keyword matches, semantic approximations, and missing competencies
              </p>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSkillFilter("ALL")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  skillFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                All ({analysis.skill_matches.length})
              </button>
              <button
                onClick={() => setSkillFilter("MATCHED")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  skillFilter === "MATCHED" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Matched ({matchedCount})
              </button>
              <button
                onClick={() => setSkillFilter("MISSING")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  skillFilter === "MISSING" ? "bg-white text-rose-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Missing ({missingCount})
              </button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Skill Requirement</th>
                  <th className="px-6 py-3.5">Requirement Type</th>
                  <th className="px-6 py-3.5">Match Status</th>
                  <th className="px-6 py-3.5">Evidence Tier</th>
                  <th className="px-6 py-3.5">Contextual Snippet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkills.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{m.skill_name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={m.requirement_type === "REQUIRED_SKILL" ? "danger" : "default"} size="sm">
                        {m.requirement_type === "REQUIRED_SKILL" ? "Required" : "Preferred"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {m.match_status === "EXACT_MATCH" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Exact
                        </span>
                      )}
                      {m.match_status === "SEMANTIC_MATCH" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          <Sparkles className="w-3.5 h-3.5" /> Semantic ({(m.similarity_score * 100).toFixed(0)}%)
                        </span>
                      )}
                      {m.match_status === "MISSING" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {m.resume_evidence_level === "STRONG" && (
                        <span className="text-xs font-bold text-emerald-600">Strong</span>
                      )}
                      {m.resume_evidence_level === "MODERATE" && (
                        <span className="text-xs font-semibold text-indigo-600">Moderate</span>
                      )}
                      {m.resume_evidence_level === "WEAK" && (
                        <span className="text-xs font-medium text-amber-600">Weak (List only)</span>
                      )}
                      {m.resume_evidence_level === "NONE" && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-sm truncate" title={m.resume_snippet || undefined}>
                      {m.resume_snippet ? `"${m.resume_snippet}"` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actionable Resume Improvement Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Actionable Resume Improvement Suggestions ({analysis.suggestions.length})
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized advice to address skill gaps, strengthen weak evidence, and maximize alignment
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((s) => {
                const priorityBadge =
                  s.priority === "HIGH"
                    ? { variant: "danger" as const, text: "High Priority" }
                    : s.priority === "MEDIUM"
                    ? { variant: "warning" as const, text: "Medium Priority" }
                    : { variant: "default" as const, text: "Low Priority" };

                return (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{s.title}</h4>
                      <Badge variant={priorityBadge.variant} size="sm">
                        {priorityBadge.text}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">
                Outstanding match! No major improvement suggestions identified.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
