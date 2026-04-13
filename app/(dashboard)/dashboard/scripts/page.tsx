"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ScrollText, Search, PenLine, Eye, Copy, Trash2,
  Download, Clock, Filter, SortAsc, MoreHorizontal, FileText
} from "lucide-react";

interface Script {
  id: string;
  title: string;
  niche: string;
  format: string;
  words: number;
  duration: number;
  createdAt: string;
  status: "draft" | "final" | "published";
}

const mockScripts: Script[] = [];

export default function ScriptsPage() {
  const [scripts] = useState<Script[]>(mockScripts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = scripts.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.niche.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColors: Record<string, "cyan" | "green" | "neutral"> = {
    draft: "neutral",
    final: "cyan",
    published: "green",
  };

  return (
    <div className="min-h-screen">
      <Topbar title="My Scripts" action={{ label: "Write New Script" }} />

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Scripts", value: scripts.length.toString(), color: "text-cyan-400" },
            { label: "Published", value: scripts.filter(s => s.status === "published").length.toString(), color: "text-emerald-400" },
            { label: "In Draft", value: scripts.filter(s => s.status === "draft").length.toString(), color: "text-yellow-400" },
            { label: "Scripts Left", value: "4", color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/6 bg-[#0F1829]/80 p-4">
              <p className={`text-2xl font-bold font-[family-name:var(--font-syne)] ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input
            placeholder="Search by title or niche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={14} />}
            className="sm:w-72"
          />
          <div className="flex gap-2">
            {["all", "draft", "final", "published"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all font-[family-name:var(--font-syne)] ${
                  filter === f
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                    : "bg-white/3 text-slate-500 border border-white/8 hover:border-white/15"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <SortAsc size={13} />
            Sort
          </button>
        </div>

        {/* Scripts list or empty */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/3 border border-white/8 flex items-center justify-center">
              <FileText size={28} className="text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-400 font-[family-name:var(--font-syne)]">No scripts yet</p>
              <p className="text-sm text-slate-600 mt-1">Create your first AI-powered YouTube script.</p>
            </div>
            <Link href="/dashboard/new-script">
              <Button icon={<PenLine size={14} />}>Write your first script</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((script) => (
              <Card key={script.id} hover>
                <CardBody className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <ScrollText size={18} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-syne)] truncate">{script.title}</h3>
                      <Badge variant={statusColors[script.status]}>{script.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{script.niche}</span>
                      <span>·</span>
                      <span>{script.words} words</span>
                      <span>·</span>
                      <span>{script.duration} min</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{script.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"><Eye size={14} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"><Copy size={14} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"><Download size={14} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
