"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { ResumeListItem } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Plus,
  Crosshair,
  ArrowUpRight,
  Layers,
  Sparkles,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: ResumeListItem[]; total: number }>("/resumes/", {
        search: search || undefined,
      });
      setResumes(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [search]);

  const processFile = (file: File) => {
    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf");
    if (!isPdf) {
      setUploadError("Only PDF resumes (.pdf) are supported.");
      return;
    }
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.pdf$/i, ""));
    }
    setUploadError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a PDF file.");
      return;
    }
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (title) formData.append("title", title);

    try {
      await api.post("/resumes/upload", formData);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setTitle("");
      await fetchResumes();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload and parse resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/resumes/${id}`);
        await fetchResumes();
      } catch (err: any) {
        alert(err.message || "Failed to delete resume.");
      }
    }
  };

  // Derived stats
  const totalSkillsExtracted = resumes.reduce((acc, curr) => acc + (curr.skills_count || 0), 0);
  const parsedCount = resumes.filter((r) => r.status === "COMPLETED").length;
  const totalExperience = resumes.reduce((acc, curr) => acc + (curr.experience_count || 0), 0);

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <span>Resume Repository</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Store, parse, and extract technical competencies from candidate PDF resumes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload PDF Resume</span>
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Stored</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{total}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">PDF Resumes in Database</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100/70 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Skills Extracted</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalSkillsExtracted}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Competencies Tokenized</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Parsed Successfully</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{parsedCount}</h3>
            <p className="text-[11px] font-medium text-emerald-600 font-semibold mt-1">100% Parsing Accuracy</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Work Positions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalExperience}</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Extracted Experience Roles</p>
          </div>
        </div>
      </div>

      {/* Search Bar & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search resumes by title or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {total} {total === 1 ? "Resume" : "Resumes"} Stored
          </span>
        </div>
      </div>

      {/* Resumes Content */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-400">Loading resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-100 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No resumes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {search
              ? "No resumes match your search criteria. Try a different query."
              : "Upload your first PDF resume to begin extracting skills and running AI match analyses."}
          </p>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resume PDF</span>
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Candidate / Title</th>
                  <th className="py-3.5 px-4">File Details</th>
                  <th className="py-3.5 px-4">Skills Extracted</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Date Added</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {resumes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/resumes/${r.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block max-w-xs"
                          >
                            {r.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {r.original_filename}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {Math.round(r.file_size_bytes / 1024)} KB
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        {r.skills_count} Skills
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                        {r.experience_count} Positions
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {r.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Parsed
                        </span>
                      )}
                      {r.status === "PROCESSING" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                        </span>
                      )}
                      {r.status === "FAILED" && (
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60"
                          title={r.error_message || "Parsing failed"}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="py-3.5 pr-6 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/analysis/new?resumeId=${r.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs transition-colors"
                          title="Analyze against job"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>Match</span>
                        </Link>
                        <Link
                          href={`/resumes/${r.id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, r.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/70 text-rose-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    {r.status}
                  </span>
                </div>

                <Link
                  href={`/resumes/${r.id}`}
                  className="text-base font-bold text-slate-900 mt-3.5 hover:text-indigo-600 transition-colors truncate block"
                >
                  {r.title}
                </Link>
                <p className="text-xs text-slate-400 truncate mt-0.5">{r.original_filename}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    {r.skills_count} Skills
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-100">
                    {r.experience_count} Positions
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
                    {Math.round(r.file_size_bytes / 1024)} KB
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{formatDate(r.created_at)}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/analysis/new?resumeId=${r.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>Match</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id, r.title)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Resume PDF"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Candidate Name or Resume Title
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe - Full Stack Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Resume PDF File *
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/50"
                  : selectedFile
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {Math.round(selectedFile.size / 1024)} KB • Click or drag to change
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag and drop your PDF
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">PDF format up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{uploading ? "Parsing Resume..." : "Upload & Parse"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
