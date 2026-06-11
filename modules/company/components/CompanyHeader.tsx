"use client";

import Link from "next/link";
import BrandLogo from "@/components/marketing/BrandLogo";

export default function CompanyHeader() {
  return (
    <header className="h-[72px] shrink-0 border-b border-ink-100 bg-white flex items-center px-6 gap-6">
      <Link href="/company/dashboard" className="shrink-0">
        <BrandLogo size="md" />
      </Link>

      <div className="flex-1 max-w-[640px] mx-auto">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><SearchIcon /></span>
          <input
            type="search"
            placeholder="Search for jobs, candidates, clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ink-100/60 border border-transparent text-[13.5px] focus:outline-none focus:border-brand-300 focus:bg-white placeholder:text-ink-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <IconBtn aria-label="Notifications" badge="3"><BellIcon /></IconBtn>
        <IconBtn aria-label="Messages"      badge="6"><EnvelopeIcon /></IconBtn>
        <div className="w-px h-7 bg-ink-200 mx-1" />
        <button className="flex items-center gap-3 pr-3 hover:bg-ink-100 rounded-lg transition">
          <span className="w-10 h-10 rounded-full bg-brand-600 text-white text-[12px] font-bold flex items-center justify-center">AC</span>
          <span className="text-left leading-tight">
            <span className="block text-[13px] font-bold text-ink-900">Acme Talent Solutions</span>
            <span className="block text-[11px] text-ink-500">Agency</span>
          </span>
          <span className="text-ink-400"><ChevronDown /></span>
        </button>
      </div>
    </header>
  );
}

function IconBtn({ children, badge, ...rest }: { children: React.ReactNode; badge?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="relative w-9 h-9 rounded-full hover:bg-ink-100 text-ink-700 flex items-center justify-center transition" {...rest}>
      {children}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function BellIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function EnvelopeIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function ChevronDown() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
