"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { usePlan } from "@/lib/hooks/use-plan";
import {
  Users, Crown, Lock, ArrowRight, UserPlus, Mail,
  MoreHorizontal, Shield, Eye, PenLine, Trash2,
  CheckCircle2, Clock, X, Star, Loader2, Send,
} from "lucide-react";

type Role = "admin" | "editor" | "viewer";

interface Member {
  id: string; name: string; email: string; role: Role;
  status: "active" | "pending"; joinedAt: string; avatar: string;
}

const roleConfig: Record<Role, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; perms: string[] }> = {
  admin: {
    label: "Admin", color: "#00D4FF", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.2)",
    icon: <Shield size={12} />,
    perms: ["Manage team & billing", "Create & edit all content", "View all analytics"],
  },
  editor: {
    label: "Editor", color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.2)",
    icon: <PenLine size={12} />,
    perms: ["Create & edit scripts", "Manage production board", "View shared content"],
  },
  viewer: {
    label: "Viewer", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)",
    icon: <Eye size={12} />,
    perms: ["View scripts & ideas", "View production board", "No editing access"],
  },
};

// Feature access by role
const roleAccess: Record<Role, string[]> = {
  admin: [
    "Full access to all features",
    "Write scripts & generate ideas",
    "Thumbnail Studio & Voiceover",
    "Niche Finder, Niche Bending, Similar Channels",
    "Production Board",
    "AI Consulting (Townshub AI)",
    "Team management & billing",
    "Analytics & Chrome Extension",
  ],
  editor: [
    "Write scripts & generate ideas",
    "Thumbnail Studio",
    "Production Board",
    "View Niche Finder & analytics",
    "Cannot manage billing or team",
    "No AI Consulting access",
  ],
  viewer: [
    "View scripts & ideas (read-only)",
    "View production board",
    "View shared content",
    "No editing, billing, or team access",
    "No AI Consulting access",
  ],
};

const S = {
  card: {
    borderRadius: 16, overflow: "hidden" as const,
    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
    border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16,
  } as React.CSSProperties,
  cardHeader: { padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" } as React.CSSProperties,
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none",
  } as React.CSSProperties,
  label: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 } as React.CSSProperties,
};

