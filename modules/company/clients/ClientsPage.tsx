import Link from "next/link";

interface Client {
  id: string;
  name: string;
  industry: string;
  accountManager: string;
  openJobs: number;
  lastActivity: string;
  status: "Active" | "Inactive" | "Prospect";
}

// No clients backend yet — empty list renders the reference empty state.
const CLIENTS: Client[] = [];

const COLUMNS = ["Client Name", "Industry", "Account Manager", "Open Jobs", "Last Activity", "Status", "Actions"];

export default function ClientsPage() {
  const total = CLIENTS.length;
  const active = CLIENTS.filter((c) => c.status === "Active").length;
  const openJobs = CLIENTS.reduce((sum, c) => sum + c.openJobs, 0);

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
            <ClientStat iconBg="bg-brand-50 text-brand-600" icon={<BuildingIcon />} label="Total Clients" value={String(total)} sub={total ? `${total} total` : "No clients added yet"} />
            <ClientStat iconBg="bg-green-50 text-green-600" icon={<ShieldIcon />} label="Active Clients" value={String(active)} sub={active ? `${active} active` : "No active clients"} />
            <ClientStat iconBg="bg-orange-50 text-orange-600" icon={<BriefIcon />} label="Open Jobs" value={String(openJobs)} sub={openJobs ? `${openJobs} open` : "No open jobs"} />
          </div>

          {/* Filter bar */}
          <div className="card p-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
              <SearchIcon />
              <input type="text" placeholder="Search by client name or industry..." className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
            </div>
            <FilterSelect label="Industry" options={["All Industries", "Information Technology", "Finance & Banking", "Healthcare", "Manufacturing"]} />
            <FilterSelect label="Status" options={["All", "Active", "Inactive", "Prospect"]} />
            <FilterSelect label="Account Manager" options={["All", "Unassigned"]} />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
              <FunnelIcon /> Filter
            </button>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="grid grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1fr_0.9fr_0.9fr] px-5 py-3 border-b border-ink-100 bg-ink-50/60">
              {COLUMNS.map((c) => (
                <div key={c} className="text-[12px] font-semibold text-ink-500">{c}</div>
              ))}
            </div>

            {total === 0 ? (
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
            ) : (
              <div>
                {CLIENTS.map((c) => <ClientRow key={c.id} client={c} />)}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-ink-100">
              <span className="text-[12.5px] text-ink-500">Showing {total} of {total} clients</span>
              <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
                Rows per page:
                <div className="relative inline-flex items-center">
                  <select className="appearance-none pl-3 pr-7 py-1.5 bg-ink-100/60 rounded-lg text-[12.5px] text-ink-700 outline-none border-0 cursor-pointer" defaultValue="10">
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <span className="absolute right-2.5 text-ink-400 pointer-events-none text-[10px]">▾</span>
                </div>
              </div>
            </div>
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
                  style={{ background: total === 0 ? "#e5e7eb" : "conic-gradient(#22c55e 0% 0%, #e5e7eb 0% 100%)" }}
                />
                <div className="absolute inset-[16px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="font-display font-extrabold text-[20px] text-ink-900 leading-none">{total}</span>
                  <span className="text-[9px] text-ink-500 font-medium mt-0.5">Total Clients</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {[
                  { label: "Active", count: active, color: "#22c55e" },
                  { label: "Inactive", count: CLIENTS.filter((c) => c.status === "Inactive").length, color: "#f97316" },
                  { label: "Prospects", count: CLIENTS.filter((c) => c.status === "Prospect").length, color: "#3b82f6" },
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
          <EmptyRailCard
            title="Top Clients by Open Jobs"
            icon={<BriefIcon />}
            heading="No data available"
            sub="Add clients to see insights here."
          />

          {/* Recent Client Additions */}
          <EmptyRailCard
            title="Recent Client Additions"
            icon={<UserPlusIcon />}
            heading="No recent clients"
            sub="Newly added clients will appear here."
          />

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
function ClientStat({ iconBg, icon, label, value, sub }: { iconBg: string; icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="card px-4 py-3.5 flex items-center gap-3">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</span>
      <div className="leading-tight">
        <div className="text-[12px] text-ink-600 font-medium">{label}</div>
        <div className="font-display font-extrabold text-[22px] text-ink-900">{value}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function ClientRow({ client }: { client: Client }) {
  return (
    <div className="grid grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1fr_0.9fr_0.9fr] items-center px-5 py-3 border-b border-ink-100 last:border-0 text-[13px] text-ink-700">
      <div className="font-semibold text-ink-900 truncate">{client.name}</div>
      <div className="truncate">{client.industry}</div>
      <div className="truncate">{client.accountManager}</div>
      <div>{client.openJobs}</div>
      <div className="truncate">{client.lastActivity}</div>
      <div>{client.status}</div>
      <div className="text-ink-400">⋯</div>
    </div>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select className="appearance-none pl-3 pr-8 py-2 bg-ink-100/60 rounded-xl text-[13px] text-ink-600 outline-none border-0 cursor-pointer" defaultValue="">
        <option value="" disabled>{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
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
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function ChevronRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
