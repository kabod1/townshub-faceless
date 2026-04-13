"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User, Mail, CreditCard, Puzzle, CheckCircle2,
  AlertCircle, Shield, Bell, Globe, Trash2,
  ExternalLink, Zap, Key, LogOut
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Towns Hub");
  const [email] = useState("townshub1@gmail.com");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Settings" />

      <div className="p-6 max-w-3xl mx-auto space-y-6">

        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Profile</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Your personal information</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold font-[family-name:var(--font-syne)] shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                T
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">Profile Photo</p>
                <p className="text-xs text-slate-500 mt-0.5">Upload a photo or leave it as initials</p>
                <button className="mt-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Change photo</button>
              </div>
            </div>
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">Email</label>
              <div className="mt-1.5 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/3 border border-white/8">
                <Mail size={14} className="text-slate-500" />
                <span className="text-sm text-slate-400">{email}</span>
                <Badge variant="green" className="ml-auto">Verified</Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">Plan</label>
              <div className="mt-1.5 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/3 border border-white/8">
                <Zap size={14} className="text-cyan-400" />
                <span className="text-sm text-slate-300 font-medium">Starter Plan</span>
                <button className="ml-auto text-xs text-orange-400 hover:text-orange-300 transition-colors font-semibold font-[family-name:var(--font-syne)]">
                  Upgrade →
                </button>
              </div>
            </div>
            <Button
              size="md"
              onClick={handleSave}
              icon={saved ? <CheckCircle2 size={14} /> : undefined}
              variant={saved ? "outline" : "primary"}
            >
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </CardBody>
        </Card>

        {/* Chrome Extension */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Chrome Extension</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Analyze YouTube channels directly on YouTube</p>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                <Puzzle size={18} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">Extension Not Connected</p>
                <p className="text-xs text-slate-500 mt-0.5">Install the Chrome Extension and click &ldquo;Sign in with Google&rdquo; to connect.</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold font-[family-name:var(--font-syne)] hover:from-cyan-500/25 transition-all shrink-0">
                Install Extension
                <ExternalLink size={11} />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-[family-name:var(--font-syne)]">Extension Features</p>
              {[
                "Outlier score on every YouTube video",
                "Channel analytics overlay",
                "Video tags & SEO data",
                "Monetization status indicator",
                "One-click channel import to Townshub",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-slate-600 shrink-0" />
                  <p className="text-xs text-slate-500">{feature}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Notifications</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              { label: "Script generation complete", desc: "When your script is ready", default: true },
              { label: "New video ideas available", desc: "Daily AI-generated ideas for your niche", default: true },
              { label: "Production board reminders", desc: "Due date reminders for your videos", default: false },
              { label: "Product updates & news", desc: "New features and improvements", default: true },
              { label: "Billing & plan updates", desc: "Invoices and plan changes", default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
                <div>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  className={`relative w-10 h-6 rounded-full transition-all duration-200 ${item.default ? "bg-cyan-500" : "bg-white/10"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${item.default ? "left-4.5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Security</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/3 transition-all group">
              <div className="flex items-center gap-3">
                <Key size={14} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                <div className="text-left">
                  <p className="text-sm text-white font-medium">Change Password</p>
                  <p className="text-xs text-slate-500">Last changed never</p>
                </div>
              </div>
              <span className="text-xs text-cyan-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/3 transition-all group">
              <div className="flex items-center gap-3">
                <Globe size={14} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                <div className="text-left">
                  <p className="text-sm text-white font-medium">Active Sessions</p>
                  <p className="text-xs text-slate-500">1 active session</p>
                </div>
              </div>
              <span className="text-xs text-cyan-400">→</span>
            </button>
          </CardBody>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-400" />
              <h3 className="text-sm font-bold text-red-400 font-[family-name:var(--font-syne)]">Danger Zone</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5">
              <div>
                <p className="text-sm text-white font-medium">Sign Out</p>
                <p className="text-xs text-slate-500">Sign out of your Townshub account</p>
              </div>
              <Button size="sm" variant="ghost" icon={<LogOut size={13} />}>Sign Out</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/15">
              <div>
                <p className="text-sm text-red-400 font-medium">Delete Account</p>
                <p className="text-xs text-slate-500">Permanently delete your account and all data</p>
              </div>
              <Button size="sm" variant="danger" icon={<Trash2 size={13} />}>Delete</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
