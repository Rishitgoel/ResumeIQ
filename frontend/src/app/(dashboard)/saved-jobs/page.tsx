"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Briefcase,
  MapPin,
  Building,
  ArrowUpRight,
  Plus,
  ExternalLink,
  Trash2,
  Search,
  CheckCircle2,
  Bookmark,
  Sparkles,
} from "lucide-react";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  tags: string[];
  matchScore: number;
}

const INITIAL_SAVED_JOBS: SavedJob[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA (Hybrid)",
    salary: "$165,000 - $195,000",
    posted: "2 days ago",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    matchScore: 92,
  },
  {
    id: "job-2",
    title: "Staff Software Engineer - AI Systems",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$210,000 - $260,000",
    posted: "4 days ago",
    tags: ["Python", "PyTorch", "Distributed Systems", "Kubernetes"],
    matchScore: 84,
  },
  {
    id: "job-3",
    title: "Cloud Infrastructure Architect",
    company: "Amazon Web Services",
    location: "Seattle, WA (Remote)",
    salary: "$175,000 - $215,000",
    posted: "1 week ago",
    tags: ["AWS", "Terraform", "Docker", "DevOps"],
    matchScore: 78,
  },
  {
    id: "job-4",
    title: "Backend Engineer - Payments Infrastructure",
    company: "Adyen",
    location: "New York, NY (Hybrid)",
    salary: "$155,000 - $185,000",
    posted: "3 days ago",
    tags: ["Java", "Distributed Systems", "PostgreSQL", "Kafka"],
    matchScore: 88,
  },
  {
    id: "job-5",
    title: "Data Platform Engineer",
    company: "Databricks",
    location: "San Francisco, CA (Remote)",
    salary: "$180,000 - $220,000",
    posted: "5 days ago",
    tags: ["Spark", "Python", "Delta Lake", "Scala"],
    matchScore: 75,
  },
];

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(INITIAL_SAVED_JOBS);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const allTags = Array.from(new Set(savedJobs.flatMap((j) => j.tags)));

  const filteredJobs = savedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? job.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <span>Saved Jobs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track, bookmark, and evaluate target job opportunities across your target companies.
          </p>
        </div>

        <Link
          href="/job-descriptions"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {/* 3 Metric Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100/70 flex items-center justify-center text-amber-500 shrink-0">
            <Bookmark className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Bookmarked Roles</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{savedJobs.length}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Active saved positions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Average Match Fit</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {savedJobs.length > 0
                ? Math.round(savedJobs.reduce((acc, j) => acc + j.matchScore, 0) / savedJobs.length)
                : 0}
              %
            </h3>
            <p className="text-[11px] font-medium text-emerald-600 font-semibold mt-1">Strong profile alignment</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Unique Companies</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {new Set(savedJobs.map((j) => j.company)).size}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Tier-1 & startup employers</p>
          </div>
        </div>
      </div>

      {/* Search & Tag Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved jobs by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === null
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Skills
          </button>
          {allTags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Saved Jobs */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 fill-amber-400/20" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No saved jobs found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {search || selectedTag
              ? "No jobs match your filter. Try adjusting your query or selected tag."
              : "You haven't bookmarked any jobs yet. Browse Job Descriptions to bookmark roles."}
          </p>
          <Link
            href="/job-descriptions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Job Descriptions</span>
          </Link>
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
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-bold text-xs bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      {job.matchScore}% Match
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(job.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3.5 leading-snug group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.company}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{job.salary}</span>
                <Link
                  href="/analysis/new"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>Match Candidate</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
