"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ResumeDetail } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Code2,
  ExternalLink,
  Calendar,
  Building2,
  FileCode,
  Loader2,
  FileText,
  Crosshair,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"structured" | "raw">("structured");
  const [copiedRaw, setCopiedRaw] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        const data = await api.get<ResumeDetail>(`/resumes/${resumeId}`);
        setResume(data);
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }
    if (resumeId) loadResume();
  }, [resumeId]);

  const copyToClipboard = () => {
    if (resume?.raw_text) {
      navigator.clipboard.writeText(resume.raw_text);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Extracting profile details...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex-1 p-12 text-center text-slate-500">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-100 shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Resume not found</h3>
          <p className="text-xs text-slate-400 mb-6">The resume may have been deleted or the link is invalid.</p>
          <Link
            href="/resumes"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Resumes</span>
          </Link>
        </div>
      </div>
    );
  }

  const strongSkills = resume.skills.filter((s) => s.evidence_level === "STRONG");
  const modSkills = resume.skills.filter((s) => s.evidence_level === "MODERATE");
  const weakSkills = resume.skills.filter((s) => s.evidence_level === "WEAK");

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/resumes" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Resumes</span>
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-xs">{resume.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">{resume.title}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" />
                <span>Parsed</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              File: <span className="text-slate-600 font-medium">{resume.original_filename}</span> • Size: {Math.round(resume.file_size_bytes / 1024)} KB • Added {formatDate(resume.parsed_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setActiveTab("structured")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "structured"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Structured
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "raw"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Raw Text
            </button>
          </div>

          <Link
            href={`/analysis/new?resumeId=${resume.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
            <span>Analyze Against Job</span>
          </Link>
        </div>
      </div>

      {activeTab === "raw" ? (
        /* Raw Extracted Text View */
        <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Raw Extracted Resume Text</h2>
              <p className="text-xs text-slate-400 mt-0.5">Exact output parsed directly from the PDF document.</p>
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
          <pre className="text-xs text-slate-800 whitespace-pre-wrap font-mono leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200/80 max-h-[600px] overflow-y-auto">
            {resume.raw_text || "No raw text extracted from PDF."}
          </pre>
        </div>
      ) : (
        /* Structured Profile View */
        <div className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Total Skills</p>
                <h4 className="text-xl font-bold text-slate-900">{resume.skills.length}</h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Positions</p>
                <h4 className="text-xl font-bold text-slate-900">{resume.experiences.length}</h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Projects</p>
                <h4 className="text-xl font-bold text-slate-900">{resume.projects.length}</h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Education</p>
                <h4 className="text-xl font-bold text-slate-900">{resume.education.length}</h4>
              </div>
            </div>
          </div>

          {/* Categorized Skills Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-600" />
                  <span>Extracted Technical Competencies & Evidence Attribution</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Classified into evidence tiers based on contextual usage in work experience and technical projects.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                {resume.skills.length} Total Skills
              </span>
            </div>

            <div className="space-y-5">
              {/* Strong Evidence */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Strong Evidence ({strongSkills.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    — Actively proven in work experience bullet points with action verbs
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strongSkills.length > 0 ? (
                    strongSkills.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs"
                        title={s.context_snippet ? `Context: "${s.context_snippet}"` : undefined}
                      >
                        {s.canonical_name}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">None detected with strong action verbs.</p>
                  )}
                </div>
              </div>

              {/* Moderate Evidence */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Moderate Evidence ({modSkills.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    — Referenced in technical projects or secondary employment positions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {modSkills.length > 0 ? (
                    modSkills.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-2xs"
                      >
                        {s.canonical_name}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">None detected in project contexts.</p>
                  )}
                </div>
              </div>

              {/* Weak Evidence */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Weak Evidence ({weakSkills.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    — Listed in comma-separated skills section without detailed context
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {weakSkills.length > 0 ? (
                    weakSkills.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs"
                      >
                        {s.canonical_name}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No unevidenced skills.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Work Experience Timeline</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {resume.experiences.length} {resume.experiences.length === 1 ? "Role" : "Roles"}
              </span>
            </div>

            <div className="space-y-6">
              {resume.experiences.length > 0 ? (
                resume.experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-indigo-200 pl-5 space-y-2 relative">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900">{exp.job_title}</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {exp.start_date || "N/A"} — {exp.is_current ? "Present" : exp.end_date || "N/A"} ({exp.years_duration} yrs)
                        </span>
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-indigo-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{exp.company_name}</span>
                      {exp.location && <span className="text-slate-400 font-normal">• {exp.location}</span>}
                    </p>

                    {exp.bullet_points && exp.bullet_points.length > 0 && (
                      <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1.5 mt-2">
                        {exp.bullet_points.map((b, idx) => (
                          <li key={idx} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No work experience entries extracted from this resume.</p>
              )}
            </div>
          </div>

          {/* Projects & Education 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Projects */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>Key Technical Projects</span>
                </h2>
                <span className="text-xs font-semibold text-slate-400">{resume.projects.length} Projects</span>
              </div>

              <div className="space-y-4">
                {resume.projects.length > 0 ? (
                  resume.projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                        {p.url && (
                          <a
                            href={p.url.startsWith("http") ? p.url : `https://${p.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                          >
                            <span>Live Project</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {p.bullet_points && p.bullet_points.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          {p.bullet_points.map((b, idx) => (
                            <li key={idx} className="leading-relaxed">{b}</li>
                          ))}
                        </ul>
                      )}
                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No project sections identified.</p>
                )}
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="space-y-6">
              {/* Education */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Education Credentials</span>
                  </h2>
                  <span className="text-xs font-semibold text-slate-400">{resume.education.length} Entries</span>
                </div>

                <div className="space-y-3">
                  {resume.education.length > 0 ? (
                    resume.education.map((e) => (
                      <div key={e.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm">{e.institution}</h4>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">
                          {e.degree} {e.field_of_study ? `in ${e.field_of_study}` : ""}
                        </p>
                        {(e.gpa || e.start_date || e.end_date) && (
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                            {e.gpa && <span className="font-semibold text-slate-700">GPA: {e.gpa}/{e.max_gpa || 4.0}</span>}
                            {e.end_date && <span>Graduated {e.end_date}</span>}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No education entries extracted.</p>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>Certifications & Honors</span>
                  </h2>
                  <span className="text-xs font-semibold text-slate-400">{resume.certifications.length}</span>
                </div>

                <div className="space-y-2">
                  {resume.certifications.length > 0 ? (
                    resume.certifications.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-500">{c.issuer} {c.issue_date ? `• ${c.issue_date}` : ""}</p>
                        </div>
                        {c.credential_url && (
                          <a
                            href={c.credential_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 p-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No certifications extracted.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
