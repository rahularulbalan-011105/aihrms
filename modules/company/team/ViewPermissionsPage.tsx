"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { roleBySlug, permissionCount, type ModuleKey, type PermissionModule } from "./data";

type PermTab = "All Permissions" | "Module Summary" | "Role Details";
const TABS: PermTab[] = ["All Permissions", "Module Summary", "Role Details"];

export default function ViewPermissionsPage({ roleSlug }: { roleSlug: string }) {
  const role = roleBySlug(roleSlug);
  const [tab, setTab] = useState<PermTab>("All Permissions");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<ModuleKey>>(new Set());

  const filteredModules = useMemo(() => {
    if (!role) return [];
    const term = search.trim().toLowerCase();
    if (!term) return role.modules;
    return role.modules
      .map((m) => ({ ...m, permissions: m.permissions.filter((p) => p.toLowerCase().includes(term)) }))
      .filter((m) => m.module.toLowerCase().includes(term) || m.permissions.length > 0);
  }, [role, search]);

  if (!role) {
    return (
      <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
        <Link href="/company/team/roles" className="text-[13px] font-semibold text-brand-600 hover:text-brand-800">← Back to Roles</Link>
        <div className="card mt-4 p-12 text-center text-ink-500 text-[13px]">Role not found.</div>
      </div>
    );
  }

  const total = permissionCount(role);
  const granted = total; // all mock permissions are granted
  const restricted = total - granted;

  const toggle = (key: ModuleKey) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mb-2">
        <Link href="/company/team" className="hover:text-brand-600 transition-colors">Team</Link>
        <span aria-hidden="true">›</span>
        <Link href="/company/team/roles" className="hover:text-brand-600 transition-colors">Roles &amp; Permissions</Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink-700 font-medium">View Permissions</span>
      </div>

      <Link href="/company/team/roles" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-ink-200 text-ink-700 text-[12.5px] font-semibold hover:bg-ink-100 transition mb-3">
        <ArrowLeft /> Back to Roles
      </Link>

      <h1 className="font-display font-extrabold text-[22px] text-ink-900 tracking-tight">View Permissions</h1>
      <p className="text-[13.5px] text-ink-500 mt-1 mb-5">
        Review all permissions and what the <span className="font-semibold text-ink-700">{role.name}</span> role can access and manage.
      </p>

      {/* Summary card */}
      <div className="card p-6 flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0"><UserPlusIcon /></span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-[16px] text-ink-900">{role.name}</h2>
              <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">{role.status}</span>
            </div>
            <p className="text-[12.5px] text-ink-500 mt-0.5 max-w-[360px]">{role.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Metric icon={<ShieldIcon />} iconBg="bg-brand-50 text-brand-600" value={total} label="Total Permissions" />
          <Metric icon={<CheckCircleIcon />} iconBg="bg-green-50 text-green-600" value={granted} label="Granted" />
          <Metric icon={<XCircleIcon />} iconBg="bg-red-50 text-red-500" value={restricted} label="Restricted" />
        </div>
      </div>

      {/* Tabs + search */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 border border-ink-200 rounded-xl min-w-[220px]">
            <SearchIcon />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search permission..." className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-700 placeholder:text-ink-400 outline-none" />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-200 text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors"><FunnelIcon /> Filter</button>
        </div>
      </div>

      {tab !== "All Permissions" ? (
        <div className="card mt-4 p-12 text-center text-ink-500 text-[13px]">{tab} — coming soon.</div>
      ) : (
        <div className="card overflow-hidden mt-4">
          <div className="grid grid-cols-[1.2fr_2.2fr_0.9fr] px-5 py-3 border-b border-ink-100 bg-ink-50/60 text-[12px] font-semibold text-ink-500">
            <div>Module</div>
            <div>Permissions</div>
            <div className="text-right">Access</div>
          </div>

          {filteredModules.length === 0 ? (
            <div className="py-14 text-center text-ink-500 text-[13px]">No permissions match your search.</div>
          ) : (
            filteredModules.map((m) => (
              <ModuleRow key={m.key} mod={m} open={expanded.has(m.key)} onToggle={() => toggle(m.key)} />
            ))
          )}
        </div>
      )}

      {/* About banner */}
      <div className="card mt-5 p-5 flex items-start gap-3">
        <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0"><InfoIcon /></span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-[14px] text-ink-900">About permissions</h3>
          <p className="text-[12.5px] text-ink-500 mt-0.5">Permissions define what actions team members can perform across different modules.</p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-800 transition-colors">
          Learn more about roles &amp; permissions <ExternalIcon />
        </button>
      </div>
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */
function Metric({ icon, iconBg, value, label }: { icon: React.ReactNode; iconBg: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${iconBg}`}>{icon}</span>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-[20px] text-ink-900">{value}</div>
        <div className="text-[11.5px] text-ink-500">{label}</div>
      </div>
    </div>
  );
}

function ModuleRow({ mod, open, onToggle }: { mod: PermissionModule; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-ink-100 last:border-0">
      <button onClick={onToggle} className="w-full grid grid-cols-[1.2fr_2.2fr_0.9fr] items-center px-5 py-4 text-left hover:bg-ink-50/40 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 ${mod.iconBg}`}><ModuleIcon name={mod.key} /></span>
          <div className="min-w-0">
            <div className="font-semibold text-ink-900 text-[13.5px] truncate">{mod.module}</div>
            <div className="text-[11.5px] text-ink-400">{mod.permissions.length} {mod.permissions.length === 1 ? "permission" : "permissions"}</div>
          </div>
        </div>
        <div className="text-[12.5px] text-ink-600 pr-4">{mod.permissions.join(", ")}</div>
        <div className="flex items-center justify-end gap-2">
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-600"><CheckCircleIcon small /> All Granted</span>
          <span className={`text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}><ChevronDown /></span>
        </div>
      </button>
      {open && (
        <ul className="px-5 pb-4 pl-[68px] grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mod.permissions.map((p) => (
            <li key={p} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-ink-50/60 text-[12.5px] text-ink-700">
              <span>{p}</span>
              <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-green-600"><CheckCircleIcon small /> Granted</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ModuleIcon({ name }: { name: ModuleKey }) {
  switch (name) {
    case "jobs": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" /></svg>);
    case "candidates": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c1.5-3.5 4-5 6-5s4.5 1.5 6 5M18 8v6M21 11h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
    case "clients": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
    case "applications": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
    case "interviews": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
    case "reports": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" /><path d="M7 16l3-4 3 2 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    case "settings": return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
  }
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function UserPlusIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c1.5-3.5 4-5 6-5s4.5 1.5 6 5M18 8v6M21 11h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ShieldIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function CheckCircleIcon({ small }: { small?: boolean }) { const s = small ? 13 : 18; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function XCircleIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function InfoIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function ArrowLeft() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChevronDown() { return (<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ExternalIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
