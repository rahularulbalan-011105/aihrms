"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/profile",            sectionId: "profile-overview",   label: "Overview"                },
  { href: "/profile/experience", sectionId: "profile-experience", label: "Experience"              },
  { href: "/profile/education",  sectionId: "profile-education",  label: "Education"               },
  { href: "/profile/certifications", sectionId: "profile-certifications", label: "Certifications" },
  { href: "/profile/skills",         sectionId: "profile-skills",         label: "Skills"         },
];

const RING_R = 22;
const RING_C = 2 * Math.PI * RING_R;

interface Props {
  fullName?: string | null;
  jobTitle?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  profileStrength?: number;
  profilePicture?: string | null;
  backHref?: string;
  backLabel?: string;
  onSectionClick?: (sectionId: string) => void;
}

export default function ProfileLeftPanel({
  fullName: nameProp,
  jobTitle: titleProp,
  location: locationProp,
  email,
  phone,
  profileStrength,
  profilePicture,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  onSectionClick,
}: Props) {
  const pathname = usePathname();
  const isProfileRoot = pathname === "/profile";

  const fullName = nameProp ?? "—";
  const jobTitle = titleProp ?? "Candidate";
  const location = locationProp ?? "";
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const strength = profileStrength ?? 0;

  const [activeSection, setActiveSection] = useState("profile-overview");

  useEffect(() => {
    if (!isProfileRoot) return;
    const sectionIds = NAV_ITEMS.map((i) => i.sectionId).filter(Boolean) as string[];
    const main = document.querySelector("main");
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { root: main, threshold: 0.2, rootMargin: "-80px 0px -40% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [isProfileRoot]);

  function scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
      onSectionClick?.(sectionId);
    }
  }

  function strengthLabel(s: number) {
    if (s >= 80) return { text: "Excellent!", color: "text-green-600" };
    if (s >= 60) return { text: "Good", color: "text-blue-600" };
    if (s >= 40) return { text: "Fair", color: "text-yellow-600" };
    return { text: "Incomplete", color: "text-red-500" };
  }
  const { text: strengthText, color: strengthColor } = strengthLabel(strength);

  return (
    <aside className="w-[260px] shrink-0 sticky top-0 self-start bg-white border-r border-ink-200 flex flex-col">

      {/* Back link */}
      <div className="px-5 pt-4 pb-3 shrink-0">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-[12px] text-ink-500 hover:text-brand-600 transition-colors font-medium"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backLabel}
        </Link>
      </div>

      {/* Avatar + name + contact */}
      <div className="px-5 pb-5 border-b border-ink-100 shrink-0 flex flex-col items-center text-center">
        <div className="relative self-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-[24px] ring-[3px] ring-brand-500 ring-offset-2">
            {profilePicture ? (
              <img src={profilePicture} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-ink-200 flex items-center justify-center shadow-sm hover:bg-ink-100 transition-colors"
            aria-label="Edit profile picture"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="mt-3 font-display font-bold text-[15px] text-ink-900">{fullName}</div>
        <div className="text-[12.5px] text-ink-500 mt-0.5">{jobTitle}</div>

        <div className="mt-3 w-full space-y-1.5 text-left">
          {location && (
            <div className="flex items-center gap-2 text-[12px] text-ink-500 min-w-0">
              <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate">{location}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-[12px] text-ink-500 min-w-0">
              <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="truncate">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-[12px] text-ink-500 min-w-0">
              <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="truncate">{phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Strength */}
      <div className="px-5 py-4 border-b border-ink-100 shrink-0">
        <div className="text-[12px] font-semibold text-ink-700 mb-3">Profile Strength</div>
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={RING_R} fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle
                cx="28" cy="28" r={RING_R} fill="none" stroke="#5b34f0" strokeWidth="4"
                strokeDasharray={`${(strength / 100) * RING_C} ${RING_C}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-extrabold text-[12px] text-brand-700">{strength}%</span>
            </div>
          </div>
          <div>
            <div className={`text-[13px] font-bold ${strengthColor}`}>{strengthText}</div>
            <div className="text-[11px] text-ink-500 leading-snug mt-0.5">
              {strength >= 80 ? "Your profile is ready to get noticed." : "Keep completing your profile."}
            </div>
          </div>
        </div>
        <Link
          href="/profile/edit"
          className="mt-3 block w-full py-2 rounded-xl border border-ink-200 text-[12.5px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors text-center"
        >
          Improve Profile
        </Link>
      </div>

      {/* Section nav */}
      <div className="py-2 flex-1">
        {NAV_ITEMS.map(({ href, sectionId, label }) => {
          const active =
            isProfileRoot && sectionId
              ? activeSection === sectionId
              : pathname === href;

          const cls = `relative flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors w-full text-left ${
            active
              ? "text-brand-700 font-semibold bg-brand-50"
              : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
          }`;

          return isProfileRoot && sectionId ? (
            <button key={href} type="button" onClick={() => scrollTo(sectionId)} className={cls}>
              {active && <span className="w-1 h-4 rounded-full bg-brand-600 absolute left-0 top-1/2 -translate-y-1/2" />}
              {label}
            </button>
          ) : (
            <Link key={href} href={href} className={cls}>
              {active && <span className="w-1 h-4 rounded-full bg-brand-600 absolute left-0 top-1/2 -translate-y-1/2" />}
              {label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
