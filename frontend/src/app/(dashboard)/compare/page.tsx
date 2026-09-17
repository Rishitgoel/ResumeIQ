"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ResumeListItem, JobListItem, CompareResponse } from "@/types";
import { getScoreColor } from "@/lib/utils";
import {
  GitCompare,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

export default function ComparePage() {
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
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Candidate Multi-Resume Comparison"
        description="Compare 2 to 5 resumes side-by-side against a single job description to evaluate skill coverage and fit."
      />

      <div className="p-8 max-w-7xl space-y-8">
        {/* Selection Configuration Card */}
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Job Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Target Job Description
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company || "Independent"})
                  </option>
                ))}
              </select>
            </div>

            {/* Resume Selection Chips */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Select Resumes to Compare ({selectedResumeIds.length}/5 selected)
                </label>
                <span className="text-[11px] text-slate-500">Pick between 2 and 5 candidates</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
                {resumes.map((r) => {
                  const isChecked = selectedResumeIds.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleResumeSelection(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      <span className="truncate max-w-[180px]">{r.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              isLoading={comparing}
              onClick={handleRunComparison}
              disabled={selectedResumeIds.length < 2 || !selectedJobId}
            >
              Compare Candidates
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>

        {/* Comparison Results */}
        {comparisonResult && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Candidate Rankings Cards */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Candidate Compatibility Rankings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonResult.candidates.map((c) => {
                  const colors = getScoreColor(c.overall_score);
                  return (
                    <Card
                      key={c.resume_id}
                      className={`relative overflow-hidden border-2 ${
                        c.rank === 1 ? "border-amber-400 shadow-md" : "border-slate-200"
                      }`}
                    >
                      {c.rank === 1 && (
                        <div className="bg-amber-400 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase py-1 text-center flex items-center justify-center gap-1">
                          <Trophy className="w-3 h-3" /> Top Ranked Candidate
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Rank #{c.rank}
                            </span>
                            <CardTitle className="text-base truncate max-w-[200px]">
                              {c.resume_title}
                            </CardTitle>
                          </div>
                          <span className={`text-2xl font-extrabold ${colors.text}`}>
                            {c.overall_score}%
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Required Skills</span>
                          <span className="font-bold text-slate-900">{c.required_skills_score}%</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Skill Coverage</span>
                          <span className="font-bold text-emerald-600">
                            {c.matched_skills_count} matched ({c.missing_skills_count} missing)
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Experience</span>
                          <span className="font-bold text-slate-900">{c.experience_years} years</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Projects Relevance</span>
                          <span className="font-bold text-slate-900">{c.project_score}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Skill Coverage Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Coverage Matrix</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side skill verification across all evaluated candidate resumes
                </p>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5 sticky left-0 bg-slate-50 z-10">Job Requirement</th>
                      <th className="px-6 py-3.5">Priority</th>
                      {comparisonResult.candidates.map((c) => (
                        <th key={c.resume_id} className="px-6 py-3.5 text-center">
                          <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                            {c.resume_title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Rank #{c.rank} ({c.overall_score}%)
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {Object.keys(comparisonResult.skill_coverage_matrix).map((skillName) => {
                      const isRequired = comparisonResult.required_skills.includes(skillName);
                      return (
                        <tr key={skillName} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-slate-900 sticky left-0 bg-white">
                            {skillName}
                          </td>
                          <td className="px-6 py-3.5">
                            <Badge variant={isRequired ? "danger" : "default"} size="sm">
                              {isRequired ? "Required" : "Preferred"}
                            </Badge>
                          </td>
                          {comparisonResult.candidates.map((c) => {
                            const isPresent = comparisonResult.skill_coverage_matrix[skillName]?.[c.resume_id];
                            return (
                              <td key={c.resume_id} className="px-6 py-3.5 text-center">
                                {isPresent ? (
                                  <span className="inline-flex items-center text-emerald-600 font-bold">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-rose-400">
                                    <XCircle className="w-4 h-4" />
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
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
