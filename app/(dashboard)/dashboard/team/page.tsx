"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users, Crown, Lock, ArrowRight, UserPlus, Mail,
  MoreHorizontal, Shield, Eye, PenLine, Trash2,
  CheckCircle2, Clock, X, Star,
} from "lucide-react";

type Role = "admin" | "editor" | "viewer";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "pending";
  joinedAt: string;
  avatar: string;
}

const roleConfig: Record<Role, { label: string; color: "cyan" | "gold" | "neutral"; icon: React.ReactNode; perms: string[] }> = {
  admin: {
    label: "Admin",
    color: "cyan",
    icon: <Shield size={12} />,
    perms: ["Manage team & billing", "Create & edit all content", "View all analytics"],
  },
  editor: {
    label: "Editor",
    color: "gold",
    icon: <PenLine size={12} />,
    perms: ["Create & edit scripts", "Manage production board", "View shared content"],
  },
  viewer: {
    label: "Viewer",
    color: "neutral",
    icon: <Eye size={12} />,
    perms: ["View scripts & ideas", "View production board", "No editing access"],
  },
};

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Towns Hub",
    email: "townshub1@gmail.com",
    role: "admin",
    status: "active",
    joinedAt: "Apr 1, 2026",
    avatar: "T",
  },
];

const pendingInvites: { email: string; role: Role; sentAt: string }[] = [];

export default function TeamPage() {
  const isPro = false; // Starter plan — gated

  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [invites, setInvites] = useState(pendingInvites);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [sent, setSent] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInvites((prev) => [
      ...prev,
      { email: inviteEmail.trim(), role: inviteRole, sentAt: "Just now" },
    ]);
    setInviteEmail("");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setShowInvite(false);
    }, 2000);
  };

  const removeInvite = (email: string) =>
    setInvites((prev) => prev.filter((i) => i.email !== email));

  const changeRole = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    setActiveMenu(null);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Team"
        action={isPro ? { label: "Invite Member", onClick: () => setShowInvite(true) } : undefined}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Pro gate banner */}
        {!isPro && (
          <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/8 to-orange-500/5 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center shrink-0">
              <Crown size={18} className="text-yellow-400" fill="currentColor" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-300 font-[family-name:var(--font-syne)]">
                Team collaboration requires Pro or Elite
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Invite editors, assign roles, and manage your content team — all from one workspace.
              </p>
            </div>
            <Link href="/dashboard/billing">
              <Button variant="coral" icon={<ArrowRight size={14} />}>
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        )}

        {/* Member count bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <Users size={15} className="text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">
                {members.length} member{members.length !== 1 ? "s" : ""}
                {invites.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    · {invites.length} pending invite{invites.length !== 1 ? "s" : ""}
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                {isPro ? "Up to 5 members on Pro" : "Upgrade to add team members"}
              </p>
            </div>
          </div>
          {!isPro ? (
            <div className="flex items-center gap-1.5 text-xs text-yellow-400">
              <Lock size={12} />
              <span className="font-semibold font-[family-name:var(--font-syne)]">Pro feature</span>
            </div>
          ) : (
            <Button size="sm" icon={<UserPlus size={13} />} onClick={() => setShowInvite(true)}>
              Invite Member
            </Button>
          )}
        </div>

        {/* Invite Form */}
        {showInvite && (
          <Card glow>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Invite Team Member</h3>
                </div>
                <button onClick={() => setShowInvite(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={15} />
                </button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Email Address"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                icon={<Mail size={13} />}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-[family-name:var(--font-syne)]">Role</p>
                <div className="space-y-2">
                  {(["admin", "editor", "viewer"] as Role[]).map((role) => {
                    const cfg = roleConfig[role];
                    return (
                      <button
                        key={role}
                        onClick={() => setInviteRole(role)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          inviteRole === role
                            ? "border-cyan-500/40 bg-cyan-500/8"
                            : "border-white/8 bg-white/2 hover:border-white/15"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          inviteRole === role ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-500"
                        }`}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">{cfg.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{cfg.perms.join(" · ")}</p>
                        </div>
                        {inviteRole === role && <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="md"
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  icon={sent ? <CheckCircle2 size={14} /> : <Mail size={14} />}
                  variant={sent ? "outline" : "primary"}
                >
                  {sent ? "Invite Sent!" : "Send Invite"}
                </Button>
                <Button size="md" variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Members list */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Members</h3>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-white/4">
              {members.map((member) => {
                const cfg = roleConfig[member.role];
                const isOwner = member.id === "1";
                return (
                  <div key={member.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold font-[family-name:var(--font-syne)] shadow-[0_0_12px_rgba(255,107,53,0.25)] shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)] truncate">{member.name}</p>
                        {isOwner && (
                          <span className="flex items-center gap-1 text-[10px] text-yellow-400 font-semibold font-[family-name:var(--font-syne)]">
                            <Star size={9} fill="currentColor" /> Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={cfg.color}>
                        {cfg.label}
                      </Badge>
                      <span className="text-xs text-slate-600 hidden sm:block">Joined {member.joinedAt}</span>
                      {!isOwner && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {activeMenu === member.id && (
                            <div className="absolute right-0 top-8 w-44 rounded-xl border border-white/10 bg-[#0F1829] shadow-2xl z-10 overflow-hidden">
                              <div className="p-1">
                                <p className="px-3 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest font-[family-name:var(--font-syne)]">
                                  Change Role
                                </p>
                                {(["admin", "editor", "viewer"] as Role[]).map((role) => (
                                  <button
                                    key={role}
                                    onClick={() => changeRole(member.id, role)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                                      member.role === role
                                        ? "text-cyan-400 bg-cyan-500/10"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                  >
                                    {roleConfig[role].icon}
                                    {roleConfig[role].label}
                                    {member.role === role && <CheckCircle2 size={11} className="ml-auto" />}
                                  </button>
                                ))}
                                <div className="my-1 border-t border-white/5" />
                                <button
                                  onClick={() => removeMember(member.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                  <Trash2 size={12} />
                                  Remove Member
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-yellow-400" />
                <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Pending Invites</h3>
                <Badge variant="gold">{invites.length}</Badge>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-white/4">
                {invites.map((invite) => (
                  <div key={invite.email} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-9 h-9 rounded-full border border-dashed border-white/20 flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 font-medium truncate">{invite.email}</p>
                      <p className="text-xs text-slate-500">Invited {invite.sentAt}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={roleConfig[invite.role].color}>{roleConfig[invite.role].label}</Badge>
                      <button
                        onClick={() => removeInvite(invite.email)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Roles Reference */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Role Permissions</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["admin", "editor", "viewer"] as Role[]).map((role) => {
                const cfg = roleConfig[role];
                return (
                  <div key={role} className="rounded-xl border border-white/6 bg-white/2 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={cfg.color}>{cfg.label}</Badge>
                    </div>
                    <ul className="space-y-2">
                      {cfg.perms.map((perm) => (
                        <li key={perm} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="text-slate-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-400 leading-tight">{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Upgrade CTA (only on free plan) */}
        {!isPro && (
          <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/8 to-transparent p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto">
              <Users size={22} className="text-violet-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-[family-name:var(--font-syne)]">Collaborate with your team</p>
              <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Upgrade to Pro to invite editors, assign roles, and build a full content team around your faceless channel.
              </p>
            </div>
            <Link href="/dashboard/billing">
              <Button variant="coral" icon={<Crown size={14} />}>
                Upgrade to Pro
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
