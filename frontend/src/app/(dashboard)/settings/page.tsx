"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth";
import { User, Shield, Cpu, Database, Server, HardDrive } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="System Settings & Architecture"
        description="Configuration defaults, security credentials, and technical infrastructure details."
      />

      <div className="p-8 max-w-5xl space-y-8">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5 text-indigo-600" />
              User Profile & Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block">Full Name</span>
                <span className="font-semibold text-slate-900">{user?.full_name || "User"}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block">Email Address</span>
                <span className="font-semibold text-slate-900">{user?.email || "user@example.com"}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block">User ID (UUID)</span>
                <span className="font-mono text-xs text-slate-700">{user?.id || "N/A"}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block">Security Status</span>
                <Badge variant="success" size="sm" className="mt-1">
                  Active & Authenticated (JWT)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Scoring Weights Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configured Default Scoring Weights</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Default linear combination weights applied when custom weights are not overridden
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Required Skills</span>
                <span className="text-lg font-bold text-indigo-600">40%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Preferred Skills</span>
                <span className="text-lg font-bold text-indigo-600">20%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Experience Duration</span>
                <span className="text-lg font-bold text-indigo-600">15%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Projects Tech Stack</span>
                <span className="text-lg font-bold text-indigo-600">10%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Education Alignment</span>
                <span className="text-lg font-bold text-indigo-600">10%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Certifications & Other</span>
                <span className="text-lg font-bold text-indigo-600">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Architecture & Technology Justifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Server className="w-4 h-4 text-indigo-600" />
                  FastAPI Backend Gateway
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Asynchronous ASGI runtime, Pydantic V2 type enforcement, auto OpenAPI documentation, and high-concurrency request routing.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Database className="w-4 h-4 text-sky-600" />
                  Normalized PostgreSQL 16
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Strict foreign key constraints, transactional ACID guarantees, relational JOINs across resumes/analyses, and JSONB flexibility.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  Redis 7 Broker & Cache
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Transient analysis score caching, sliding-window rate limiting, and Celery background task coordination.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  Deterministic + Statistical NLP
                </div>
                <p className="text-slate-600 leading-relaxed">
                  500+ canonical skill taxonomy, word-boundary protection, TF-IDF semantic proximity, and contextual evidence scoring.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
