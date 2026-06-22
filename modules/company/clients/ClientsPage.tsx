"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import { StatCard } from "@/modules/company/jobs/components/StatCard";
import {
  listClients,
  type ClientSummaryResponse,
} from "./services/client.service";

interface Client {
  id: string;
  name: string;
  industry: string;
  accountManager: string;
  openJobs: number;
  lastActivity: string;
  status: "Active" | "Inactive" | "Prospect";
}

const STATUS_LABEL: Record<ClientSummaryResponse["status"], Client["status"]> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PROSPECT: "Prospect",
};

const COLUMNS = ["Client Name", "Industry", "Account Manager", "Open Jobs", "Last Activity", "Status", "Actions"];

const INDUSTRY_OPTIONS = ["All Industries", "Information Technology", "Finance & Banking", "Healthcare", "Manufacturing"];
const STATUS_OPTIONS = ["All", "Active", "Inactive", "Prospect"];
const ACCOUNT_MANAGER_OPTIONS = ["All", "Unassigned"];

function fmtDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function mapClient(raw: ClientSummaryResponse): Client {
  return {
    id: raw.id,
    name: raw.clientName,
    industry: raw.industry,
    accountManager: raw.accountManager?.trim() || "Unassigned",
    openJobs: raw.openJobs,
    lastActivity: fmtDate(raw.lastActivity),
    status: STATUS_LABEL[raw.status] ?? "Active",
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters / search (client-side — the list API has no search/filter params yet).
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [statusFilter, setStatusFilter] = useState("All");
  const [accountManager, setAccountManager] = useState("All");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return; // StrictMode double-invoke guard
    fetched.current = true;
    listClients(0, 100)
      .then(({ content }) => setClients(content.map(mapClient)))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load clients"))
      .finally(() => setLoading(false));
  }, []);

  // Stat cards reflect ALL clients, independent of the active filters.
  const total = clients.length;
  const active = clients.filter((c) => c.status === "Active").length;
  const inactive = clients.filter((c) => c.status === "Inactive").length;
  const prospects = clients.filter((c) => c.status === "Prospect").length;
  const openJobs = clients.reduce((sum, c) => sum + c.openJobs, 0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (term && !c.name.toLowerCase().includes(term) && !c.industry.toLowerCase().includes(term)) return false;
      if (industry !== "All Industries" && c.industry !== industry) return false;
      if (statusFilter !== "All" && c.status !== statusFilter) return false;
      if (accountManager !== "All" && c.accountManager !== accountManager) return false;
      return true;
    });
  }, [clients, search, industry, statusFilter, accountManager]);

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [search, industry, statusFilter, accountManager, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Newest clients (list arrives createdAt DESC) for the rail.
  const recentAdditions = clients.slice(0, 4);

  // Clients ranked by live open-job count (PUBLISHED jobs linked to the client).
  const topClients = [...clients]
    .filter((c) => c.openJobs > 0)
    .sort((a, b) => b.openJobs - a.openJobs)
    .slice(0, 5);
  const maxOpenJobs = topClients[0]?.openJobs ?? 0;

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Centre column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Clients</h1>
              <p className="text-ink-500 text-[13.5px] mt-1">Manage your client organizations and relationships.</p>
            </div>
            <Link
              href="/company/clients/new"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity"
            >
              <span className="text-[15px]">+</span> Add New Client
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard iconBg="bg-brand-50 text-brand-600" icon={<BuildingIcon />} label="Total Clients" value={String(total)} />
            <StatCard iconBg="bg-green-50 text-green-600" icon={<ShieldIcon />} label="Active Clients" value={String(active)} />
            <StatCard iconBg="bg-orange-50 text-orange-600" icon={<BriefIcon />} label="Open Jobs" value={String(openJobs)} />
          </div>

          {/* Filter bar */}
          <div className="card p-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by client name or industry..."
                className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none"
              />
            </div>
            <FilterSelect value={industry} onChange={setIndustry} options={INDUSTRY_OPTIONS} />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
            <FilterSelect value={accountManager} onChange={setAccountManager} options={ACCOUNT_MANAGER_OPTIONS} />
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="grid grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1fr_0.9fr_0.9fr] px-5 py-3 border-b border-ink-100 bg-ink-50/60">
              {COLUMNS.map((c) => (
                <div key={c} className="text-[12px] font-semibold text-ink-500">{c}</div>
              ))}
            </div>

            {loading ? (
              <div className="py-16 text-center text-ink-400 text-[13px]">Loading clients…</div>
            ) : error ? (
              <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>
            ) : total === 0 ? (
              <div className="py-14 flex flex-col items-center text-center px-6">
                <div className="w-28 h-28 rounded-full bg-brand-50/70 grid place-items-center mb-4 text-brand-300">
                  <BuildingLargeIcon />
                </div>
                <h2 className="font-display text-[18px] font-extrabold text-ink-900">No clients added yet</h2>
                <p className="text-ink-500 text-[13px] mt-1.5 max-w-[360px] leading-relaxed">
                  Get started by adding your first client organization. Once added, you can manage open jobs, track activity, and build stronger relationships.
                </p>
                <Link
                  href="/company/clients/new"
                  className="mt-5 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <span>+</span> Add New Client
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-14 text-center text-ink-500 text-[13px]">No clients match your filters.</div>
            ) : (
              <div>
                {pageRows.map((c) => <ClientRow key={c.id} client={c} />)}
              </div>
            )}

            {/* Footer */}
            {!loading && !error && filtered.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-ink-100">
                <span className="text-[12.5px] text-ink-500">
                  Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} clients
                </span>
                {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
                <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
                  Rows per page:
                  <div className="relative inline-flex items-center">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="appearance-none pl-3 pr-7 py-1.5 bg-ink-100/60 rounded-lg text-[12.5px] text-ink-700 outline-none border-0 cursor-pointer"
                    >
                      {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span className="absolute right-2.5 text-ink-400 pointer-events-none text-[10px]">▾</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-4 hidden lg:block">
          {/* Client Overview */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-[15px] text-ink-900 mb-4">Client Overview</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 shrink-0">
                <div
                  className="w-full h-full rounded-full"
                  style={{ background: total === 0 ? "#e5e7eb" : statusDonut(active, inactive, prospects, total) }}
                />
                <div className="absolute inset-[16px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="font-display font-extrabold text-[20px] text-ink-900 leading-none">{total}</span>
                  <span className="text-[9px] text-ink-500 font-medium mt-0.5">Total Clients</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {[
                  { label: "Active", count: active, color: "#22c55e" },
                  { label: "Inactive", count: inactive, color: "#f97316" },
                  { label: "Prospects", count: prospects, color: "#3b82f6" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-[11.5px] text-ink-600">{label}</span>
                    </div>
                    <span className="text-[11.5px] font-semibold text-ink-700">{count} ({total ? Math.round((count / total) * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Clients by Open Jobs */}
          {topClients.length === 0 ? (
            <EmptyRailCard
              title="Top Clients by Open Jobs"
              icon={<BriefIcon />}
              heading="No open jobs yet"
              sub="Post jobs linked to a client to see them ranked here."
            />
          ) : (
            <div className="card p-5">
              <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">Top Clients by Open Jobs</h3>
              <ul className="space-y-3">
                {topClients.map((c) => (
                  <li key={c.id}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[12.5px] font-semibold text-ink-800 truncate">{c.name}</span>
                      <span className="text-[12px] font-semibold text-brand-600 shrink-0">{c.openJobs} open</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${maxOpenJobs ? (c.openJobs / maxOpenJobs) * 100 : 0}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Client Additions */}
          {recentAdditions.length === 0 ? (
            <EmptyRailCard
              title="Recent Client Additions"
              icon={<UserPlusIcon />}
              heading="No recent clients"
              sub="Newly added clients will appear here."
            />
          ) : (
            <div className="card p-5">
              <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">Recent Client Additions</h3>
              <ul className="space-y-2.5">
                {recentAdditions.map((c) => (
                  <li key={c.id} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0 font-display font-bold text-[13px]">
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-900 truncate">{c.name}</div>
                      <div className="text-[11.5px] text-ink-500 truncate">{c.industry}</div>
                    </div>
                    <span className="text-[11px] text-ink-400 shrink-0">{c.lastActivity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-[15px] text-ink-900 mb-3">Quick Actions</h3>
            <ul className="space-y-1">
              <QuickAction href="/company/clients/new" icon={<UserPlusIcon />} label="Add New Client" />
              <QuickAction href="/company/clients" icon={<UsersIcon />} label="View All Clients" />
              <QuickAction href="/company/clients" icon={<ImportIcon />} label="Manage Import" />
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */
function ClientRow({ client }: { client: Client }) {
  return (
    <div className="grid grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1fr_0.9fr_0.9fr] items-center px-5 py-3 border-b border-ink-100 last:border-0 text-[13px] text-ink-700">
      <div className="font-semibold text-ink-900 truncate">{client.name}</div>
      <div className="truncate">{client.industry}</div>
      <div className="truncate">{client.accountManager}</div>
      <div>
        {client.openJobs > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
            {client.openJobs} open
          </span>
        ) : (
          <span className="text-ink-400">0</span>
        )}
      </div>
      <div className="truncate">{client.lastActivity}</div>
      <div>{client.status}</div>
      <div className="text-ink-400">⋯</div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 bg-ink-100/60 rounded-xl text-[13px] text-ink-600 outline-none border-0 cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}

/** Conic-gradient string for the status donut (Active / Inactive / Prospect). */
function statusDonut(active: number, inactive: number, prospects: number, total: number): string {
  if (total === 0) return "#e5e7eb";
  const a = (active / total) * 100;
  const i = a + (inactive / total) * 100;
  const p = i + (prospects / total) * 100;
  return `conic-gradient(#22c55e 0 ${a}%, #f97316 ${a}% ${i}%, #3b82f6 ${i}% ${p}%, #e5e7eb ${p}% 100%)`;
}

function EmptyRailCard({ title, icon, heading, sub }: { title: string; icon: React.ReactNode; heading: string; sub: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">{title}</h3>
        <button className="text-[12px] font-semibold text-brand-600 hover:text-brand-800 transition-colors">View All</button>
      </div>
      <div className="py-6 flex flex-col items-center text-center">
        <span className="w-12 h-12 rounded-full bg-brand-50 text-brand-300 grid place-items-center mb-2.5">{icon}</span>
        <div className="text-[13px] font-semibold text-ink-700">{heading}</div>
        <div className="text-[11.5px] text-ink-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-[13px] text-ink-700 hover:bg-ink-100 transition-colors">
        <span className="text-brand-600">{icon}</span>
        <span className="flex-1">{label}</span>
        <span className="text-ink-300"><ChevronRight /></span>
      </Link>
    </li>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function BuildingIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ShieldIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function BriefIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function BuildingLargeIcon() { return (<svg width="56" height="56" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" stroke="currentColor" strokeWidth="1.4" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function UsersIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function UserPlusIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c1.5-3.5 4-5 6-5s4.5 1.5 6 5M18 8v6M21 11h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ImportIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M8 11l4 4 4-4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function ChevronRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
