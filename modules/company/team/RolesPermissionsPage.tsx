"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import { ROLES, permissionCount, totalPermissionsAcross, type RoleDef } from "./data";

const PAGE_SIZE_DEFAULT = 10;
const COLUMNS = ["Role Name", "Description", "Permissions", "Members", "Status", "Last Updated", "Actions"];

export default function RolesPermissionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);

  const totalRoles = ROLES.length;
  const totalPermissions = totalPermissionsAcross();
  const restrictedPermissions = 0;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ROLES;
    return ROLES.filter((r) => r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term));
  }, [search]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mb-2">
        <Link href="/company/team" className="hover:text-brand-600 transition-colors">Team</Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink-700 font-medium">Roles &amp; Permissions</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-[22px] text-ink-900 tracking-tight">Roles &amp; Permissions</h1>
          <p className="text-[13.5px] text-ink-500 mt-1">Create roles to define responsibilities and control access across your agency.</p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity">
          <span className="text-[15px]">+</span> Create Role
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <StatTile iconBg="bg-brand-50 text-brand-600" icon={<UserPlusIcon />} label="Total Roles" value={totalRoles} sub="Active roles" />
        <StatTile iconBg="bg-green-50 text-green-600" icon={<ShieldIcon />} label="Total Permissions" value={totalPermissions} sub="Permissions configured" />
        <StatTile iconBg="bg-orange-50 text-orange-600" icon={<LockIcon />} label="Restricted Permissions" value={restrictedPermissions} sub="Permissions restricted" />
      </div>

      {/* All Roles tab */}
      <div className="mt-6 border-b border-ink-100">
        <button className="px-3.5 py-2.5 text-[13px] font-semibold border-b-2 border-brand-600 text-brand-700 -mb-px">All Roles</button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] px-3 py-2.5 border border-ink-200 rounded-xl">
          <SearchIcon />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles by name..." className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
          <FunnelIcon /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden mt-4">
        <div className="grid grid-cols-[1fr_2fr_1fr_0.9fr_0.8fr_1.2fr_0.6fr] px-5 py-3 border-b border-ink-100 text-[12px] font-semibold text-ink-500">
          {COLUMNS.map((c, i) => <div key={c} className={i === COLUMNS.length - 1 ? "text-right" : ""}>{c}</div>)}
        </div>

        {pageRows.length === 0 ? (
          <div className="py-14 text-center text-ink-500 text-[13px]">No roles match your search.</div>
        ) : (
          pageRows.map((r) => <RoleRow key={r.id} role={r} />)
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-ink-100">
            <span className="text-[12.5px] text-ink-500">
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} roles
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
        )}
      </div>

      {/* About banner */}
      <div className="card mt-5 p-5 flex items-start gap-3">
        <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0"><InfoIcon /></span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-[14px] text-ink-900">About roles &amp; permissions</h3>
          <p className="text-[12.5px] text-ink-500 mt-0.5">Create roles based on responsibilities and assign permissions to control what team members can access and manage.</p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-600 hover:text-brand-800 transition-colors">
          Learn more about roles &amp; permissions <ArrowRight />
        </button>
      </div>
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */
function StatTile({ iconBg, icon, label, value, sub }: { iconBg: string; icon: React.ReactNode; label: string; value: number; sub: string }) {
  return (
    <div className="card p-5">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</span>
      <div className="text-[12.5px] text-ink-600 font-medium mt-3">{label}</div>
      <div className="font-display font-extrabold text-[24px] text-ink-900 leading-tight">{value}</div>
      <div className="text-[11.5px] text-ink-400 mt-0.5">{sub}</div>
    </div>
  );
}

function RoleRow({ role }: { role: RoleDef }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr_0.9fr_0.8fr_1.2fr_0.6fr] items-center px-5 py-4 border-b border-ink-100 last:border-0 text-[13px] text-ink-700">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0"><UserPlusIcon /></span>
        <span className="font-semibold text-ink-900 truncate">{role.name}</span>
      </div>
      <div className="text-[12.5px] text-ink-600 leading-snug pr-4">{role.description}</div>
      <div>
        <div className="text-[13px] font-semibold text-ink-900">{permissionCount(role)} <span className="font-normal text-ink-500">permissions</span></div>
        <Link href={`/company/team/roles/${role.id}/permissions`} className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-800 transition-colors"><EyeIcon /> View Permissions</Link>
      </div>
      <div className="flex items-center gap-1.5 text-ink-700"><span className="text-ink-400"><UsersMiniIcon /></span><span className="font-semibold">{role.members}</span> <span className="text-ink-500">members</span></div>
      <div><span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">{role.status}</span></div>
      <div className="text-[12.5px]"><div className="text-ink-700">{role.updatedOn}</div><div className="text-ink-400">by {role.updatedBy}</div></div>
      <div className="text-right"><button aria-label="Role actions" className="text-ink-400 hover:text-ink-700 transition w-8 h-8 grid place-items-center">⋯</button></div>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function UserPlusIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c1.5-3.5 4-5 6-5s4.5 1.5 6 5M18 8v6M21 11h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ShieldIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function LockIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function UsersMiniIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function EyeIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function InfoIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function ArrowRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
