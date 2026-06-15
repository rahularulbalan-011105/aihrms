"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useProfile } from "@/modules/dashboard/context/ProfileContext";

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#5b34f0" : "#6b7280"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ApplicationsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#5b34f0" : "#6b7280"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function SavedIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={active ? "#5b34f0" : "none"}
      stroke={active ? "#5b34f0" : "#6b7280"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "My Dashboard", Icon: DashboardIcon },
  { href: "/applications", label: "My Applications", Icon: ApplicationsIcon },
  { href: "/saved-jobs", label: "Saved Jobs", Icon: SavedIcon },
];

const PROFILE_STRENGTH_PCT = 100;
const RING_R = 22; // fits inside 56×56 viewBox (cx=cy=28, r=22 leaves 6px margin)
const RING_C = 2 * Math.PI * RING_R;

export default function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useProfile();

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Profile */}
      <div className="px-5 py-5 border-b border-ink-100 shrink-0">
        {/* Avatar left · Name/role right */}
        <div className="flex items-center gap-3">
          <div className="w-[56px] h-[56px] shrink-0 rounded-full overflow-hidden bg-ink-100 ring-[3px] ring-brand-500 ring-offset-2 flex items-center justify-center text-brand-700 font-bold text-[18px]">
            {profile?.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : profile?.fullName ? (
              profile.fullName
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()
            ) : (
              <Image
                src="/images/candidate.png"
                alt="Profile"
                width={56}
                height={56}
                className="object-cover"
                priority
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-[14.5px] text-ink-900 truncate">
              {profile?.fullName ?? "—"}
            </div>
            <div className="text-[12px] text-ink-500 mt-0.5 truncate">
              {profile?.jobTitle ?? "Candidate"}
            </div>
          </div>
        </div>

        {/* Profile strength row: label left, ring right */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#22c55e"
                stroke="none"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span className="text-[11.5px] text-ink-500">
                Profile Strength
              </span>
            </div>
            <span className="text-[12px] font-bold text-green-600 pl-[21px]">
              Excellent
            </span>
          </div>

          {/* Circular progress ring with % inside */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r={RING_R}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r={RING_R}
                fill="none"
                stroke="#5b34f0"
                strokeWidth="4"
                strokeDasharray={`${(PROFILE_STRENGTH_PCT / 100) * RING_C} ${RING_C}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-extrabold text-[13px] text-brand-700">
                {PROFILE_STRENGTH_PCT}%
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/profile"
          className="mt-3 flex items-center gap-1 text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 transition"
        >
          View Profile <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-[13.5px] font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Premium upsell */}
      <div className="p-4 shrink-0">
        <div
          className="rounded-2xl p-4 text-white relative overflow-hidden"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[16px]">👑</span>
            <span className="font-display font-bold text-[13px]">
              Unlock Premium
            </span>
            <span className="ml-auto text-[14px]">✨</span>
          </div>
          <p className="text-[11px] text-white/75 leading-relaxed mb-3">
            Get early access to jobs, stand out to recruiters and much more!
          </p>
          <button className="w-full bg-white text-brand-700 text-[12px] font-bold py-2 rounded-xl hover:bg-brand-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-white border border-ink-200 flex items-center justify-center text-ink-700 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slides in */}
      <aside
        className={`
        fixed md:relative z-50 md:z-auto
        w-[260px] h-screen shrink-0
        bg-white border-r border-ink-200
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
