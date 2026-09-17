"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function Header({ title, description, actionText, actionHref, onActionClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actionText && (
          actionHref ? (
            <Link href={actionHref}>
              <Button size="md" className="shadow-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button size="md" onClick={onActionClick} className="shadow-sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              {actionText}
            </Button>
          )
        )}
      </div>
    </header>
  );
}
