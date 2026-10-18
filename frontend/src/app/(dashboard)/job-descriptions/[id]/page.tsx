"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { JobDetail } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  Clock,
  GraduationCap,
  Target,
  Sparkles,
  Crosshair,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  FileText,
  Star,
  Layers,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"requirements" | "raw">("requirements");
  const [copiedRaw, setCopiedRaw] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await api.get<JobDetail>(`/jobs/${jobId}`);
        setJob(data);
      } catch (err) {
        console.error("Failed to load job description:", err);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) loadJob();
  }, [jobId]);

  const copyToClipboard = () => {
    if (job?.raw_text) {
      navigator.clipboard.writeText(job.raw_text);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 p-12 text-center text-slate-500">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-100 shadow-xs">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Job description not found</h3>
          <p className="text-xs text-slate-400 mb-6">The job may have been removed or the link is invalid.</p>
          <Link
            href="/job-descriptions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Job Descriptions</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/job-descriptions" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Job Descriptions</span>
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-xs">{job.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {job.job_type.replace("_", " ")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
              {job.company && (
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.company}</span>
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {job.min_experience_years > 0 ? `${job.min_experience_years}+ yrs exp` : "Any experience"}
                </span>
              </span>
              <span>• Added {formatDate(job.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setActiveTab("requirements")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "requirements"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Parsed Criteria
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "raw"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Full Description
            </button>
          </div>

          <Link
            href={`/analysis/new?jobId=${job.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
            <span>Match Candidates</span>
          </Link>
        </div>
      </div>

      {activeTab === "raw" ? (
        /* Full Description View */
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Full Job Posting Text</h2>
              <p className="text-xs text-slate-400 mt-0.5">Original raw job description provided.</p>
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRaw ? "Copied!" : "Copy Text"}</span>
            </button>
          </div>
          <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200/80 max-h-[600px] overflow-y-auto">
            {job.raw_text}
          </pre>
        </div>
      ) : (
        /* Parsed Requirements View */
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Required Skills</p>
                <h4 className="text-xl font-bold text-slate-900">
                  {job.required_skills?.length || 0}
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Preferred Skills</p>
                <h4 className="text-xl font-bold text-slate-900">
                  {job.preferred_skills?.length || 0}
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Min Experience</p>
                <h4 className="text-xl font-bold text-slate-900">
                  {job.min_experience_years > 0 ? `${job.min_experience_years} yrs` : "0 yrs"}
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Target Degree</p>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {job.target_degree || "Bachelor's / Open"}
                </h4>
              </div>
            </div>
          </div>

          {/* Skills Breakdown: Required vs Preferred */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Required Skills Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Required Skills (Mandatory)</h2>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {job.required_skills?.length || 0} Skills
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prerequisite competencies heavily weighted in the candidate match algorithm (40% default weight).
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {job.required_skills && job.required_skills.length > 0 ? (
                  job.required_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific required skills isolated.</p>
                )}
              </div>
            </div>

            {/* Preferred / Bonus Skills Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Preferred / Bonus Skills</h2>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                  {job.preferred_skills?.length || 0} Skills
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bonus competencies that elevate candidates from good to top-tier (20% default weight).
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {job.preferred_skills && job.preferred_skills.length > 0 ? (
                  job.preferred_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No bonus skills detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Criteria List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Extracted Requirements & Evaluation Criteria</span>
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {job.requirements?.length || 0} Total Criteria
              </span>
            </div>

            <div className="space-y-3">
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.map((req, idx) => (
                  <div
                    key={req.id || idx}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700">
                          {req.requirement_type.replace("_", " ")}
                        </span>
                        {req.skill_name && (
                          <span className="font-bold text-xs text-indigo-600">
                            {req.skill_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{req.description}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 text-right">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Weight: {Math.round(req.weight * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No detailed criteria records available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
