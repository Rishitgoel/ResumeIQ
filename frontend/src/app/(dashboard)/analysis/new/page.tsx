"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ResumeListItem, JobListItem, AnalysisDetail } from "@/types";
import {
  Crosshair,
  Sliders,
  FileText,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

export default function NewAnalysisPage() {
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Run Match Analysis"
        description="Select a candidate resume and target job description to calculate transparent match metrics."
      />

      <div className="p-8 max-w-4xl space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-5 h-5 text-indigo-600" />
                1. Select Candidate Resume
              </CardTitle>
              <CardDescription>
                Choose from your stored parsed resumes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumes.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {resumes.map((r) => {
                    const isSelected = selectedResumeId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedResumeId(r.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/60 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900 truncate">{r.title}</p>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {r.skills_count} skills extracted • {r.experience_count} positions
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No resumes uploaded yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="w-5 h-5 text-sky-600" />
                2. Select Target Job Description
              </CardTitle>
              <CardDescription>
                Choose target role to evaluate criteria against
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobs.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {jobs.map((j) => {
                    const isSelected = selectedJobId === j.id;
                    return (
                      <div
                        key={j.id}
                        onClick={() => setSelectedJobId(j.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-sky-600 bg-sky-50/60 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900 truncate">{j.title}</p>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {j.company || "Company"} • {j.requirements_count} criteria
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No job descriptions available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configurable Weights Accordion */}
        <Card>
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Custom Scoring Weight Distribution</h4>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowWeights(!showWeights)}
              className="text-xs text-indigo-600"
            >
              {showWeights ? "Use Defaults (40/20/15/10/10/5)" : "Customize Weights"}
            </Button>
          </div>

          {showWeights && (
            <CardContent className="space-y-5 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Required Skills Weight</span>
                    <span className="text-indigo-600">{wReq}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={wReq}
                    onChange={(e) => setWReq(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Preferred Skills Weight</span>
                    <span className="text-indigo-600">{wPref}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={wPref}
                    onChange={(e) => setWPref(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Experience Duration & Relevance</span>
                    <span className="text-indigo-600">{wExp}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={wExp}
                    onChange={(e) => setWExp(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Project Tech Stack Alignment</span>
                    <span className="text-indigo-600">{wProj}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={wProj}
                    onChange={(e) => setWProj(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Education Level</span>
                    <span className="text-indigo-600">{wEdu}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={wEdu}
                    onChange={(e) => setWEdu(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Certifications & Extras</span>
                    <span className="text-indigo-600">{wOther}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={wOther}
                    onChange={(e) => setWOther(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Total weight: {totalWeight}%. The engine automatically normalizes the sum to 100%.
              </p>
            </CardContent>
          )}
        </Card>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            variant="primary"
            isLoading={analyzing}
            onClick={handleRunAnalysis}
            disabled={!selectedResumeId || !selectedJobId}
            className="px-8 py-3 text-base shadow-lg shadow-indigo-600/20"
          >
            Run Matching Engine
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