export default function TeamPage() {
  const { isPro, isElite } = usePlan();
  const canManageTeam = isPro || isElite;

  // Admin email — owner always has full access
  const OWNER_EMAIL = "townshub1@gmail.com";

  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Towns Hub", email: "townshub1@gmail.com", role: "admin", status: "active", joinedAt: "Apr 1, 2026", avatar: "T" },
  ]);
  const [invites, setInvites] = useState<{ email: string; role: Role; sentAt: string }[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [sent, setSent] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const maxMembers = isElite ? 10 : isPro ? 5 : 1;

  const handleInvite = async () => {
    if (!inviteEmail.trim() || inviting) return;
    setInviting(true);
    try {
      const res = await fetch("/api/team-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
          inviterName: "Towns Hub",
          inviterEmail: OWNER_EMAIL,
        }),
      });
      const data = await res.json();
      setEmailSent(!!data.emailSent);
      setInvites(prev => [...prev, { email: inviteEmail.trim(), role: inviteRole, sentAt: "Just now" }]);
      setInviteEmail("");
      setSent(true);
      setTimeout(() => { setSent(false); setShowInvite(false); setEmailSent(false); }, 3000);
    } catch {
      setInvites(prev => [...prev, { email: inviteEmail.trim(), role: inviteRole, sentAt: "Just now" }]);
      setInviteEmail("");
      setSent(true);
      setTimeout(() => { setSent(false); setShowInvite(false); }, 2000);
    } finally {
      setInviting(false);
    }
  };

  const removeInvite = (email: string) => setInvites(prev => prev.filter(i => i.email !== email));
  const changeRole = (id: string, role: Role) => { setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m)); setActiveMenu(null); };
  const removeMember = (id: string) => { setMembers(prev => prev.filter(m => m.id !== id)); setActiveMenu(null); };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar
        title="Team"
        subtitle="Manage your content team"
        action={canManageTeam ? { label: "Invite Member", icon: <UserPlus size={13} /> } : undefined}
      />

      <div style={{ padding: "28px 32px", maxWidth: 860, margin: "0 auto" }}>

        {/* Upgrade banner — only for non-Pro non-Elite users */}
        {!canManageTeam && (
          <div style={{
            display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
            borderRadius: 14, marginBottom: 24,
            background: "linear-gradient(135deg, rgba(250,204,21,0.07), rgba(251,146,60,0.04))",
            border: "1px solid rgba(250,204,21,0.18)",
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Crown size={18} color="#facc15" fill="#facc15" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fde68a", margin: "0 0 2px" }}>Team collaboration requires Pro or Elite</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Invite editors, assign roles, and manage your content team — all from one workspace.</p>
            </div>
            <Link href="/dashboard/billing" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9,
              background: "linear-gradient(135deg, #facc15, #f59e0b)", color: "#1a0a00",
              fontSize: 12, fontWeight: 800, textDecoration: "none", flexShrink: 0,
            }}>
              Upgrade to Pro <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Member count bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={15} color="#a78bfa" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>
                {members.length} member{members.length !== 1 ? "s" : ""}
                {invites.length > 0 && <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: "#94a3b8" }}>· {invites.length} pending</span>}
              </p>
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                {canManageTeam
                  ? `${members.length} / ${maxMembers} seats used`
                  : "Upgrade to add team members"}
              </p>
            </div>
          </div>
          {!canManageTeam ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#facc15", fontWeight: 600 }}>
              <Lock size={12} /> Pro feature
            </div>
          ) : (
            <button onClick={() => setShowInvite(true)} disabled={members.length >= maxMembers} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9,
              background: members.length >= maxMembers ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
              border: members.length >= maxMembers ? "1px solid rgba(255,255,255,0.08)" : "none",
              color: members.length >= maxMembers ? "#475569" : "#04080F",
              fontSize: 12, fontWeight: 700, cursor: members.length >= maxMembers ? "not-allowed" : "pointer",
            }}>
              <UserPlus size={13} /> {members.length >= maxMembers ? `Seat limit reached` : "Invite Member"}
            </button>
          )}
        </div>

        {/* Invite Form */}
        {showInvite && canManageTeam && (
          <div style={{ ...S.card, marginBottom: 16 }}>
            <div style={S.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={14} color="#00D4FF" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Invite Team Member</span>
                </div>
                <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                  <X size={15} />
                </button>
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Email Address</label>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleInvite()}
                  placeholder="colleague@example.com"
                  style={S.input}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Role</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(["admin", "editor", "viewer"] as Role[]).map(role => {
                    const cfg = roleConfig[role];
                    const active = inviteRole === role;
                    return (
                      <button key={role} onClick={() => setInviteRole(role)} style={{
                        display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                        borderRadius: 12, textAlign: "left", cursor: "pointer",
                        background: active ? cfg.bg : "rgba(255,255,255,0.02)",
                        border: active ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.07)",
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center",
                          justifyContent: "center", flexShrink: 0, marginTop: 1,
                          background: active ? cfg.bg : "rgba(255,255,255,0.05)",
                          color: active ? cfg.color : "#475569",
                        }}>
                          {cfg.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", display: "block", marginBottom: 2 }}>{cfg.label}</span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{cfg.perms.join(" · ")}</span>
                        </div>
                        {active && <CheckCircle2 size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: 3 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {sent && (
                <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={14} color="#34d399" />
                  <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>
                    {emailSent ? "Invite email sent successfully!" : "Invite recorded — add RESEND_API_KEY to send emails."}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || inviting}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "none",
                    background: sent ? "rgba(52,211,153,0.1)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                    color: sent ? "#34d399" : "#04080F", fontSize: 13, fontWeight: 700,
                    cursor: (!inviteEmail.trim() || inviting) ? "not-allowed" : "pointer",
                    outline: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
                    opacity: (!inviteEmail.trim() || inviting) ? 0.6 : 1,
                    minWidth: 130,
                  }}
                >
                  {inviting
                    ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
                    : sent
                    ? <><CheckCircle2 size={14} /> Invite Sent!</>
                    : <><Send size={14} /> Send Invite</>}
                </button>
                <button onClick={() => setShowInvite(false)} style={{
                  padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Members list */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Members</span>
            </div>
          </div>
          <div>
            {members.map((member, idx) => {
              const cfg = roleConfig[member.role];
              const isOwner = member.email === OWNER_EMAIL;
              return (
                <div key={member.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
                  borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: isOwner
                      ? "linear-gradient(135deg, #00D4FF, #0080cc)"
                      : "linear-gradient(135deg, #fb923c, #f97316)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 14, fontWeight: 700,
                    boxShadow: isOwner ? "0 0 12px rgba(0,212,255,0.25)" : "0 0 12px rgba(251,146,60,0.25)",
                  }}>
                    {member.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</p>
                      {isOwner && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#facc15", fontWeight: 700 }}>
                          <Star size={9} fill="#facc15" /> Owner
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{member.email}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>Joined {member.joinedAt}</span>
                    {!isOwner && canManageTeam && (
                      <div style={{ position: "relative" }}>
                        <button
                          onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                          style={{ padding: 6, borderRadius: 8, background: "transparent", border: "none", color: "#64748b", cursor: "pointer", display: "flex" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {activeMenu === member.id && (
                          <div style={{
                            position: "absolute", right: 0, top: 34, width: 176, borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.1)", background: "#0F1829",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 10, overflow: "hidden",
                          }}>
                            <div style={{ padding: 6 }}>
                              <p style={{ padding: "6px 10px", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Change Role</p>
                              {(["admin", "editor", "viewer"] as Role[]).map(role => {
                                const rc = roleConfig[role];
                                return (
                                  <button key={role} onClick={() => changeRole(member.id, role)} style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                                    border: "none", textAlign: "left",
                                    background: member.role === role ? rc.bg : "transparent",
                                    color: member.role === role ? rc.color : "#64748b",
                                  }}
                                    onMouseEnter={e => { if (member.role !== role) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e2e8f0"; } }}
                                    onMouseLeave={e => { if (member.role !== role) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
                                  >
                                    {rc.icon} {rc.label}
                                    {member.role === role && <CheckCircle2 size={11} style={{ marginLeft: "auto" }} />}
                                  </button>
                                );
                              })}
                              <div style={{ margin: "4px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                              <button onClick={() => removeMember(member.id)} style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 8,
                                padding: "8px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                                background: "transparent", border: "none", color: "#f87171", textAlign: "left",
                              }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                <Trash2 size={12} /> Remove Member
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
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={14} color="#facc15" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Pending Invites</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(250,204,21,0.1)", color: "#facc15", border: "1px solid rgba(250,204,21,0.2)" }}>{invites.length}</span>
              </div>
            </div>
            <div>
              {invites.map((invite, idx) => {
                const rc = roleConfig[invite.role];
                return (
                  <div key={invite.email} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                    borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={14} color="#475569" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{invite.email}</p>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Invited {invite.sentAt}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span>
                      <button onClick={() => removeInvite(invite.email)} style={{
                        padding: 6, borderRadius: 8, background: "transparent", border: "none", color: "#64748b", cursor: "pointer", display: "flex",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Role Permissions — expanded with feature access */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Role Permissions</span>
            </div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {(["admin", "editor", "viewer"] as Role[]).map(role => {
                const cfg = roleConfig[role];
                const access = roleAccess[role];
                const isAdmin = role === "admin";
                return (
                  <div key={role} style={{
                    borderRadius: 12, padding: "16px",
                    border: isAdmin ? "1px solid rgba(0,212,255,0.15)" : "1px solid rgba(255,255,255,0.06)",
                    background: isAdmin ? "rgba(0,212,255,0.03)" : "rgba(255,255,255,0.02)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: "inline-block" }}>{cfg.label}</span>
                      {isAdmin && <span style={{ fontSize: 9, fontWeight: 700, color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", padding: "1px 7px", borderRadius: 99 }}>FULL ACCESS</span>}
                    </div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                      {access.map(item => (
                        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                          <CheckCircle2
                            size={11}
                            color={isAdmin ? "#00D4FF" : role === "editor" ? "#facc15" : "#475569"}
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upgrade CTA — only for non-Pro */}
        {!canManageTeam && (
          <div style={{
            borderRadius: 16, border: "1px solid rgba(167,139,250,0.15)",
            background: "linear-gradient(135deg, rgba(167,139,250,0.07), transparent)",
            padding: "32px 24px", textAlign: "center",
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Users size={22} color="#a78bfa" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Collaborate with your team</p>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "0 auto 20px", maxWidth: 420 }}>
              Upgrade to Pro to invite up to 5 editors, or Elite for 10 seats with full AI Consulting access for your whole team.
            </p>
            <Link href="/dashboard/billing" style={{
              display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11,
              background: "linear-gradient(135deg, #facc15, #f59e0b)", color: "#1a0a00",
              fontSize: 13, fontWeight: 800, textDecoration: "none",
              boxShadow: "0 0 20px rgba(250,204,21,0.2)",
            }}>
              <Crown size={14} /> Upgrade to Pro <ArrowRight size={13} />
            </Link>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
