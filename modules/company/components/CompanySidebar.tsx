"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function CompanySidebar() {
  const pathname = usePathname() || "";

  const items: NavItem[] = [
    { href: "/company/dashboard",  label: "Dashboard",          icon: <DashboardIcon /> },
    { href: "/company/jobs/new",   label: "Jobs",               icon: <JobsIcon /> },
    { href: "/company/candidates", label: "Candidates",         icon: <UsersIcon /> },
    { href: "/company/clients",    label: "Clients",            icon: <BuildingIcon /> },
    { href: "/company/applications", label: "Applications",     icon: <DocIcon /> },
    { href: "/company/interviews", label: "Interviews",         icon: <CalendarIcon /> },
    { href: "/company/reports",    label: "Reports & Analytics", icon: <ChartIcon /> },
    { href: "/company/messages",   label: "Messages",           icon: <MessageIcon />, badge: "12" },
    { href: "/company/team",       label: "Team",               icon: <TeamIcon /> },
    { href: "/company/settings",   label: "Settings",           icon: <GearIcon /> },
  ];

  return (
    <aside className="w-[240px] shrink-0 border-r border-ink-100 bg-white flex flex-col">
      <nav className="flex-1 overflow-y-auto min-h-0 px-3.5 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== "/company/dashboard" && pathname.startsWith(it.href));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700 hover:bg-ink-100"
                  }`}
                >
                  <span className={active ? "text-brand-700" : "text-ink-500"}>{it.icon}</span>
                  <span className="flex-1">{it.label}</span>
                  {it.badge && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">{it.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3.5 pb-3 pt-2">
        <div className="rounded-xl p-3.5 text-white" style={{ background: "var(--gradient-brand)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold">Upgrade Your Plan</span>
            <span aria-hidden="true">👑</span>
          </div>
          <p className="text-[11px] opacity-90 mb-3 leading-snug">
            Unlock premium features and take your hiring to the next level.
          </p>
          <button className="w-full bg-white/95 text-brand-700 text-[12px] font-bold py-2 rounded-md inline-flex items-center justify-center gap-1.5 hover:bg-white transition">
            Upgrade Now <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="border-t border-ink-100 px-4 py-3">
        <button className="flex items-center gap-2.5 text-[13px] text-ink-600 hover:text-ink-900 transition">
          <HelpIcon /> Help & Support
        </button>
      </div>
    </aside>
  );
}

/* Icons */
function DashboardIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function JobsIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function UsersIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function BuildingIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function DocIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function CalendarIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function ChartIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6"/><path d="M7 16l3-4 3 2 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function MessageIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 0 1-12.5 6.7L3 20l1.3-5A8 8 0 1 1 21 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function TeamIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20c0-3 4-5 8-5s8 2 8 5" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function GearIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.8a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.4a7 7 0 0 0-2.1 1.2l-2.4-.8-2 3.4 2 1.6c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.6 2 3.4 2.4-.8c.7.5 1.4.9 2.1 1.2L10 21h4l.4-2.4c.7-.3 1.4-.7 2.1-1.2l2.4.8 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function HelpIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
