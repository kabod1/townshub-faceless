"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Search, RefreshCw, Zap, AlertCircle,
  Users, Eye, BookmarkPlus, BookmarkCheck,
  X, ChevronUp, ChevronDown, Minus, ExternalLink,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string; // emoji or initials
  avatarBg: string;
  category: string;
  subs: string;
  subsNum: number;
  viewsPerMonth: string;
  viewsNum: number;
  rpm: string;
  rpmNum: number;
  earnings: string;
  earningsNum: number;
  competition: "Low" | "Medium" | "High";
  potential: number;
  trend: "up" | "stable" | "down";
  monetized: boolean;
  saved: boolean;
}

const CATEGORIES = [
  "All Categories", "Knowledge", "Lifestyle (sociology)", "Entertainment",
  "Society", "Film", "Health", "Sport", "Technology", "Basketball",
  "Food", "Politics", "Religion", "Music", "Hobby", "Video game culture",
  "Vehicle", "Association football", "Physical fitness", "Military",
  "Finance", "Education", "Gaming", "Travel", "Beauty", "Business",
];

const MONETIZATION = ["All", "Monetized", "Not Monetized", "High RPM"];

const STEPS = [
  "Scanning YouTube trends…", "Analysing 12,000+ channels…",
  "Calculating RPM data…", "Scoring competition gaps…", "Finalising opportunities…",
];

const compColor: Record<string, string> = { Low: "#34d399", Medium: "#facc15", High: "#f87171" };
const compBg: Record<string, string> = { Low: "rgba(52,211,153,0.12)", Medium: "rgba(250,204,21,0.12)", High: "rgba(248,113,113,0.12)" };

