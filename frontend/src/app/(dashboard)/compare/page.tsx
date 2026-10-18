"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ResumeListItem, JobListItem, CompareResponse } from "@/types";
import { getScoreColor } from "@/lib/utils";
import {
  Scale,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Building,
  Target,
  Check,
  Crown,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";
  const initialResumeId = searchParams.get("resumeId") || "";

  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedResumeIds, setSelectedResumeIds] = useState<string[]>(
    initialResumeId ? [initialResumeId] : []
  );

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [jobData, resData] = await Promise.all([
          api.get<{ items: JobListItem[] }>("/jobs/"),
          api.get<{ items: ResumeListItem[] }>("/resumes/"),
        ]);
        setJobs(jobData.items || []);
        setResumes(resData.items || []);
        if (!selectedJobId && jobData.items?.length > 0) {
          setSelectedJobId(jobData.items[0].id);
        }
      } catch (err) {
        console.error("Failed to load compare options:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  const toggleResumeSelection = (id: string) => {
    if (selectedResumeIds.includes(id)) {
      setSelectedResumeIds(selectedResumeIds.filter((rId) => rId !== id));
    } else {
      if (selectedResumeIds.length >= 5) {
        alert("You can compare a maximum of 5 resumes simultaneously.");
        return;
      }
      setSelectedResumeIds([...selectedResumeIds, id]);
    }
  };

  const handleRunComparison = async () => {
    if (!selectedJobId) {
      setError("Please select a target job description.");
      return;
    }
    if (selectedResumeIds.length < 2) {
      setError("Please select at least 2 candidate resumes to compare.");
      return;
    }

    setError(null);
    setComparing(true);

    try {
      const data = await api.post<CompareResponse>("/analyses/compare", {
        job_description_id: selectedJobId,
        resume_ids: selectedResumeIds,
      });
      setComparisonResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to run comparison.");
    } finally {
      setComparing(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Loading comparison data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <span>Candidate Multi-Resume Comparison</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Evaluate 2 to 5 resumes simultaneously against a target job description with side-by-side skill verification.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selection Control Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Job Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Target Job Description
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company || "Independent"})
                </option>
              ))}
            </select>
          </div>

          {/* Resumes Multi-Selector */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Select Candidate Resumes ({selectedResumeIds.length}/5 selected)
              </label>
              <span className="text-[11px] text-slate-400">Select between 2 and 5 candidates</span>
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-slate-50/70 border border-slate-100 rounded-xl max-h-40 overflow-y-auto">
              {resumes.map((r) => {
                const isChecked = selectedResumeIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleResumeSelection(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isChecked
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200/90 hover:border-indigo-300"
                    }`}
                  >
                    {isChecked ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                    <span className="truncate max-w-[170px]">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {selectedResumeIds.length < 2
              ? "Select at least 2 resumes to activate comparison"
              : `Ready to compare ${selectedResumeIds.length} candidates`}
          </span>

          <button
            type="button"
            onClick={handleRunComparison}
            disabled={comparing || selectedResumeIds.length < 2 || !selectedJobId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            {comparing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Comparing Candidates...</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4" />
                <span>Compare Selected Candidates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Top Ranked Header */}
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Candidate Fit Leaderboard</h2>
          </div>

          {/* Candidate Ranked Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {comparisonResult.candidates.map((c) => {
              const isFirst = c.rank === 1;
              const isSecond = c.rank === 2;
              const isThird = c.rank === 3;

              return (
                <div
                  key={c.resume_id}
                  className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                    isFirst
                      ? "border-amber-400/90 shadow-lg shadow-amber-500/5 ring-1 ring-amber-300/50"
                      : "border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                  }`}
                >
                  {isFirst && (
                    <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 px-3 py-1 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      <span>Top Match</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isFirst
                              ? "bg-amber-100 text-amber-800"
                              : isSecond
                              ? "bg-slate-200 text-slate-800"
                              : isThird
                              ? "bg-amber-50 text-amber-900"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          #{c.rank}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 truncate max-w-[160px]">
                          {c.resume_title}
                        </h3>
                      </div>

                      <span className="text-2xl font-extrabold text-slate-900 mt-0.5">
                        {Math.round(c.overall_score)}%
                      </span>
                    </div>

                    <div className="mt-5 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Required Skills Fit</span>
                        <span className="font-bold text-slate-800">{Math.round(c.required_skills_score)}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Skill Coverage</span>
                        <span className="font-bold text-emerald-600">
                          {c.matched_skills_count} matched ({c.missing_skills_count} missing)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Work Experience</span>
                        <span className="font-bold text-slate-800">{c.experience_years} years</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Project Relevance</span>
                        <span className="font-bold text-slate-800">{Math.round(c.project_score)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      href={`/analysis/new?resumeId=${c.resume_id}&jobId=${selectedJobId}`}
                      className="w-full py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold text-center border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Full Match Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Skill Coverage Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Side-by-Side Skill Coverage Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct competency comparison showing which candidates satisfy required and preferred skills.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3.5 px-4 sticky left-0 bg-slate-50/95 backdrop-blur-xs z-10">Job Requirement</th>
                    <th className="py-3.5 px-4">Priority</th>
                    {comparisonResult.candidates.map((c) => (
                      <th key={c.resume_id} className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-900 block truncate max-w-[130px] mx-auto">
                          {c.resume_title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Rank #{c.rank} ({Math.round(c.overall_score)}%)
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {Object.keys(comparisonResult.skill_coverage_matrix).map((skillName) => {
                    const isRequired = comparisonResult.required_skills?.includes(skillName);
                    return (
                      <tr key={skillName} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 sticky left-0 bg-white">
                          {skillName}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              isRequired
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isRequired ? "Required" : "Preferred"}
                          </span>
                        </td>
                        {comparisonResult.candidates.map((c) => {
                          const isPresent = comparisonResult.skill_coverage_matrix[skillName]?.[c.resume_id];
                          return (
                            <td key={c.resume_id} className="py-3.5 px-4 text-center">
                              {isPresent ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 mx-auto">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-400 mx-auto">
                                  <XCircle className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-400 mt-2">Loading compare view...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
