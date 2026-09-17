"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  Loader2
} from "lucide-react";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.name.toLowerCase().endsWith(".pdf")) {
        setUploadError("Only PDF resumes are supported.");
        return;
      }
      setSelectedFile(f);
      if (!title) {
        setTitle(f.name.replace(".pdf", ""));
      }
      setUploadError(null);
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await api.delete(`/resumes/${id}`);
        await fetchResumes();
      } catch (err: any) {
        alert(err.message || "Failed to delete resume.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Resume Repository"
        description="Store, parse, and manage candidate PDF resumes."
        actionText="Upload PDF"
        onActionClick={() => setIsUploadModalOpen(true)}
      />

      <div className="p-8 max-w-7xl space-y-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes by title or filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {total} {total === 1 ? "Resume" : "Resumes"} Stored
          </span>
        </div>

        {/* Resumes List Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Candidate / Title</th>
                  <th className="px-6 py-3.5">File Details</th>
                  <th className="px-6 py-3.5">Extracted Skills</th>
                  <th className="px-6 py-3.5">Experience</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date Added</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                    </td>
                  </tr>
                ) : resumes.length > 0 ? (
                  resumes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/resumes/${r.id}`}
                          className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline block"
                        >
                          {r.title}
                        </Link>
                        <span className="text-xs text-slate-400">{r.original_filename}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {Math.round(r.file_size_bytes / 1024)} KB
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="purple" size="sm">
                          {r.skills_count} Skills
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default" size="sm">
                          {r.experience_count} Positions
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {r.status === "COMPLETED" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Parsed
                          </span>
                        )}
                        {r.status === "PROCESSING" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                          </span>
                        )}
                        {r.status === "FAILED" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200" title={r.error_message}>
                            <AlertCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{formatDate(r.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link href={`/resumes/${r.id}`}>
                          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No resumes found. Click &quot;Upload PDF&quot; to add your first candidate resume.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Resume PDF"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          {uploadError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Candidate / Resume Title
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Rivera - Staff Software Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              PDF Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-400 transition-colors bg-slate-50/50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-10 w-10 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                    <span>Select a file</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1 text-slate-500">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-400">PDF up to 10MB</p>
                {selectedFile && (
                  <p className="text-xs font-semibold text-indigo-700 mt-2 bg-indigo-50 py-1 px-2 rounded-md">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={uploading}
              disabled={!selectedFile}
            >
              Upload & Parse
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
