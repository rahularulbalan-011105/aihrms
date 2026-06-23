"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { StatCard } from "@/modules/company/jobs/components/StatCard";
import { Tooltip, ConfirmDialog } from "@/modules/auth/components/candidate-reg/shared/ui";
import { useConfirmDelete } from "@/modules/auth/components/candidate-reg/shared/hooks";
import {
  listTeamMembers,
  deleteTeamMember,
  type TeamMemberSummaryResponse,
} from "./services/team.service";

type Role = "Admin" | "Manager" | "Recruiter" | "Viewer";
type Status = "Active" | "Invited" | "Inactive";
type TeamTab = "Team Members" | "Roles & Permissions" | "Activity Log";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  accessScope: string;
  status: Status;
  lastActive: string;
}

interface Activity {
  id: string;
  who: string;
  what: string;
  when: string;
}

const TABS: TeamTab[] = ["Team Members", "Roles & Permissions", "Activity Log"];

const STATUS_LABEL: Record<TeamMemberSummaryResponse["status"], Status> = {
  ACTIVE: "Active",
  INVITED: "Invited",
  INACTIVE: "Inactive",
};

/** Backend stores the radio code; show a friendly label. */
const ACCESS_SCOPE_LABEL: Record<string, string> = {
  all: "All Clients & Jobs",
  clients: "Specific Clients",
  department: "Specific Department",
};

const KNOWN_ROLES: Role[] = ["Admin", "Manager", "Recruiter", "Viewer"];

