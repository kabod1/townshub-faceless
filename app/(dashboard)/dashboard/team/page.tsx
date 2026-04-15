"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Users, Crown, Lock, ArrowRight, UserPlus, Mail,
  MoreHorizontal, Shield, Eye, PenLine, Trash2,
  CheckCircle2, Clock, X, Star,
} from "lucide-react";

type Role = "admin" | "editor" | "viewer";

interface Member {
  id: string; name: string; email: string; role: Role;
  status: "active" | "pending"; joinedAt: string; avatar: string;
}

const ROLE: Record<Role, { label: string; color: string; bg: string; border: string; perms: string[] }> = {
  admin:  { label: "Admin",  color: "#00D4FF", bg: "rgba(0,212,255,0.1)",   border: "rgba(0,212,255,0.2)",   perms: ["Manage team & billing", "Create & edit all content", "View all analytics"] },
  editor: { label: "Editor", color: "#facc15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.2)",  perms: ["Create & edit scripts", "Manage production board", "View shared content"] },
  viewer: { label: "Viewer", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", perms: ["View scripts & ideas", "View production board", "No editing access"] },
};

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  admin:  <Shield size={12} />,
  editor: <PenLine size={12} />,
  viewer: <Eye size={12} />,
};

const INITIAL_MEMBERS: Member[] = [
  { id: "1", name: "Towns Hub", email: "townshub1@gmail.com", role: "admin", status: "active", joinedAt: "Apr 1, 2026", avatar: "T" },
];

const card: React.CSSProperties = {
  borderRadius: 16, overflow: "hidden",
  background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
  border: "1px solid rgba(255,255,255,0.07)",
  marginBottom: 18,
};
const cardHeader = (extra?: React.CSSProperties): React.CSSProperties => ({
  padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", ...extra,
});
const cardBody: React.CSSProperties = { padding: "20px 22px" };