const FAKE_DATA: Channel[] = [
  { id:"1",  name:"Finance Unlocked",       handle:"@financeunlocked",    avatar:"F",  avatarBg:"#1e40af", category:"Finance",              subs:"892K",  subsNum:892000,    viewsPerMonth:"4.1M",  viewsNum:4100000,  rpm:"$12.40", rpmNum:12.4,  earnings:"$50.8K",  earningsNum:50800,  competition:"Low",    potential:94, trend:"up",     monetized:true,  saved:false },
  { id:"2",  name:"Frank Money",             handle:"@frankmoney",         avatar:"FM", avatarBg:"#7c3aed", category:"Finance",              subs:"234K",  subsNum:234000,    viewsPerMonth:"1.2M",  viewsNum:1200000,  rpm:"$11.20", rpmNum:11.2,  earnings:"$13.4K",  earningsNum:13400,  competition:"Low",    potential:81, trend:"up",     monetized:true,  saved:false },
  { id:"3",  name:"LowKey New Network",      handle:"@lowkeynewnetwork",   avatar:"LN", avatarBg:"#0f766e", category:"Knowledge",            subs:"67K",   subsNum:67000,     viewsPerMonth:"890K",  viewsNum:890000,   rpm:"$8.60",  rpmNum:8.6,   earnings:"$7.6K",   earningsNum:7600,   competition:"Low",    potential:78, trend:"stable", monetized:true,  saved:false },
  { id:"4",  name:"El Torpedo",              handle:"@eltorpedo",          avatar:"ET", avatarBg:"#b45309", category:"Entertainment",        subs:"1.4M",  subsNum:1400000,   viewsPerMonth:"6.8M",  viewsNum:6800000,  rpm:"$4.20",  rpmNum:4.2,   earnings:"$28.5K",  earningsNum:28500,  competition:"Medium", potential:72, trend:"up",     monetized:true,  saved:false },
  { id:"5",  name:"Science Probably",        handle:"@scienceprobably",    avatar:"SP", avatarBg:"#0369a1", category:"Knowledge",            subs:"312K",  subsNum:312000,    viewsPerMonth:"2.1M",  viewsNum:2100000,  rpm:"$9.80",  rpmNum:9.8,   earnings:"$20.5K",  earningsNum:20500,  competition:"Low",    potential:88, trend:"up",     monetized:true,  saved:false },
  { id:"6",  name:"Wealth Daily",            handle:"@wealthdaily",        avatar:"W",  avatarBg:"#15803d", category:"Finance",              subs:"178K",  subsNum:178000,    viewsPerMonth:"980K",  viewsNum:980000,   rpm:"$13.50", rpmNum:13.5,  earnings:"$13.2K",  earningsNum:13200,  competition:"Low",    potential:85, trend:"up",     monetized:true,  saved:false },
  { id:"7",  name:"InvestSmart",             handle:"@investsmart",        avatar:"IS", avatarBg:"#1d4ed8", category:"Finance",              subs:"542K",  subsNum:542000,    viewsPerMonth:"3.4M",  viewsNum:3400000,  rpm:"$14.20", rpmNum:14.2,  earnings:"$48.2K",  earningsNum:48200,  competition:"Medium", potential:91, trend:"up",     monetized:true,  saved:false },
  { id:"8",  name:"HealthHack TV",           handle:"@healthhacktv",       avatar:"HH", avatarBg:"#be123c", category:"Health",               subs:"423K",  subsNum:423000,    viewsPerMonth:"2.8M",  viewsNum:2800000,  rpm:"$7.30",  rpmNum:7.3,   earnings:"$20.4K",  earningsNum:20400,  competition:"Medium", potential:76, trend:"stable", monetized:true,  saved:false },
  { id:"9",  name:"TechBreak",               handle:"@techbreak",          avatar:"TB", avatarBg:"#6d28d9", category:"Technology",           subs:"1.1M",  subsNum:1100000,   viewsPerMonth:"5.2M",  viewsNum:5200000,  rpm:"$6.10",  rpmNum:6.1,   earnings:"$31.7K",  earningsNum:31700,  competition:"High",   potential:68, trend:"stable", monetized:true,  saved:false },
  { id:"10", name:"Crypto Simplified",       handle:"@cryptosimplified",   avatar:"CS", avatarBg:"#b45309", category:"Finance",              subs:"298K",  subsNum:298000,    viewsPerMonth:"1.9M",  viewsNum:1900000,  rpm:"$15.80", rpmNum:15.8,  earnings:"$30.0K",  earningsNum:30000,  competition:"Low",    potential:90, trend:"up",     monetized:true,  saved:false },
  { id:"11", name:"MindShift",               handle:"@mindshiftchannel",   avatar:"MS", avatarBg:"#0e7490", category:"Knowledge",            subs:"89K",   subsNum:89000,     viewsPerMonth:"560K",  viewsNum:560000,   rpm:"$6.40",  rpmNum:6.4,   earnings:"$3.5K",   earningsNum:3500,   competition:"Low",    potential:74, trend:"up",     monetized:true,  saved:false },
  { id:"12", name:"Fit & Fast",              handle:"@fitandfast",         avatar:"FF", avatarBg:"#065f46", category:"Physical fitness",     subs:"651K",  subsNum:651000,    viewsPerMonth:"4.4M",  viewsNum:4400000,  rpm:"$5.20",  rpmNum:5.2,   earnings:"$22.8K",  earningsNum:22800,  competition:"Medium", potential:79, trend:"stable", monetized:true,  saved:false },
  { id:"13", name:"Stoic Path",              handle:"@stoicpath",          avatar:"SP", avatarBg:"#713f12", category:"Knowledge",            subs:"203K",  subsNum:203000,    viewsPerMonth:"1.3M",  viewsNum:1300000,  rpm:"$8.90",  rpmNum:8.9,   earnings:"$11.5K",  earningsNum:11500,  competition:"Low",    potential:83, trend:"up",     monetized:true,  saved:false },
  { id:"14", name:"GameTheory Pro",          handle:"@gametheoryp",        avatar:"GT", avatarBg:"#7c3aed", category:"Gaming",               subs:"2.3M",  subsNum:2300000,   viewsPerMonth:"9.1M",  viewsNum:9100000,  rpm:"$3.80",  rpmNum:3.8,   earnings:"$34.5K",  earningsNum:34500,  competition:"High",   potential:65, trend:"down",   monetized:true,  saved:false },
  { id:"15", name:"EcoLiving Now",           handle:"@ecolivingnow",       avatar:"EL", avatarBg:"#166534", category:"Lifestyle (sociology)", subs:"94K",   subsNum:94000,     viewsPerMonth:"620K",  viewsNum:620000,   rpm:"$7.10",  rpmNum:7.1,   earnings:"$4.4K",   earningsNum:4400,   competition:"Low",    potential:77, trend:"up",     monetized:true,  saved:false },
  { id:"16", name:"True Crime Daily",        handle:"@truecrimedaily",     avatar:"TC", avatarBg:"#7f1d1d", category:"Entertainment",        subs:"1.8M",  subsNum:1800000,   viewsPerMonth:"8.3M",  viewsNum:8300000,  rpm:"$5.60",  rpmNum:5.6,   earnings:"$46.4K",  earningsNum:46400,  competition:"Medium", potential:82, trend:"up",     monetized:true,  saved:false },
  { id:"17", name:"Nutrition Science",       handle:"@nutritionscience",   avatar:"NS", avatarBg:"#15803d", category:"Health",               subs:"376K",  subsNum:376000,    viewsPerMonth:"2.2M",  viewsNum:2200000,  rpm:"$9.40",  rpmNum:9.4,   earnings:"$20.6K",  earningsNum:20600,  competition:"Low",    potential:87, trend:"up",     monetized:true,  saved:false },
  { id:"18", name:"History Nerds",           handle:"@historynerds",       avatar:"HN", avatarBg:"#78350f", category:"Knowledge",            subs:"445K",  subsNum:445000,    viewsPerMonth:"2.9M",  viewsNum:2900000,  rpm:"$7.80",  rpmNum:7.8,   earnings:"$22.6K",  earningsNum:22600,  competition:"Low",    potential:86, trend:"stable", monetized:true,  saved:false },
  { id:"19", name:"Solo Travel Guide",       handle:"@solotravelguide",    avatar:"ST", avatarBg:"#0369a1", category:"Travel",               subs:"128K",  subsNum:128000,    viewsPerMonth:"750K",  viewsNum:750000,   rpm:"$6.20",  rpmNum:6.2,   earnings:"$4.6K",   earningsNum:4600,   competition:"Medium", potential:71, trend:"up",     monetized:true,  saved:false },
  { id:"20", name:"The Business Lab",        handle:"@thebusinesslab",     avatar:"BL", avatarBg:"#1e3a8a", category:"Business",             subs:"267K",  subsNum:267000,    viewsPerMonth:"1.6M",  viewsNum:1600000,  rpm:"$12.10", rpmNum:12.1,  earnings:"$19.3K",  earningsNum:19300,  competition:"Low",    potential:89, trend:"up",     monetized:true,  saved:false },
];