function fmtLastActive(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function mapMember(raw: TeamMemberSummaryResponse): Member {
  const role = (KNOWN_ROLES.includes(raw.role as Role) ? raw.role : "Recruiter") as Role;
  return {
    id: raw.id,
    name: raw.fullName,
    email: raw.email,
    role,
    department: raw.department?.trim() || "—",
    accessScope: raw.accessScope ? ACCESS_SCOPE_LABEL[raw.accessScope] ?? raw.accessScope : "—",
    status: STATUS_LABEL[raw.status] ?? "Active",
    lastActive: fmtLastActive(raw.lastActivity),
  };
}

// Activity domain doesn't exist yet — Recent Activity renders its empty state.
const ACTIVITY: Activity[] = [];

const PAGE_SIZE_DEFAULT = 10;
const ROLE_OPTIONS = ["All Roles", "Admin", "Manager", "Recruiter", "Viewer"];
const STATUS_OPTIONS = ["All Status", "Active", "Invited", "Inactive"];

const ROLE_BADGE: Record<Role, string> = {
  Admin: "bg-brand-50 text-brand-700",
  Manager: "bg-blue-50 text-blue-700",
  Recruiter: "bg-green-50 text-green-700",
  Viewer: "bg-ink-100 text-ink-600",
};
const STATUS_BADGE: Record<Status, string> = {
  Active: "bg-green-50 text-green-700",
  Invited: "bg-blue-50 text-blue-700",
  Inactive: "bg-red-50 text-red-600",
};
const AVATAR_COLORS = ["bg-brand-100 text-brand-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-orange-100 text-orange-700", "bg-pink-100 text-pink-700"];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function TeamPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TeamTab>("Team Members");
  const goToRoles = () => router.push("/company/team/roles");
  const goToAdd = () => router.push("/company/team/new");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { confirm, triggerDelete, resetConfirm } = useConfirmDelete();

  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return; // StrictMode double-invoke guard
    fetched.current = true;
    listTeamMembers(0, 100)
      .then(({ content }) => setMembers(content.map(mapMember)))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load team members"))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (id: string) => router.push(`/company/team/${id}/edit`);

  const handleDelete = (member: Member) =>
    triggerDelete(`Delete "${member.name}"?`, async () => {
      await deleteTeamMember(member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
      resetConfirm();
    });

  const total = members.length;
  const active = members.filter((m) => m.status === "Active").length;
  const invited = members.filter((m) => m.status === "Invited").length;
  const inactive = members.filter((m) => m.status === "Inactive").length;

  const roleCounts = useMemo(() => {
    const counts = { Admin: 0, Manager: 0, Recruiter: 0, Viewer: 0 } as Record<Role, number>;
    for (const m of members) counts[m.role] += 1;
    return counts;
  }, [members]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return members.filter((m) => {
      if (term && !m.name.toLowerCase().includes(term) && !m.email.toLowerCase().includes(term) && !m.role.toLowerCase().includes(term)) return false;
      if (roleFilter !== "All Roles" && m.role !== roleFilter) return false;
      if (statusFilter !== "All Status" && m.status !== statusFilter) return false;
      return true;
    });
  }, [members, search, roleFilter, statusFilter]);

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((m) => selected.has(m.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageRows.forEach((m) => next.delete(m.id));
      else pageRows.forEach((m) => next.add(m.id));
      return next;
    });

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Centre column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Teams</h1>
              <p className="text-ink-500 text-[13.5px] mt-1">Manage your team members and their access permissions.</p>
            </div>
            <button onClick={goToAdd} className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity">
              <span className="text-[15px]">+</span> Add Team Member
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 flex-wrap border-b border-ink-100">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => (t === "Roles & Permissions" ? goToRoles() : setTab(t))}
                className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                  tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab !== "Team Members" ? (
            <div className="card p-12 text-center text-ink-500 text-[13px]">
              {tab} — coming soon.
            </div>
          ) : (
            <>
              {/* Stat tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard iconBg="bg-brand-50 text-brand-600" icon={<UserPlusIcon />} label="Total Members" value={String(total)} />
                <StatCard iconBg="bg-green-50 text-green-600" icon={<ShieldIcon />} label="Active Members" value={String(active)} />
                <StatCard iconBg="bg-blue-50 text-blue-600" icon={<UserPlusIcon />} label="Invited" value={String(invited)} />
                <StatCard iconBg="bg-orange-50 text-orange-600" icon={<LockIcon />} label="Inactive" value={String(inactive)} />
              </div>

              {/* Filter bar */}
              <div className="card p-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
                  <SearchIcon />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team member by name, email or role..." className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
                </div>
                <FilterSelect value={roleFilter} onChange={setRoleFilter} options={ROLE_OPTIONS} />
                <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-200 text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
                  <FunnelIcon /> Filter
                </button>
              </div>

              {/* Table / empty state */}
              <div className="card overflow-hidden">
                {loading ? (
                  <div className="py-16 text-center text-ink-400 text-[13px]">Loading team…</div>
                ) : error ? (
                  <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>
                ) : total === 0 ? (
                  <EmptyTeam onAdd={goToAdd} />
                ) : filtered.length === 0 ? (
                  <div className="py-14 text-center text-ink-500 text-[13px]">No team members match your filters.</div>
                ) : (
                  <>
                    <div className="grid grid-cols-[32px_1.6fr_0.9fr_1fr_1.3fr_0.8fr_1fr_72px] items-center px-5 py-3 border-b border-ink-100 bg-ink-50/60 text-[12px] font-semibold text-ink-500">
                      <input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} aria-label="Select all" className="w-4 h-4 rounded accent-brand-600" />
                      <div>Member</div>
                      <div>Role</div>
                      <div>Department</div>
                      <div>Access Scope</div>
                      <div>Status</div>
                      <div>Last Active</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {pageRows.map((m) => (
                      <MemberRow key={m.id} member={m} checked={selected.has(m.id)} onToggle={() => toggleRow(m.id)} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-ink-100">
                      <span className="text-[12.5px] text-ink-500">
                        Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} members
                      </span>
                      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                      <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
                        Rows per page:
                        <div className="relative inline-flex items-center">
                          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }} className="appearance-none pl-3 pr-7 py-1.5 bg-ink-100/60 rounded-lg text-[12.5px] text-ink-700 outline-none border-0 cursor-pointer">
                            {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                          <span className="absolute right-2.5 text-ink-400 pointer-events-none text-[10px]">▾</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-4 hidden lg:block">
          {/* Team Overview */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-[15px] text-ink-900 mb-4">Team Overview</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 shrink-0">
                <div className="w-full h-full rounded-full" style={{ background: total === 0 ? "#e5e7eb" : overviewDonut(active, invited, inactive, total) }} />
                <div className="absolute inset-[16px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="font-display font-extrabold text-[20px] text-ink-900 leading-none">{total}</span>
                  <span className="text-[9px] text-ink-500 font-medium mt-0.5">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {[
                  { label: "Active", count: active, color: "#22c55e" },
                  { label: "Invited", count: invited, color: "#3b82f6" },
                  { label: "Inactive", count: inactive, color: "#f97316" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-[11.5px] text-ink-600">{label}</span>
                    </div>
                    <span className="text-[11.5px] font-semibold text-ink-700">{count} ({total ? ((count / total) * 100).toFixed(1) : "0"}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roles Distribution */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-[15px] text-ink-900">Roles Distribution</h3>
              {total > 0 && <button onClick={goToRoles} className="text-[12px] font-semibold text-brand-600 hover:text-brand-800 transition-colors">View all</button>}
            </div>
            {total === 0 ? (
              <div className="py-6 flex flex-col items-center text-center">
                <span className="w-12 h-12 rounded-full bg-brand-50 text-brand-300 grid place-items-center mb-2.5"><ShieldIcon /></span>
                <div className="text-[13px] font-semibold text-ink-700">No roles created yet</div>
                <div className="text-[11.5px] text-ink-400 mt-0.5 max-w-[210px]">Create roles to define responsibilities and manage access.</div>
                <button onClick={goToRoles} className="mt-4 px-4 py-2 rounded-lg border border-brand-200 text-brand-700 text-[12.5px] font-semibold hover:bg-brand-50 transition-colors">
                  Go to Roles &amp; Permissions
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {(Object.keys(roleCounts) as Role[]).map((role) => (
                  <li key={role} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] text-ink-700">
                      <span className={`w-6 h-6 rounded-md grid place-items-center ${ROLE_BADGE[role]}`}><ShieldIcon small /></span>
                      {role}
                    </span>
                    <span className="text-[13px] font-semibold text-ink-900">{roleCounts[role]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-[15px] text-ink-900">Recent Activity</h3>
              {ACTIVITY.length > 0 && total > 0 && <button className="text-[12px] font-semibold text-brand-600 hover:text-brand-800 transition-colors">View all</button>}
            </div>
            {total === 0 || ACTIVITY.length === 0 ? (
              <div className="py-6 flex flex-col items-center text-center">
                <span className="w-12 h-12 rounded-full bg-brand-50 text-brand-300 grid place-items-center mb-2.5"><ClipboardIcon /></span>
                <div className="text-[13px] font-semibold text-ink-700">No recent activity</div>
                <div className="text-[11.5px] text-ink-400 mt-0.5 max-w-[210px]">Team activities will appear here once you start adding members.</div>
              </div>
            ) : (
              <ul className="space-y-3.5">
                {ACTIVITY.map((a) => (
                  <li key={a.id} className="flex items-start gap-2.5">
                    <span className={`w-8 h-8 rounded-full grid place-items-center shrink-0 text-[11px] font-bold ${avatarColor(a.who)}`}>{initials(a.who)}</span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] text-ink-700 leading-snug">
                        <span className="font-semibold text-ink-900">{a.who}</span> {a.what}
                      </p>
                      <span className="text-[11px] text-ink-400">{a.when}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {confirm.open && (
        <ConfirmDialog label={confirm.label} onConfirm={confirm.onConfirm} onCancel={resetConfirm} />
      )}
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */
function MemberRow({ member, checked, onToggle, onEdit, onDelete }: { member: Member; checked: boolean; onToggle: () => void; onEdit: (id: string) => void; onDelete: (member: Member) => void }) {
  return (
    <div className="grid grid-cols-[32px_1.6fr_0.9fr_1fr_1.3fr_0.8fr_1fr_72px] items-center px-5 py-3 border-b border-ink-100 last:border-0 text-[13px] text-ink-700">
      <input type="checkbox" checked={checked} onChange={onToggle} aria-label={`Select ${member.name}`} className="w-4 h-4 rounded accent-brand-600" />
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 text-[12px] font-bold ${avatarColor(member.name)}`}>{initials(member.name)}</span>
        <div className="min-w-0">
          <div className="font-semibold text-ink-900 truncate">{member.name}</div>
          <div className="text-[12px] text-ink-400 truncate">{member.email}</div>
        </div>
      </div>
      <div><span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE[member.role]}`}>{member.role}</span></div>
      <div className="truncate">{member.department}</div>
      <div className="flex items-center gap-1.5 min-w-0 text-ink-600"><span className="text-ink-400 shrink-0"><UsersMiniIcon /></span><span className="truncate">{member.accessScope}</span></div>
      <div><span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[member.status]}`}>{member.status}</span></div>
      <div className="text-[12.5px] text-ink-500 truncate">{member.lastActive}</div>
      <div className="flex items-center justify-end gap-1">
        <RowAction label="Edit" onClick={() => onEdit(member.id)} className="text-ink-400 hover:text-brand-600 hover:bg-brand-50">
          <EditIcon />
        </RowAction>
        <RowAction label="Delete" onClick={() => onDelete(member)} className="text-ink-400 hover:text-red-600 hover:bg-red-50">
          <TrashIcon />
        </RowAction>
      </div>
    </div>
  );
}

function RowAction({ label, onClick, className, children }: { label: string; onClick?: () => void; className?: string; children: React.ReactNode }) {
  return (
    <Tooltip label={label}>
      <button type="button" onClick={onClick} aria-label={label} className={`w-7 h-7 grid place-items-center rounded-lg transition-colors ${className ?? ""}`}>
        {children}
      </button>
    </Tooltip>
  );
}

function EmptyTeam({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center text-center px-6">
      <div className="relative w-40 h-40 rounded-full bg-brand-50/60 grid place-items-center mb-2 text-brand-400">
        <UsersLargeIcon />
        <span className="absolute bottom-6 right-10 w-8 h-8 rounded-full bg-brand-100 text-brand-600 grid place-items-center text-[16px] font-bold">+</span>
      </div>
      <h2 className="font-display text-[18px] font-extrabold text-ink-900">Your team is ready to grow!</h2>
      <p className="text-ink-500 text-[13px] mt-1.5 max-w-[380px] leading-relaxed">
        Get started by adding your first team member. Invite your team and collaborate seamlessly.
      </p>
      <button onClick={onAdd} className="mt-5 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity inline-flex items-center gap-2">
        <span>+</span> Add Team Member
      </button>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-ink-100/60 rounded-xl text-[13px] text-ink-600 outline-none border-0 cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}

/** Conic-gradient for the Team Overview donut (Active / Invited / Inactive). */
function overviewDonut(active: number, invited: number, inactive: number, total: number): string {
  if (total === 0) return "#e5e7eb";
  const a = (active / total) * 100;
  const i = a + (invited / total) * 100;
  const n = i + (inactive / total) * 100;
  return `conic-gradient(#22c55e 0 ${a}%, #3b82f6 ${a}% ${i}%, #f97316 ${i}% ${n}%, #e5e7eb ${n}% 100%)`;
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function UserPlusIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c1.5-3.5 4-5 6-5s4.5 1.5 6 5M18 8v6M21 11h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ShieldIcon({ small }: { small?: boolean }) { const s = small ? 13 : 18; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function LockIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function UsersMiniIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function UsersLargeIcon() { return (<svg width="68" height="68" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" /><circle cx="16" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.3" /><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M14.5 19c0-2 1.8-3.3 3.5-3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function ClipboardIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M9 4V3h6v1" stroke="currentColor" strokeWidth="1.4" /><path d="M9 10h6M9 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function EditIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2 2 0 0 0-3-3L5 17v3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function TrashIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
