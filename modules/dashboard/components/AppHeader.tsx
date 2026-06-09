"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/marketing/BrandLogo";
import { clearAuth } from "@/lib/api/config";
import { useProfile } from "@/modules/dashboard/context/ProfileContext";
import type { CandidateProfile } from "@/modules/auth/services/candidate.service";

// ─── helpers ─────────────────────────────────────────────────────────────────

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─── Logout dropdown ─────────────────────────────────────────────────────────

interface UserMenuProps {
  profile: CandidateProfile;
  onLogout: () => void;
}

function UserMenu({ profile, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstName = profile.fullName?.split(" ")[0] ?? "User";

  return (
    <div ref={ref} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-ink-100 transition-colors"
        aria-label="User menu"
      >
        <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-[13px] shrink-0 overflow-hidden">
          {profile.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.profilePicture} alt={profile.fullName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials(profile.fullName ?? "U")}</span>
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-[13px] font-semibold text-ink-900 leading-tight">{firstName}</div>
          <div className="text-[11px] text-ink-400">{profile.jobTitle ?? "Candidate"}</div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-ink-200 rounded-2xl shadow-lg py-1.5 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-ink-100">
            <div className="font-semibold text-[13.5px] text-ink-900">{profile.fullName}</div>
            {profile.currentLocation && (
              <div className="text-[12px] text-ink-400 mt-0.5">{profile.currentLocation}</div>
            )}
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-ink-700 hover:bg-ink-100 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            View Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-ink-700 hover:bg-ink-100 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>

          <div className="border-t border-ink-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AppHeader ────────────────────────────────────────────────────────────────

export default function AppHeader() {
  const router = useRouter();
  const { profile } = useProfile();

  // Must be state — timeGreeting() uses Date, differs between server & client
  const [greeting, setGreeting] = useState("");
  useEffect(() => { setGreeting(timeGreeting()); }, []);

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  const firstName = profile?.fullName?.split(" ")[0] ?? "there";

  return (
    <header className="shrink-0 flex bg-white border-b border-ink-200 min-h-[72px]">

      {/* ── Logo zone — mirrors sidebar width ── */}
      <div className="w-[260px] shrink-0 flex items-center px-6 h-[72px] bg-brand-50/60 border-r border-ink-200">
        <Link href="/">
          <BrandLogo size="md" />
        </Link>
      </div>

      {/* ── Greeting + actions ── */}
      <div className="flex-1 flex items-center justify-between px-8 h-[72px]">
        <div>
          <h1 className="font-display font-extrabold text-[22px] text-ink-900 leading-tight" suppressHydrationWarning>
            {greeting ? `${greeting}, ${firstName}!` : " "}{" "}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-[13.5px] text-ink-500 mt-0.5">
            Find the right opportunity that matches your skills and aspirations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Notification bell */}
          <button
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-xl bg-ink-100 flex items-center justify-center text-ink-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
          </button>

          {/* User menu / logout */}
          {profile ? (
            <UserMenu profile={profile} onLogout={handleLogout} />
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] text-ink-600 hover:bg-ink-100 hover:text-red-500 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
