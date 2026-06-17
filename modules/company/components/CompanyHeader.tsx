"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/marketing/BrandLogo";
import { getStoredCompanyName, getStoredCompanyLogoUrl, clearAuth } from "@/lib/api/config";

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function CompanyHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCompanyName(getStoredCompanyName() ?? "");
    setLogoUrl(getStoredCompanyLogoUrl());
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function handleLogoClick() {
    if (pathname === "/company/dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/company/dashboard");
    }
  }

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  const displayName = companyName || "My Company";
  const avatarInitials = companyName ? initials(companyName) : "MC";

  return (
    <header className="h-[72px] shrink-0 border-b border-ink-100 bg-white flex items-center px-6 gap-6">
      <button type="button" onClick={handleLogoClick} className="shrink-0 cursor-pointer">
        <BrandLogo size="md" />
      </button>

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
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-3 pr-3 hover:bg-ink-100 rounded-lg transition"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-contain border border-ink-100 bg-white p-0.5 shrink-0"
              />
            ) : (
              <span className="w-10 h-10 rounded-full bg-brand-600 text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                {avatarInitials}
              </span>
            )}
            <span className="text-left leading-tight">
              <span className="block text-[13px] font-bold text-ink-900 max-w-[160px] truncate">{displayName}</span>
              <span className="block text-[11px] text-ink-500">Recruitment Company</span>
            </span>
            <span className="text-ink-400"><ChevronDown /></span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-ink-100 shadow-lg py-1.5 z-50">
              <Link
                href="/company/settings"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-4 py-2.5 text-[13px] text-ink-700 font-semibold hover:bg-ink-100 transition flex items-center gap-2"
              >
                <GearIcon /> Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-[13px] text-red-600 font-semibold hover:bg-red-50 transition flex items-center gap-2"
              >
                <LogoutIcon /> Logout
              </button>
            </div>
          )}
        </div>
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
function GearIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.8a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.4a7 7 0 0 0-2.1 1.2l-2.4-.8-2 3.4 2 1.6c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.6 2 3.4 2.4-.8c.7.5 1.4.9 2.1 1.2L10 21h4l.4-2.4c.7-.3 1.4-.7 2.1-1.2l2.4.8 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function LogoutIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
