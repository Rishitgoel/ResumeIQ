"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ResumeListItem, JobListItem, AnalysisDetail } from "@/types";
import {
  Crosshair,
  Sliders,
  FileText,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Plus,
  Sparkles,
  HelpCircle,
  Building,
  Target,
  ChevronDown,
  Layers,
} from "lucide-react";

function NewAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedResume = searchParams.get("resumeId") || "";
  const preselectedJob = searchParams.get("jobId") || "";

  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedResume);
  const [selectedJobId, setSelectedJobId] = useState(preselectedJob);

  // Configurable Weights
  const [showWeights, setShowWeights] = useState(false);
  const [wReq, setWReq] = useState(40);
  const [wPref, setWPref] = useState(20);
  const [wExp, setWExp] = useState(15);
  const [wProj, setWProj] = useState(10);
  const [wEdu, setWEdu] = useState(10);
  const [wOther, setWOther] = useState(5);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [resData, jobData] = await Promise.all([
          api.get<{ items: ResumeListItem[] }>("/resumes/"),
          api.get<{ items: JobListItem[] }>("/jobs/"),
        ]);
        setResumes(resData.items || []);
        setJobs(jobData.items || []);
        if (!selectedResumeId && resData.items?.length > 0) {
          setSelectedResumeId(resData.items[0].id);
        }
        if (!selectedJobId && jobData.items?.length > 0) {
          setSelectedJobId(jobData.items[0].id);
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalWeight = wReq + wPref + wExp + wProj + wEdu + wOther;

  const handleRunAnalysis = async () => {
    if (!selectedResumeId || !selectedJobId) {
      setError("Please select both a resume and a job description.");
      return;
    }
    setError(null);
    setAnalyzing(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        resume_id: selectedResumeId,
        job_description_id: selectedJobId,
      };

      if (showWeights) {
        payload.custom_weights = {
          required_skills: wReq / 100,
          preferred_skills: wPref / 100,
          experience: wExp / 100,
          projects: wProj / 100,
          education: wEdu / 100,
          other: wOther / 100,
        };
      }

      const res = await api.post<AnalysisDetail>("/analyses/", payload);
      router.push(`/analysis/${res.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to execute analysis.");
      setAnalyzing(false);
    }
  };

  const activeResume = resumes.find((r) => r.id === selectedResumeId);
  const activeJob = jobs.find((j) => j.id === selectedJobId);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Loading candidate and job repositories...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Crosshair className="w-5 h-5" />
            </div>
            <span>Run Match Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pair a candidate resume with a target job description to compute an explainable, transparent fit score.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Two-Column Selector with Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= COLUMN 1: RESUME SELECTOR ================= */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">1. Candidate Resume</h2>
                  <p className="text-[11px] text-slate-400">Select candidate to evaluate</p>
                </div>
              </div>
              <Link
                href="/resumes"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </Link>
            </div>

            {/* Resume Selection List */}
            {resumes.length > 0 ? (
              <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
                {resumes.map((r) => {
                  const isSelected = selectedResumeId === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedResumeId(r.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 shadow-xs"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-slate-900 truncate">{r.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {r.original_filename} • {r.skills_count} skills • {r.experience_count} positions
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400">No resumes available in repository.</p>
                <Link
                  href="/resumes"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Resume PDF</span>
                </Link>
              </div>
            )}
          </div>

          {/* Active Selection Summary Card */}
          {activeResume && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Selected: {activeResume.title}</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Ready
              </span>
            </div>
          )}
        </div>

        {/* ================= COLUMN 2: JOB SELECTOR ================= */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">2. Target Job Description</h2>
                  <p className="text-[11px] text-slate-400">Select role to match against</p>
                </div>
              </div>
              <Link
                href="/job-descriptions"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Job</span>
              </Link>
            </div>

            {/* Job Selection List */}
            {jobs.length > 0 ? (
              <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
                {jobs.map((j) => {
                  const isSelected = selectedJobId === j.id;
                  return (
                    <div
                      key={j.id}
                      onClick={() => setSelectedJobId(j.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/70 shadow-xs"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-slate-900 truncate">{j.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {j.company || "Company"} • {j.job_type.replace("_", " ")} • {j.requirements_count} criteria
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400">No job descriptions saved.</p>
                <Link
                  href="/job-descriptions"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 font-semibold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Job Description</span>
                </Link>
              </div>
            )}
          </div>

          {/* Active Job Summary Card */}
          {activeJob && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Target: {activeJob.title}</span>
              <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                {activeJob.company || "Independent"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Configurable Weights Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Scoring Weight Distribution</h3>
              <p className="text-[11px] text-slate-400">
                Customize how heavily each factor impacts the overall 0–100% fit calculation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowWeights(!showWeights)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {showWeights ? "Hide Custom Sliders" : "Customize Weights (Advanced)"}
          </button>
        </div>

        {showWeights && (
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Required Skills</span>
                  <span className="text-indigo-600 font-bold">{wReq}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wReq}
                  onChange={(e) => setWReq(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Preferred / Bonus Skills</span>
                  <span className="text-indigo-600 font-bold">{wPref}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wPref}
                  onChange={(e) => setWPref(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Work Experience Duration</span>
                  <span className="text-indigo-600 font-bold">{wExp}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wExp}
                  onChange={(e) => setWExp(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Project Relevance</span>
                  <span className="text-indigo-600 font-bold">{wProj}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wProj}
                  onChange={(e) => setWProj(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Education Level</span>
                  <span className="text-indigo-600 font-bold">{wEdu}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wEdu}
                  onChange={(e) => setWEdu(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Certifications & Other</span>
                  <span className="text-indigo-600 font-bold">{wOther}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wOther}
                  onChange={(e) => setWOther(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>
                Total configured weight: <strong className="text-slate-700">{totalWeight}%</strong>
              </span>
              <span>The matching algorithm automatically normalizes all weights to 100%.</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={analyzing || !selectedResumeId || !selectedJobId}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all cursor-pointer hover:scale-[1.02]"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing Semantic NLP Engine...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>✦ Run Match Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function NewAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-400 mt-2">Loading match setup...</p>
        </div>
      }
    >
      <NewAnalysisContent />
    </Suspense>
  );
}
