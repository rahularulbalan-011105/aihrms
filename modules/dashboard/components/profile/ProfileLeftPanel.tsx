"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/modules/dashboard/context/ProfileContext";

const NAV_ITEMS = [
  { href: "/profile",                    label: "Overview",               icon: "⊞" },
  { href: "/profile/experience",         label: "Experience",             icon: "💼" },
  { href: "/profile/education",          label: "Education",              icon: "🎓" },
  { href: "/profile/projects",           label: "Projects",               icon: "📁" },
  { href: "/profile/skills",             label: "Skills & Certifications",icon: "⚙" },
  { href: "/profile/resume",             label: "Resume",                 icon: "📄" },
  { href: "/profile/preferences",        label: "Preferences",            icon: "🔍" },
  { href: "/profile/account-settings",   label: "Account Settings",       icon: "⚙" },
];

const RING_R = 22;
const RING_C = 2 * Math.PI * RING_R;

export default function ProfileLeftPanel() {
  const pathname = usePathname();
  const { profile } = useProfile();

  const fullName     = profile?.fullName     ?? "—";
  const jobTitle     = profile?.jobTitle     ?? "Candidate";
  const location     = profile?.currentLocation ?? "";
  const initials     = fullName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <aside className="w-[240px] shrink-0 flex flex-col gap-4">

      {/* Back link */}
      <Link href="/dashboard" className="flex items-center gap-1.5 text-[12.5px] text-ink-500 hover:text-brand-600 transition-colors font-medium">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Dashboard
      </Link>

      {/* Profile card */}
      <div className="card p-5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-[24px] ring-[3px] ring-brand-500 ring-offset-2">
            {profile?.profilePicture
              ? <img src={profile.profilePicture} alt={fullName} className="w-full h-full object-cover" />
              : initials}
          </div>
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-ink-200 flex items-center justify-center shadow-sm hover:bg-ink-100 transition-colors">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
        </div>

        <div className="mt-3 font-display font-bold text-[15px] text-ink-900">{fullName}</div>
        <div className="text-[12.5px] text-ink-500 mt-0.5">{jobTitle}</div>

        {/* Contact chips */}
        <div className="mt-3 w-full space-y-1.5 text-left">
          {location && (
            <div className="flex items-center gap-2 text-[12px] text-ink-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {location}
            </div>
          )}
          <div className="flex items-center gap-2 text-[12px] text-ink-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            rahul.sharma@email.com
          </div>
          <div className="flex items-center gap-2 text-[12px] text-ink-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            +91 98765 43210
          </div>
        </div>
      </div>

      {/* Profile Strength card */}
      <div className="card p-4">
        <div className="text-[12px] font-semibold text-ink-700 mb-3">Profile Strength</div>
        <div className="flex items-center gap-3">
          {/* Ring */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={RING_R} fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle cx="28" cy="28" r={RING_R} fill="none" stroke="#5b34f0" strokeWidth="4"
                strokeDasharray={`${RING_C} ${RING_C}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-extrabold text-[12px] text-brand-700">100%</span>
            </div>
          </div>
          <div>
            <div className="text-[13px] font-bold text-green-600">Excellent!</div>
            <div className="text-[11px] text-ink-500 leading-snug mt-0.5">Your profile is complete and ready to get noticed.</div>
          </div>
        </div>
        <button className="mt-3 w-full py-2 rounded-xl border border-ink-200 text-[12.5px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
          Improve Profile
        </button>
      </div>

      {/* Section nav */}
      <div className="card py-2">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors ${
                active ? "text-brand-700 font-semibold bg-brand-50" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              }`}
            >
              {active && <span className="w-1 h-4 rounded-full bg-brand-600 absolute left-0" />}
              {label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
