"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Star, Crown, ArrowRight, CreditCard, FileText } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    period: "/mo",
    scripts: 4,
    thumbnails: 120,
    current: true,
    color: "border-cyan-500/20",
    tag: null,
    features: [
      "4 full AI scripts",
      "120 AI thumbnail assets",
      "Chrome Extension (analytics, tags, outlier scores)",
      "Score review & analysis",
      "Style profiles",
      "Research import (URLs, PDFs)",
      "Production board",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    period: "/mo",
    scripts: 15,
    thumbnails: 300,
    current: false,
    color: "border-cyan-400/40",
    tag: "Most Popular",
    tagColor: "cyan",
    features: [
      "15 full AI scripts",
      "300 AI thumbnail assets",
      "Everything in Starter",
      "Niche Finder database",
      "Similar Channels finder",
      "Saved Channels",
      "Niche Bending tool",
      "Team collaboration",
      "Multiple channel profiles",
      "Priority generation",
    ],
  },
  {
    id: "elite",
    name: "Elite AI",
    price: "$99.99",
    period: "/mo",
    scripts: 30,
    thumbnails: 600,
    current: false,
    color: "border-yellow-500/30",
    tag: "Premium",
    tagColor: "gold",
    features: [
      "30 full AI scripts",
      "600 AI thumbnail assets",
      "Everything in Pro",
      "AI consulting chat",
      "Personal YouTube mentor",
      "Strategy & growth advice",
      "Niche & trend analysis",
      "Priority support",
    ],
  },
];

export default function BillingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen">
      <Topbar title="Billing" />

      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Current Plan */}
        <div className="rounded-xl border border-cyan-500/15 bg-gradient-to-br from-[#162035] to-[#0F1829] p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0">
            <Zap size={22} className="text-cyan-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-lg font-bold text-white font-[family-name:var(--font-syne)]">Starter Plan</p>
              <Badge variant="cyan">Current Plan</Badge>
            </div>
            <p className="text-sm text-slate-400">$9.99/month · Renews May 13, 2026</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-slate-500">Scripts: <span className="text-white font-medium">0/4 used</span></span>
              <span className="text-xs text-slate-500">Thumbnails: <span className="text-white font-medium">0/120 used</span></span>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm font-medium hover:border-white/20 hover:text-white transition-all">
            Manage Subscription
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">Upgrade Your Plan</h2>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all font-[family-name:var(--font-syne)] ${billing === "monthly" ? "bg-[#162035] text-white border border-cyan-500/15" : "text-slate-500"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all font-[family-name:var(--font-syne)] flex items-center gap-2 ${billing === "annual" ? "bg-[#162035] text-white border border-cyan-500/15" : "text-slate-500"}`}
            >
              Annual
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95 overflow-hidden ${plan.color} ${plan.current ? "opacity-70" : ""}`}
            >
              {plan.tag && (
                <div className="absolute top-4 right-4">
                  <Badge variant={plan.tagColor as "cyan" | "gold"}>{plan.tag}</Badge>
                </div>
              )}
              {plan.id === "pro" && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/4 to-transparent pointer-events-none" />
              )}
              {plan.id === "elite" && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/4 to-transparent pointer-events-none" />
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    {plan.id === "starter" && <Zap size={16} className="text-cyan-400" />}
                    {plan.id === "pro" && <Star size={16} className="text-cyan-400" fill="currentColor" />}
                    {plan.id === "elite" && <Crown size={16} className="text-yellow-400" fill="currentColor" />}
                    <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">{plan.name}</p>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold text-white font-[family-name:var(--font-syne)]">
                      {billing === "annual" ? `$${(parseFloat(plan.price.slice(1)) * 0.8).toFixed(2)}` : plan.price}
                    </span>
                    <span className="text-slate-400 mb-1">{plan.period}</span>
                  </div>
                  <p className="text-xs text-cyan-400 font-semibold font-[family-name:var(--font-syne)]">
                    {plan.scripts} scripts/month
                  </p>
                </div>

                {/* CTA */}
                {plan.current ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-sm font-bold font-[family-name:var(--font-syne)] cursor-not-allowed">
                    Current Plan
                  </button>
                ) : (
                  <button className={`w-full py-2.5 rounded-xl text-sm font-bold font-[family-name:var(--font-syne)] flex items-center justify-center gap-2 transition-all ${
                    plan.id === "pro"
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                      : plan.id === "elite"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]"
                      : "bg-white/8 border border-white/15 text-white hover:bg-white/12"
                  }`}>
                    Upgrade to {plan.name}
                    <ArrowRight size={14} />
                  </button>
                )}

                {/* Features */}
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-400 leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Invoice History</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8">
              <CreditCard size={28} className="text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No invoices yet</p>
              <p className="text-xs text-slate-600 mt-1">Your billing history will appear here</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
