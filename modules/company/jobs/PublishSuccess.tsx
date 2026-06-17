"use client";

import Link from "next/link";

export default function PublishSuccess() {
  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Top action strip */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <Link
          href="/company/jobs/new"
          className="px-3.5 py-2 rounded-lg border border-brand-300 text-brand-700 text-[12.5px] font-semibold hover:bg-brand-50 transition inline-flex items-center gap-1.5"
        >
          <ArrowLeft /> Back to Preferences
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-4 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13px] font-semibold hover:bg-ink-100 transition">
            Save Draft
          </button>
          <button
            className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--gradient-brand)" }}
          >
            Publish Job <PaperPlane />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          {/* Hero success */}
          <div className="bg-white border border-ink-100 rounded-xl px-6 py-7 flex flex-col md:flex-row items-center gap-6">
            <SuccessGraphic />
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-[22px] font-extrabold inline-flex items-center gap-2">
                Job Published Successfully! <span aria-hidden="true">🎉</span>
              </h1>
              <p className="text-ink-500 text-[13.5px] mt-1">
                Your job post is now live and visible to candidates.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  View Job Post <PaperPlane />
                </button>
                <Link
                  href="/company/dashboard"
                  className="px-4 py-2.5 rounded-lg border border-brand-300 text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition inline-flex items-center gap-2"
                >
                  <GridIcon /> Go to Jobs Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Published Job Summary */}
          <div className="bg-white border border-ink-100 rounded-xl p-5">
            <h2 className="font-display text-[15px] font-extrabold mb-3">
              Published Job Summary
            </h2>
            <div className="grid grid-cols-[88px_1fr] gap-4 items-start">
              <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-3 grid place-items-center">
                <span className="w-12 h-12 rounded-md bg-white text-brand-700 grid place-items-center">
                  <BriefIcon />
                </span>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
                  Live
                </div>
              </div>
              <div>
                <div className="font-display text-[17px] font-extrabold">
                  Senior Software Engineer
                </div>
                <div className="flex items-center gap-3 text-[12px] text-ink-600 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <BuildingIcon /> Acme Talent Solutions
                  </span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1">
                    <PinIcon /> Bengaluru, Karnataka, India (Hybrid)
                  </span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1">
                    <BriefIcon /> Full-time
                  </span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1">
                    <UserIcon /> Opening
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pt-3 border-t border-ink-100">
                  <Detail label="Department" value="Engineering" />
                  <Detail
                    label="Salary Range"
                    value="₹ 12,00,000 – ₹ 18,00,000 per annum"
                  />
                  <Detail
                    label="Role / Category"
                    value="Software Development"
                  />
                  <Detail label="Notice Period" value="15 – 30 Days" />
                  <Detail label="Experience" value="3 – 6 Years" />
                  <Detail label="Job ID" value="JOB-2024-0056" />
                  <Detail label="Posted On" value="20 May 2024" />
                </div>
                <a className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-brand-700 font-semibold">
                  View Full Job Details <ArrowRight />
                </a>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div>
            <h2 className="font-display text-[15px] font-extrabold mb-2">
              What&apos;s Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <NextCard
                icon={<TargetIcon />}
                title="Track Applications"
                body="We'll notify you when candidates start applying."
                action="View Applications"
                tint="bg-blue-50 text-blue-700"
              />
              <NextCard
                icon={<ShortlistIcon />}
                title="Shortlist Candidates"
                body="Review and shortlist the best candidates for your job."
                action="Go to Candidates"
                tint="bg-orange-50 text-orange-700"
              />
              <NextCard
                icon={<ShareIcon />}
                title="Share with your Network"
                body="Increase visibility by sharing this job with your network."
                action="Share Job"
                tint="bg-brand-50 text-brand-700"
              />
            </div>
          </div>

          {/* Confirmation strip */}
          <div className="bg-white border border-ink-100 rounded-xl p-4 flex items-start gap-3">
            <span className="w-10 h-10 rounded-md bg-brand-50 text-brand-700 grid place-items-center">
              <ShieldIcon />
            </span>
            <p className="text-[12.5px] text-ink-700 flex-1">
              I confirm that all the information provided is accurate and
              complies with company policies and applicable laws.
            </p>
            <span className="w-5 h-5 rounded bg-brand-600 text-white grid place-items-center text-[11px]">
              ✓
            </span>
          </div>
        </div>

        {/* Right Rail */}
        <aside className="flex flex-col gap-3">
          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <h3 className="font-display font-bold text-[14px] inline-flex items-center gap-1.5 mb-3">
              <ShareIcon /> Share Your Job
            </h3>
            <p className="text-[11.5px] text-ink-500 mb-3">
              Increase your reach by sharing your job on multiple platforms.
            </p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <Social
                icon="in"
                label="LinkedIn"
                bg="bg-blue-50 text-blue-700"
              />
              <Social icon="f" label="Facebook" bg="bg-blue-50 text-blue-700" />
              <Social icon="x" label="Twitter" bg="bg-sky-50 text-sky-700" />
              <Social
                icon="w"
                label="WhatsApp"
                bg="bg-green-50 text-green-700"
              />
            </div>
            <button className="w-full px-3 py-2 rounded-md border border-ink-200 text-ink-700 text-[12px] font-semibold hover:bg-ink-100 transition inline-flex items-center justify-center gap-1.5">
              <LinkIcon /> Copy Link
            </button>
          </div>

          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <h3 className="font-display font-bold text-[14px] inline-flex items-center gap-1.5 mb-2.5">
              <GlobeIcon /> Job Post is Live On
            </h3>
            <ul className="space-y-1.5 text-[12.5px] text-ink-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> HireMind Job Board
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Email Alerts to
                Subscribers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span> Partner Job
                Boards (Indeed, Naukri, LinkedIn, etc.)
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <h3 className="font-display font-bold text-[14px] inline-flex items-center gap-1.5 mb-2.5">
              <BulbIcon /> Tips to get more applications
            </h3>
            <ul className="space-y-1.5 text-[12.5px] text-ink-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Share your job on
                social media
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Add relevant skills
                for better matches
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Respond quickly to
                applicants
              </li>
            </ul>
            <a className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-green-600 font-semibold">
              View Best Practices <ArrowRight />
            </a>
          </div>

          <div className="rounded-xl border border-ink-100 p-4 bg-white flex items-start gap-3">
            <span className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center">
              <MailIcon />
            </span>
            <div className="flex-1">
              <h3 className="font-display font-bold text-[13.5px]">
                Want to hire faster?
              </h3>
              <p className="text-[11.5px] text-ink-500 leading-snug">
                Boost your job post to reach more relevant candidates.
              </p>
              <button className="mt-2 px-3 py-2 rounded-md text-[12px] font-semibold border border-brand-300 text-brand-700 hover:bg-brand-50 transition inline-flex items-center gap-1.5">
                Boost Job Post <PaperPlane />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NextCard({
  icon,
  title,
  body,
  action,
  tint,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: string;
  tint: string;
}) {
  return (
    <div className="bg-white border border-ink-100 rounded-xl p-4">
      <div className="flex items-start gap-2.5 mb-2">
        <span className={`w-9 h-9 rounded-md grid place-items-center ${tint}`}>
          {icon}
        </span>
        <h3 className="font-display text-[13.5px] font-extrabold leading-snug">
          {title}
        </h3>
      </div>
      <p className="text-[12px] text-ink-500 mb-2.5 leading-snug">{body}</p>
      <a className="text-[12.5px] text-brand-700 font-semibold inline-flex items-center gap-1">
        {action} <ArrowRight />
      </a>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-ink-500">{label}</div>
      <div className="text-[12.5px] font-medium text-ink-900 mt-0.5">
        {value}
      </div>
    </div>
  );
}
function Social({
  icon,
  label,
  bg,
}: {
  icon: string;
  label: string;
  bg: string;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-md ${bg} hover:opacity-90 transition`}
    >
      <span className="w-7 h-7 rounded grid place-items-center text-[13px] font-extrabold">
        {icon}
      </span>
      <span className="text-[10.5px] font-semibold">{label}</span>
    </button>
  );
}

function SuccessGraphic() {
  return (
    <div className="relative w-[140px] h-[140px] shrink-0">
      <svg viewBox="0 0 140 140" width="140" height="140" fill="none">
        <circle cx="70" cy="70" r="45" fill="#22C55E" />
        <path
          d="M53 71l12 12 24-26"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="20" r="3" fill="#F59E0B" />
        <circle cx="120" cy="22" r="3" fill="#3B82F6" />
        <circle cx="125" cy="60" r="3" fill="#EF4444" />
        <circle cx="18" cy="105" r="3" fill="#A78BFA" />
        <circle cx="115" cy="115" r="3" fill="#22C55E" />
        <path
          d="M30 40l-4-3M110 38l3-2M30 100l-4 3M115 95l3 2"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 65l-3-1M127 80l3 1M70 16l1-4M70 124l1 3"
          stroke="#A78BFA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* Icons */
function BriefIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function ShortlistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 9h8M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 11l6-4M9 13l6 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 14l4-4M14 7l1.5-1.5a4 4 0 1 1 5.7 5.7L19 13M10 17l-1.5 1.5a4 4 0 1 1-5.7-5.7L5 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function BulbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c1 .6 1.5 1.5 1.5 2.5V17h3v-.5c0-1 .5-1.9 1.5-2.5A6 6 0 0 0 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ArrowLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M13 8H3m0 0l5-5m-5 5l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m0 0L8 3m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PaperPlane() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11l18-8-8 18-3-7-7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