export default function TeamPage() {
  const isPro = false;

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [invites, setInvites] = useState<{ email: string; role: Role; sentAt: string }[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [sent, setSent] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInvites(prev => [...prev, { email: inviteEmail.trim(), role: inviteRole, sentAt: "Just now" }]);
    setInviteEmail("");
    setSent(true);
    setTimeout(() => { setSent(false); setShowInvite(false); }, 2000);
  };

  const changeRole = (id: string, role: Role) => { setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m)); setActiveMenu(null); };
  const removeMember = (id: string) => { setMembers(prev => prev.filter(m => m.id !== id)); setActiveMenu(null); };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Team" subtitle="Manage your content team and permissions" />

      <div style={{ padding: "28px 32px", maxWidth: 860, margin: "0 auto" }}>

        {/* Pro gate banner */}
        {!isPro && (
          <div style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
            borderRadius: 14, marginBottom: 22,
            background: "linear-gradient(to right, rgba(250,204,21,0.06), rgba(251,146,60,0.04))",
            border: "1px solid rgba(250,204,21,0.18)",
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(250,204,21,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Crown size={18} color="#facc15" fill="#facc15" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fde68a", margin: "0 0 2px" }}>Team collaboration requires Pro or Elite</p>
              <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>Invite editors, assign roles, and manage your content team — all from one workspace.</p>
            </div>
            <Link href="/dashboard/billing" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f97316, #dc2626)",
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              }}>
                Upgrade to Pro <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        )}

        {/* Member count row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} color="#a78bfa" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 2px" }}>
                {members.length} member{members.length !== 1 ? "s" : ""}
                {invites.length > 0 && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "#475569" }}>· {invites.length} pending invite{invites.length !== 1 ? "s" : ""}</span>}
              </p>
              <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>{isPro ? "Up to 5 members on Pro" : "Upgrade to add team members"}</p>
            </div>
          </div>
          {!isPro ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Lock size={11} color="#facc15" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#facc15" }}>Pro feature</span>
            </div>
          ) : (
            <button onClick={() => setShowInvite(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "1px solid rgba(0,212,255,0.2)", background: "rgba(0,212,255,0.08)", color: "#00D4FF", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <UserPlus size={13} /> Invite Member
            </button>
          )}
        </div>

        {/* Invite form */}
        {showInvite && (
          <div style={{ ...card, marginBottom: 20, border: "1px solid rgba(0,212,255,0.18)" }}>
            <div style={cardHeader()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={14} color="#00D4FF" />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Invite Team Member</p>
                </div>
                <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4 }}>
                  <X size={15} />
                </button>
              </div>
            </div>
            <div style={cardBody}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Email Address</p>
                <div style={{ position: "relative" }}>
                  <Mail size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleInvite()}
                    placeholder="colleague@example.com"
                    style={{ ...inputStyle, paddingLeft: 34 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Role</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {(["admin", "editor", "viewer"] as Role[]).map(role => {
                    const cfg = ROLE[role];
                    const active = inviteRole === role;
                    return (
                      <button key={role} onClick={() => setInviteRole(role)} style={{
                        display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 11,
                        border: active ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.07)",
                        background: active ? cfg.bg : "rgba(255,255,255,0.02)",
                        cursor: "pointer", textAlign: "left", width: "100%",
                      }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: active ? cfg.bg : "rgba(255,255,255,0.05)", color: active ? cfg.color : "#475569" }}>
                          {ROLE_ICONS[role]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: active ? cfg.color : "#94a3b8", margin: "0 0 2px" }}>{cfg.label}</p>
                          <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>{cfg.perms.join(" · ")}</p>
                        </div>
                        {active && <CheckCircle2 size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none",
                    background: sent ? "rgba(52,211,153,0.1)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                    color: sent ? "#34d399" : "#04080F", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    outline: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
                  }}
                >
                  {sent ? <><CheckCircle2 size={14} /> Invite Sent!</> : <><Mail size={14} /> Send Invite</>}
                </button>
                <button onClick={() => setShowInvite(false)} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members list */}
        <div style={card}>
          <div style={cardHeader()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={14} color="#00D4FF" />
              <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Members</p>
            </div>
          </div>
          <div>
            {members.map((member, idx) => {
              const cfg = ROLE[member.role];
              const isOwner = member.id === "1";
              return (
                <div key={member.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 22px",
                  borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0, boxShadow: "0 0 12px rgba(249,115,22,0.25)" }}>
                    {member.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</p>
                      {isOwner && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#facc15", fontWeight: 700 }}>
                          <Star size={9} fill="#facc15" /> Owner
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: "#475569", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.email}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                    <span style={{ fontSize: 11, color: "#334155" }}>Joined {member.joinedAt}</span>
                    {!isOwner && (
                      <div style={{ position: "relative" }}>
                        <button onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)} style={{ padding: 6, borderRadius: 7, background: "none", border: "none", cursor: "pointer", color: "#334155", display: "flex" }}>
                          <MoreHorizontal size={14} />
                        </button>
                        {activeMenu === member.id && (
                          <div style={{ position: "absolute", right: 0, top: 32, width: 160, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "#0F1829", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", zIndex: 10, overflow: "hidden" }}>
                            <div style={{ padding: 6 }}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 10px 6px" }}>Change Role</p>
                              {(["admin", "editor", "viewer"] as Role[]).map(role => (
                                <button key={role} onClick={() => changeRole(member.id, role)} style={{
                                  width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 8,
                                  background: member.role === role ? "rgba(0,212,255,0.08)" : "transparent", border: "none",
                                  color: member.role === role ? "#00D4FF" : "#64748b", fontSize: 12, cursor: "pointer",
                                }}>
                                  {ROLE_ICONS[role]} {ROLE[role].label}
                                  {member.role === role && <CheckCircle2 size={11} style={{ marginLeft: "auto" }} />}
                                </button>
                              ))}
                              <div style={{ margin: "6px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }} />
                              <button onClick={() => removeMember(member.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 8, background: "transparent", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer" }}>
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
          <div style={card}>
            <div style={cardHeader()}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={14} color="#facc15" />
                <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Pending Invites</p>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(250,204,21,0.1)", color: "#facc15", border: "1px solid rgba(250,204,21,0.2)" }}>{invites.length}</span>
              </div>
            </div>
            <div>
              {invites.map((invite, idx) => {
                const cfg = ROLE[invite.role];
                return (
                  <div key={invite.email} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={14} color="#334155" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{invite.email}</p>
                      <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Invited {invite.sentAt}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                      <button onClick={() => setInvites(prev => prev.filter(i => i.email !== invite.email))} style={{ background: "none", border: "none", cursor: "pointer", color: "#334155", padding: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                        onMouseLeave={e => e.currentTarget.style.color = "#334155"}>
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Role Permissions */}
        <div style={card}>
          <div style={cardHeader()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={14} color="#00D4FF" />
              <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Role Permissions</p>
            </div>
          </div>
          <div style={{ ...cardBody, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {(["admin", "editor", "viewer"] as Role[]).map(role => {
              const cfg = ROLE[role];
              return (
                <div key={role} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: "inline-block", marginBottom: 12 }}>{cfg.label}</span>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                    {cfg.perms.map(perm => (
                      <li key={perm} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                        <CheckCircle2 size={12} color="#334155" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.4 }}>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        {!isPro && (
          <div style={{ textAlign: "center", padding: "40px 20px", borderRadius: 16, background: "linear-gradient(135deg, rgba(167,139,250,0.06), transparent)", border: "1px solid rgba(167,139,250,0.12)" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Users size={22} color="#a78bfa" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", margin: "0 0 8px" }}>Collaborate with your team</p>
            <p style={{ fontSize: 13, color: "#475569", margin: "0 0 22px", maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Upgrade to Pro to invite editors, assign roles, and build a full content team around your faceless channel.
            </p>
            <Link href="/dashboard/billing" style={{ textDecoration: "none" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #f97316, #dc2626)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                <Crown size={14} fill="#fff" /> Upgrade to Pro <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