function parseNum(val: string): number {
  if (!val) return 0;
  const v = val.replace(/[^0-9.KMB]/gi, "");
  const n = parseFloat(v);
  if (/B/i.test(val)) return n * 1_000_000_000;
  if (/M/i.test(val)) return n * 1_000_000;
  if (/K/i.test(val)) return n * 1_000;
  return n;
}

export default function NicheFinderPage() {
  const [channels, setChannels] = useState<Channel[]>(FAKE_DATA);
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [monetization, setMonetization] = useState("All");
  const [minSubs, setMinSubs] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [minViews, setMinViews] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [minEarnings, setMinEarnings] = useState("");
  const [maxEarnings, setMaxEarnings] = useState("");
  const [sortCol, setSortCol] = useState("potential");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");

  const toggleSave = (id: string) => setChannels(prev => prev.map(c => c.id === id ? { ...c, saved: !c.saved } : c));

  const handleRefresh = async () => {
    setGenerating(true); setError(null); setGeneratingStep(0);
    const interval = setInterval(() => setGeneratingStep(s => Math.min(s + 1, STEPS.length - 1)), 1800);
    try {
      const res = await fetch("/api/niche-finder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category === "All Categories" ? "all" : category, competition: "all", search, count: 12 }),
      });
      clearInterval(interval);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      const data = json.data || json;
      const raw = (data.niches || []).map((n: { id?: string; name: string; category: string; competition: "Low"|"Medium"|"High"; potential: number; avgViews: string; avgSubs: string; rpm: string; trend: "up"|"stable"|"down"; tags?: string[] }, i: number): Channel => ({
        id: n.id || String(i + 100),
        name: n.name, handle: `@${n.name.toLowerCase().replace(/\s+/g, "")}`,
        avatar: n.name.charAt(0).toUpperCase(),
        avatarBg: ["#1e40af","#7c3aed","#0f766e","#b45309","#be123c","#0369a1"][i % 6],
        category: n.category, subs: n.avgSubs, subsNum: parseNum(n.avgSubs),
        viewsPerMonth: n.avgViews, viewsNum: parseNum(n.avgViews),
        rpm: n.rpm, rpmNum: parseNum(n.rpm),
        earnings: `$${((parseNum(n.rpm) * parseNum(n.avgViews)) / 1000).toFixed(1)}K`,
        earningsNum: (parseNum(n.rpm) * parseNum(n.avgViews)) / 1000,
        competition: n.competition, potential: n.potential,
        trend: n.trend, monetized: true, saved: false,
      }));
      if (raw.length) setChannels(raw);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setGenerating(false); }
  };

  const clearFilters = () => {
    setSearch(""); setCategory("All Categories"); setMonetization("All");
    setMinSubs(""); setMaxSubs(""); setMinViews(""); setMaxViews(""); setMinEarnings(""); setMaxEarnings("");
  };

  const hasFilters = !!(search || category !== "All Categories" || monetization !== "All" ||
    minSubs || maxSubs || minViews || maxViews || minEarnings || maxEarnings);

  const filtered = channels.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.handle.includes(search.toLowerCase())) return false;
    if (category !== "All Categories" && !c.category.toLowerCase().includes(category.toLowerCase())) return false;
    if (monetization === "Monetized" && !c.monetized) return false;
    if (monetization === "Not Monetized" && c.monetized) return false;
    if (monetization === "High RPM" && c.rpmNum < 10) return false;
    if (minSubs && c.subsNum < parseNum(minSubs)) return false;
    if (maxSubs && c.subsNum > parseNum(maxSubs)) return false;
    if (minViews && c.viewsNum < parseNum(minViews)) return false;
    if (maxViews && c.viewsNum > parseNum(maxViews)) return false;
    if (minEarnings && c.earningsNum < parseNum(minEarnings)) return false;
    if (maxEarnings && c.earningsNum > parseNum(maxEarnings)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va: number|string = 0, vb: number|string = 0;
    if (sortCol === "potential")  { va = a.potential;   vb = b.potential; }
    else if (sortCol === "subs")  { va = a.subsNum;     vb = b.subsNum; }
    else if (sortCol === "views") { va = a.viewsNum;    vb = b.viewsNum; }
    else if (sortCol === "rpm")   { va = a.rpmNum;      vb = b.rpmNum; }
    else if (sortCol === "earnings") { va = a.earningsNum; vb = b.earningsNum; }
    else if (sortCol === "name")  { va = a.name;        vb = b.name; }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === "asc" ? va - (vb as number) : (vb as number) - va;
  });

  function toggleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ChevronUp size={10} color="#2A3F5F" />;
    return sortDir === "asc" ? <ChevronUp size={10} color="#00D4FF" /> : <ChevronDown size={10} color="#00D4FF" />;
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12,
    outline: "none", width: "100%", boxSizing: "border-box",
  };

  const COLS = [
    { key: "name",     label: "Channel",         flex: "2.2fr" },
    { key: "category", label: "Category",         flex: "1.2fr" },
    { key: "subs",     label: "Subscribers",      flex: "90px"  },
    { key: "views",    label: "Views/mo",          flex: "90px"  },
    { key: "rpm",      label: "RPM",               flex: "70px"  },
    { key: "earnings", label: "Est. Earnings/mo",  flex: "110px" },
    { key: "potential",label: "Score",             flex: "80px"  },
    { key: "actions",  label: "",                  flex: "80px"  },
  ];
  const grid = COLS.map(c => c.flex).join(" ");

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Niche Finder" subtitle="Discover high-performing niches for faceless channels" />

      <div style={{ padding: "24px 32px", maxWidth: 1140, margin: "0 auto" }}>

        {/* Purple search card */}
        <div style={{
          borderRadius: 18, padding: "22px 26px", marginBottom: 22,
          background: "linear-gradient(135deg, #3b1fa3 0%, #4c1d95 50%, #6d28d9 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          {/* Search bar */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search size={14} color="rgba(255,255,255,0.45)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search channel name..."
              style={{ ...inputStyle, paddingLeft: 36, fontSize: 13, background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" }}
            />
          </div>

          {/* Category + Monetization row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#1e1b4b" }}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Monetization</label>
              <select value={monetization} onChange={e => setMonetization(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {MONETIZATION.map(m => <option key={m} value={m} style={{ background: "#1e1b4b" }}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Range filters */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            {[
              { label: "Min Subs",        val: minSubs,     set: setMinSubs,     min: 0,  step: 1000  },
              { label: "Max Subs",        val: maxSubs,     set: setMaxSubs,     min: 0,  step: 1000  },
              { label: "Min Views/mo",    val: minViews,    set: setMinViews,    min: 0,  step: 10000 },
              { label: "Max Views/mo",    val: maxViews,    set: setMaxViews,    min: 0,  step: 10000 },
              { label: "Min Earnings/mo", val: minEarnings, set: setMinEarnings, min: 0,  step: 100   },
              { label: "Max Earnings/mo", val: maxEarnings, set: setMaxEarnings, min: 0,  step: 100   },
            ].map(({ label, val, set, min, step }) => (
              <div key={label} style={{ flex: "1 1 110px", minWidth: 95 }}>
                <label style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 5, whiteSpace: "nowrap" }}>{label}</label>
                <input
                  type="number" min={min} step={step}
                  value={val} onChange={e => set(e.target.value)}
                  style={{ ...inputStyle, fontSize: 11 }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", paddingBottom: 0 }}>
              {hasFilters && (
                <button onClick={clearFilters} style={{
                  padding: "9px 16px", borderRadius: 8, background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 12,
                  fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5,
                }}>
                  <X size={12} /> Clear All
                </button>
              )}
              <button onClick={handleRefresh} disabled={generating} style={{
                padding: "9px 16px", borderRadius: 8,
                background: generating ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 12,
                fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              }}>
                {generating
                  ? <><RefreshCw size={12} style={{ animation: "spin 0.7s linear infinite" }} /> {STEPS[generatingStep]}</>
                  : <><Zap size={12} fill="#fff" /> Refresh AI</>}
              </button>
            </div>
          </div>

          {generating && (
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "rgba(255,255,255,0.6)", transition: "width 1800ms ease-out", width: `${((generatingStep + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 16 }}>
            <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#fca5a5" }}>{error} — showing sample data</span>
          </div>
        )}

        {/* Results table */}
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,16,30,0.98)" }}>

          {/* Table top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{sorted.length} channels</span>
              {hasFilters && <span style={{ fontSize: 11, color: "#64748b" }}>filtered</span>}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#475569" }}>
              {[
                { label: "Low Competition", count: channels.filter(c => c.competition === "Low").length,  color: "#34d399" },
                { label: "Trending Up",     count: channels.filter(c => c.trend === "up").length,         color: "#a78bfa" },
                { label: "Saved",           count: channels.filter(c => c.saved).length,                  color: "#00D4FF" },
              ].map(({ label, count, color }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />{count} {label}
                </span>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: grid, padding: "9px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
            {COLS.map(({ key, label }) => (
              <button key={key} onClick={() => key !== "actions" && key !== "category" && toggleSort(key)} style={{
                display: "flex", alignItems: "center", gap: 3, background: "none", border: "none",
                cursor: key !== "actions" && key !== "category" ? "pointer" : "default",
                fontSize: 10, fontWeight: 700, color: "#475569",
                textTransform: "uppercase", letterSpacing: "0.09em", padding: 0, textAlign: "left",
              }}>
                {label}
                {key !== "actions" && key !== "category" && label && <SortIcon col={key} />}
              </button>
            ))}
          </div>

          {/* Rows */}
          {sorted.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "#475569", fontSize: 13 }}>
              No channels match your filters.
              <button onClick={clearFilters} style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontSize: 13, marginLeft: 6 }}>Clear filters</button>
            </div>
          ) : sorted.map((ch, idx) => {
            const TrendIcon = ch.trend === "up" ? ChevronUp : ch.trend === "down" ? ChevronDown : Minus;
            const trendColor = ch.trend === "up" ? "#34d399" : ch.trend === "down" ? "#f87171" : "#64748b";
            return (
              <div key={ch.id} style={{
                display: "grid", gridTemplateColumns: grid,
                padding: "13px 18px", alignItems: "center",
                borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.025)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                {/* Channel */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: ch.avatarBg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff",
                  }}>{ch.avatar}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                      <TrendIcon size={11} color={trendColor} />
                    </div>
                    <span style={{ fontSize: 10, color: "#64748b" }}>{ch.handle}</span>
                  </div>
                </div>

                {/* Category */}
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{ch.category}</span>

                {/* Subs */}
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 4 }}>
                    <Users size={10} color="#475569" />{ch.subs}
                  </span>
                </div>

                {/* Views */}
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 4 }}>
                    <Eye size={10} color="#475569" />{ch.viewsPerMonth}
                  </span>
                </div>

                {/* RPM */}
                <span style={{ fontSize: 12, fontWeight: 700, color: "#facc15" }}>{ch.rpm}</span>

                {/* Earnings */}
                <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399" }}>{ch.earnings}</span>

                {/* Score */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, width: `${ch.potential}%`, background: ch.potential >= 85 ? "linear-gradient(90deg,#34d399,#10b981)" : ch.potential >= 70 ? "linear-gradient(90deg,#00D4FF,#0080cc)" : "linear-gradient(90deg,#facc15,#f59e0b)" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: ch.potential >= 85 ? "#34d399" : ch.potential >= 70 ? "#00D4FF" : "#facc15", minWidth: 20, textAlign: "right" }}>{ch.potential}</span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: compBg[ch.competition], color: compColor[ch.competition], whiteSpace: "nowrap" }}>
                    {ch.competition}
                  </span>
                  <button
                    onClick={() => toggleSave(ch.id)}
                    title={ch.saved ? "Unsave" : "Save niche"}
                    style={{
                      padding: "5px 8px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                      background: ch.saved ? "rgba(0,212,255,0.18)" : "rgba(255,255,255,0.05)",
                      border: ch.saved ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.12)",
                      color: ch.saved ? "#00D4FF" : "#cbd5e1",
                      transition: "all 0.15s",
                    }}
                  >
                    {ch.saved ? <BookmarkCheck size={13} /> : <BookmarkPlus size={13} />}
                  </button>
                  <button
                    onClick={() => window.open(`/dashboard/new-script?idea=${encodeURIComponent(ch.name)}`, '_blank')}
                    title="Analyse this niche — open in New Script"
                    style={{
                      padding: "5px 8px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                      background: "rgba(167,139,250,0.08)",
                      border: "1px solid rgba(167,139,250,0.25)",
                      color: "#a78bfa",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,0.18)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(167,139,250,0.08)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.25)"; }}
                  >
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinner[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
