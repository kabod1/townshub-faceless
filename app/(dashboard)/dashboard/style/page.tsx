"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Plus, Trash2, Play, Globe, CheckCircle2,
  PenLine, Mic, BookOpen, TrendingUp, Lightbulb, AlertCircle
} from "lucide-react";

const toneOptions = [
  { value: "educational", label: "Educational & Informative" },
  { value: "entertaining", label: "Entertaining & Casual" },
  { value: "motivational", label: "Motivational & Inspiring" },
  { value: "storytelling", label: "Storytelling & Narrative" },
  { value: "analytical", label: "Analytical & Data-Driven" },
  { value: "conversational", label: "Conversational & Friendly" },
];

const hookStyles = [
  { id: "question", label: "Open with a Question", icon: "?" },
  { id: "statistic", label: "Shocking Statistic", icon: "#" },
  { id: "story", label: "Personal Story", icon: "✦" },
  { id: "controversy", label: "Controversial Statement", icon: "!" },
  { id: "pattern", label: "Pattern Interrupt", icon: "↯" },
  { id: "promise", label: "Bold Promise", icon: "→" },
];

const contentPillars = [
  "How-to Tutorials", "List Videos", "Reviews & Comparisons", "Opinion Pieces",
  "Case Studies", "Reaction Videos", "Explainers", "Vlogs",
];

interface ChannelProfile {
  id: string;
  name: string;
  niche: string;
  handle: string;
  competitors: string[];
}

