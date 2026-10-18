"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { JobListItem } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Building,
  Target,
  Crosshair,
  ArrowUpRight,
  Eye,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function JobDescriptionsPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: JobListItem[]; total: number }>("/jobs/", {
        search: search || undefined,
      });
      setJobs(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || !title.trim()) {
      setFormError("Job title and description text are required.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    try {
      await api.post("/jobs/", {
        title,
        company: company || undefined,
        location: location || undefined,
        job_type: jobType,
        raw_text: rawText,
      });
      setIsModalOpen(false);
      setTitle("");
      setCompany("");
      setLocation("");
      setRawText("");
      await fetchJobs();
    } catch (err: any) {
      setFormError(err.message || "Failed to create job description.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/jobs/${id}`);
        await fetchJobs();
      } catch (err: any) {
        alert(err.message || "Failed to delete job.");
      }
    }
  };

  // Filter jobs by type if selected
  const filteredJobs = jobs.filter((j) => {
    if (typeFilter === "ALL") return true;
    return j.job_type === typeFilter;
  });

  const totalCriteria = jobs.reduce((acc, curr) => acc + (curr.requirements_count || 0), 0);
  const remoteCount = jobs.filter(
    (j) => j.job_type === "REMOTE" || j.location?.toLowerCase().includes("remote")
  ).length;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <span>Job Descriptions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target job postings with automatically extracted requirements, skills, and qualifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job Description</span>
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Target Roles</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{total}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Job Descriptions Stored</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100/70 flex items-center justify-center text-purple-600 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Parsed Criteria</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalCriteria}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Extracted Requirements</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Remote / Flexible</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{remoteCount}</h3>
            <p className="text-[11px] font-medium text-emerald-600 font-semibold mt-1">Distributed Roles</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Companies</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {new Set(jobs.map((j) => j.company).filter(Boolean)).size || total}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Unique Organizations</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "FULL_TIME", "REMOTE", "CONTRACT"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                typeFilter === type
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50"
              }`}
            >
              {type === "ALL" ? "All Types" : type.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-400">Loading job descriptions...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No job descriptions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {search
              ? "No jobs match your filter criteria. Try adjusting your search term."
              : "Add your first job description to extract skills and evaluate candidate resumes against requirements."}
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Description</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100/70 text-sky-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {job.job_type.replace("_", " ")}
                  </span>
                </div>

                <Link
                  href={`/job-descriptions/${job.id}`}
                  className="text-base font-bold text-slate-900 mt-3.5 hover:text-indigo-600 transition-colors truncate block group-hover:text-indigo-600"
                >
                  {job.title}
                </Link>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.company || "Independent"}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2.5">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {job.min_experience_years > 0
                        ? `${job.min_experience_years}+ yrs exp`
                        : "Any experience"}
                    </span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    {job.requirements_count} Extracted Criteria
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
                    {formatDate(job.created_at)}
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/job-descriptions/${job.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/analysis/new?jobId=${job.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Match</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(job.id, job.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Job Description"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe, OpenAI, Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Employment Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description Text *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Paste responsibilities, required qualifications, nice-to-haves, tech stack, and experience requirements..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ResumeIQ will automatically parse required vs preferred skills, years of experience, and degrees.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title || !rawText}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{submitting ? "Extracting Criteria..." : "Save & Extract Criteria"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
