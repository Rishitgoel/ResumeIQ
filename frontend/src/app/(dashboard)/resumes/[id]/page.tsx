"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  Loader2
} from "lucide-react";

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"structured" | "raw">("structured");

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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex-1 p-12 text-center text-slate-500">
        Resume not found.
      </div>
    );
  }

  const strongSkills = resume.skills.filter((s) => s.evidence_level === "STRONG");
  const modSkills = resume.skills.filter((s) => s.evidence_level === "MODERATE");
  const weakSkills = resume.skills.filter((s) => s.evidence_level === "WEAK");

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={resume.title}
        description={`Original file: ${resume.original_filename} • Parsed ${formatDate(resume.parsed_at)}`}
        actionText="Analyze Against Job"
        actionHref={`/analysis/new?resumeId=${resume.id}`}
      />

      <div className="p-8 max-w-7xl space-y-6">
        {/* Navigation & Tabs */}
        <div className="flex items-center justify-between">
          <Link href="/resumes">
            <Button variant="ghost" size="sm" className="text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Resumes
            </Button>
          </Link>

          <div className="flex items-center bg-slate-200/70 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("structured")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "structured"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Structured Profile
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "raw"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Raw Extracted Text
            </button>
          </div>
        </div>

        {activeTab === "raw" ? (
          <Card className="p-6">
            <pre className="text-xs text-slate-800 whitespace-pre-wrap font-mono leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {resume.raw_text || "No raw text available."}
            </pre>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Skills Categorized by Evidence Level */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-indigo-600" />
                      Extracted Technical Skills & Evidence Attribution
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Classified into evidence tiers based on contextual usage in work experience and projects
                    </p>
                  </div>
                  <Badge variant="purple" size="md">
                    {resume.skills.length} Total Detected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Strong Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Strong Evidence ({strongSkills.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      — Actively applied in work experience bullet points with action verbs
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {strongSkills.length > 0 ? (
                      strongSkills.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                          title={s.context_snippet ? `Context: "${s.context_snippet}"` : undefined}
                        >
                          {s.canonical_name}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">None detected with strong action verbs.</p>
                    )}
                  </div>
                </div>

                {/* Moderate Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Moderate Evidence ({modSkills.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      — Present in technical projects or secondary employment references
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {modSkills.length > 0 ? (
                      modSkills.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
                        >
                          {s.canonical_name}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">None detected in projects.</p>
                    )}
                  </div>
                </div>

                {/* Weak Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Weak Evidence ({weakSkills.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      — Listed in comma-separated skills list only without contextual details
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {weakSkills.length > 0 ? (
                      weakSkills.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          {s.canonical_name}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No unevidenced skills.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experiences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  Work Experience ({resume.experiences.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.experiences.length > 0 ? (
                  resume.experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-indigo-200 pl-4 space-y-2 relative">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-slate-900">{exp.job_title}</h4>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.start_date || "N/A"} — {exp.is_current ? "Present" : exp.end_date || "N/A"} ({exp.years_duration} yrs)
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-indigo-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {exp.company_name} {exp.location ? `• ${exp.location}` : ""}
                      </p>

                      {exp.bullet_points && exp.bullet_points.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mt-2">
                          {exp.bullet_points.map((b, idx) => (
                            <li key={idx} className="leading-relaxed">{b}</li>
                          ))}
                        </ul>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.technologies.map((t, idx) => (
                            <Badge key={idx} variant="default" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No work experience entries extracted.</p>
                )}
              </CardContent>
            </Card>

            {/* Projects & Education 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Key Projects ({resume.projects.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resume.projects.length > 0 ? (
                    resume.projects.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                          {p.url && (
                            <a
                              href={p.url.startsWith("http") ? p.url : `https://${p.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
                            >
                              Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {p.bullet_points && p.bullet_points.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                            {p.bullet_points.map((b, idx) => (
                              <li key={idx}>{b}</li>
                            ))}
                          </ul>
                        )}
                        {p.technologies && p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {p.technologies.map((t, idx) => (
                              <Badge key={idx} variant="purple" size="sm">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No project sections identified.</p>
                  )}
                </CardContent>
              </Card>

              {/* Education & Certifications */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      Education ({resume.education.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resume.education.length > 0 ? (
                      resume.education.map((e) => (
                        <div key={e.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                          <h4 className="font-bold text-slate-900 text-sm">{e.institution}</h4>
                          <p className="text-xs text-slate-700 mt-0.5">
                            {e.degree} {e.field_of_study ? `in ${e.field_of_study}` : ""}
                          </p>
                          {(e.gpa || e.start_date || e.end_date) && (
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              {e.gpa && <span>GPA: {e.gpa}/{e.max_gpa || 4.0}</span>}
                              {e.end_date && <span>Graduation: {e.end_date}</span>}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No education entries extracted.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      Certifications ({resume.certifications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {resume.certifications.length > 0 ? (
                      resume.certifications.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{c.name}</p>
                            <p className="text-[11px] text-slate-500">{c.issuer} {c.issue_date ? `• ${c.issue_date}` : ""}</p>
                          </div>
                          {c.credential_url && (
                            <a href={c.credential_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No certifications extracted.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