export default function StylePage() {
  const [selectedTone, setSelectedTone] = useState("educational");
  const [selectedHooks, setSelectedHooks] = useState<string[]>(["question", "promise"]);
  const [selectedPillars, setSelectedPillars] = useState<string[]>(["How-to Tutorials", "List Videos"]);
  const [writingDNA, setWritingDNA] = useState("");
  const [channels, setChannels] = useState<ChannelProfile[]>([]);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: "", niche: "", handle: "", competitor: "" });

  const toggleHook = (id: string) => {
    setSelectedHooks((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const togglePillar = (p: string) => {
    setSelectedPillars((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const addChannel = () => {
    if (!newChannel.name) return;
    setChannels((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newChannel.name,
        niche: newChannel.niche,
        handle: newChannel.handle,
        competitors: newChannel.competitor ? [newChannel.competitor] : [],
      },
    ]);
    setNewChannel({ name: "", niche: "", handle: "", competitor: "" });
    setShowAddChannel(false);
  };

  return (
    <div className="min-h-screen">
      <Topbar title="My Style & Profiles" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Banner */}
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/8 to-transparent p-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-orange-400 shrink-0" />
          <p className="text-sm text-slate-300">
            Add competitor channels so Townshub can learn your writing style and generate better scripts & SEO keywords.
          </p>
          <button className="ml-auto shrink-0 px-4 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold font-[family-name:var(--font-syne)] hover:bg-orange-500/30 transition-all">
            Set Up My Style
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Style Config */}
          <div className="lg:col-span-2 space-y-6">

            {/* My Style */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                    <Sparkles size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">My Style</h3>
                    <p className="text-xs text-slate-500">Customize how the AI writes for you across all channels</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">

                {/* Writing Tone */}
                <Select
                  label="Writing Tone"
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  options={toneOptions}
                />

                {/* Hook Style */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-[family-name:var(--font-syne)]">Hook Styles</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hookStyles.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => toggleHook(h.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                          selectedHooks.includes(h.id)
                            ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                            : "border-white/8 bg-white/2 text-slate-500 hover:border-white/15 hover:text-slate-400"
                        }`}
                      >
                        <span className="text-xs font-bold w-4 text-center">{h.icon}</span>
                        <span className="text-xs leading-tight">{h.label}</span>
                        {selectedHooks.includes(h.id) && <CheckCircle2 size={12} className="ml-auto text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Pillars */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-[family-name:var(--font-syne)]">Content Pillars</p>
                  <div className="flex flex-wrap gap-2">
                    {contentPillars.map((p) => (
                      <button
                        key={p}
                        onClick={() => togglePillar(p)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          selectedPillars.includes(p)
                            ? "bg-cyan-500/12 border-cyan-500/30 text-cyan-300"
                            : "border-white/8 text-slate-500 hover:border-white/15 hover:text-slate-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Writing DNA */}
                <Textarea
                  label="Writing DNA (Custom Instructions)"
                  value={writingDNA}
                  onChange={(e) => setWritingDNA(e.target.value)}
                  rows={4}
                  placeholder="e.g. Always start with a counterintuitive insight. Use short punchy sentences. Avoid corporate jargon. Reference real examples whenever possible..."
                  hint="These instructions are applied to every script you generate."
                />

                <Button size="md" icon={<Sparkles size={14} />}>
                  Save Style Settings
                </Button>
              </CardBody>
            </Card>

            {/* Style Insights */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Style Insights</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: PenLine, label: "Avg. Script Length", value: "—", color: "text-cyan-400" },
                    { icon: Mic, label: "Preferred Hook", value: "—", color: "text-orange-400" },
                    { icon: BookOpen, label: "Top Pillar", value: "—", color: "text-violet-400" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded-lg bg-white/2 border border-white/5">
                      <item.icon size={18} className={`${item.color} mx-auto mb-2`} />
                      <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">{item.value}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 text-center mt-4">Generate scripts to see your writing patterns.</p>
              </CardBody>
            </Card>
          </div>

          {/* Right: Channel Profiles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Channel Profiles</h3>
                <p className="text-xs text-slate-500 mt-0.5">Switch between different YouTube channels</p>
              </div>
              <Button size="sm" variant="outline" icon={<Plus size={12} />} onClick={() => setShowAddChannel(true)}>
                Add
              </Button>
            </div>

            {channels.length === 0 && !showAddChannel && (
              <Card>
                <CardBody className="text-center py-8">
                  <Play size={28} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400 font-[family-name:var(--font-syne)]">No channels yet</p>
                  <p className="text-xs text-slate-600 mt-1 mb-4">Add a channel profile to get personalized scripts.</p>
                  <Button size="sm" variant="outline" onClick={() => setShowAddChannel(true)} icon={<Plus size={12} />}>
                    Add Channel Profile
                  </Button>
                </CardBody>
              </Card>
            )}

            {showAddChannel && (
              <Card glow>
                <CardHeader>
                  <h4 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">New Channel Profile</h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Input label="Channel Name" placeholder="e.g. Money Mindset" value={newChannel.name} onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })} />
                  <Input label="Niche" placeholder="e.g. Personal Finance" value={newChannel.niche} onChange={(e) => setNewChannel({ ...newChannel, niche: e.target.value })} />
                  <Input label="YouTube Handle" placeholder="@yourhandle" value={newChannel.handle} onChange={(e) => setNewChannel({ ...newChannel, handle: e.target.value })} icon={<Play size={14} />} />
                  <Input label="Competitor Channel URL" placeholder="youtube.com/@competitor" value={newChannel.competitor} onChange={(e) => setNewChannel({ ...newChannel, competitor: e.target.value })} icon={<Globe size={14} />} hint="We'll analyze their scripts to build your style." />
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={addChannel}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddChannel(false)}>Cancel</Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {channels.map((ch) => (
              <Card key={ch.id} hover>
                <CardBody>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-sm font-bold font-[family-name:var(--font-syne)]">
                        {ch.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">{ch.name}</p>
                        <p className="text-xs text-slate-500">{ch.niche}</p>
                        {ch.handle && <p className="text-xs text-cyan-500">{ch.handle}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => setChannels((p) => p.filter((c) => c.id !== ch.id))}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {ch.competitors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[11px] text-slate-600 mb-1.5">Competitor Channels</p>
                      {ch.competitors.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Globe size={11} className="text-slate-600" />
                          <p className="text-xs text-slate-500">{c}</p>
                          <Badge variant="green" className="ml-auto">Analyzed</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}

            {/* Competitor analysis tip */}
            <Card>
              <CardBody>
                <div className="flex gap-3">
                  <Lightbulb size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Add 3+ competitor channels to enable <span className="text-cyan-400 font-medium">Writing DNA</span> analysis — we&apos;ll reverse-engineer what makes their scripts work.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
