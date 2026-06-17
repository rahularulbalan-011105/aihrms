import type { ReactElement } from "react";
import Link from "next/link";
import CTABanner from "@/components/marketing/CTABanner";

export default function FeaturesPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="page-tint">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-14 lg:pt-20 pb-12 grid lg:grid-cols-[0.9fr_1.35fr] gap-10 items-center">
          {/* Left — copy + CTAs */}
          <div>
            <Pill>AI-Powered Recruitment Platform</Pill>
            <h1 className="mt-6 font-display text-[44px] lg:text-[58px] leading-[1.05] font-extrabold tracking-tight">
              Smarter Hiring.
              <br />
              Better Careers.
              <br />
              Powered by <span className="gradient-text">AI.</span>
            </h1>
            <p className="mt-6 text-ink-500 text-[15px] lg:text-[16px] max-w-[480px] leading-[1.7]">
              HireMind helps job seekers find genuine opportunities and helps
              agencies source, screen, and hire top talent faster.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white text-[14px] font-semibold shadow-[0_10px_30px_-10px_rgba(109,76,255,0.55)] hover:opacity-95 transition"
                style={{ background: "var(--gradient-brand)" }}
              >
                Start Free Trial <ArrowIcon />
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-brand-300 text-brand-700 text-[14px] font-semibold hover:bg-brand-50 transition"
              >
                Schedule Demo <PlayIcon />
              </Link>
            </div>
          </div>

          {/* Right — visual composition */}
          <HeroVisual />
        </div>
      </section>

      {/* ============ TWO-COLUMN FEATURES ============ */}
      <section className="px-6 lg:px-10 py-10 lg:py-14">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-6">
          <SeekersColumn />
          <AgenciesColumn />
        </div>
      </section>

      <CTABanner
        title="Ready to Transform Recruitment?"
        description="Join thousands of recruiters, agencies and job seekers using HireMind to make smarter hiring decisions and build successful careers."
      />
      <div className="h-16" />
    </>
  );
}

/* ============================================================
   HERO VISUAL
   ============================================================ */
function HeroVisual() {
  return (
    <div className="relative">
      <div className="grid grid-cols-[1fr_0.9fr_1fr] gap-3 items-start">
        {/* COL 1 — Recommended card + purple character */}
        <div className="flex flex-col gap-4">
          <div className="card p-3.5 shadow-sm">
            <div className="text-[11px] font-semibold text-ink-700">
              Recommended for You
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full illus-placeholder text-[8px] !min-h-0 !p-0">
                [photo]
              </div>
              <div className="flex-1 leading-tight">
                <div className="font-display font-bold text-[12.5px]">
                  Senior Product Designer
                </div>
                <div className="text-[10px] text-ink-500">
                  TechCorp Solutions
                </div>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded">
                95% Match
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {["5+ Yrs Exp.", "Bangalore", "Full-time"].map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-700 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2.5 px-2.5 py-1.5 rounded bg-green-50 text-green-700 text-[10px] font-semibold flex items-center gap-1.5">
              <CheckIcon /> Verified Opportunity
            </div>
          </div>

          <div className="illus-placeholder text-[10px] aspect-square">
            [Illustration:
            <br />
            purple-hoodie
            <br />
            character + laptop]
          </div>
        </div>

        {/* COL 2 — Brain icon + feature pills (centered) */}
        <div className="flex flex-col gap-3 pt-6">
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white text-[20px] shadow-[0_10px_24px_-8px_rgba(109,76,255,0.55)]"
            style={{ background: "var(--gradient-brand)" }}
          >
            <BrainIcon size={22} />
          </div>
          {[
            { icon: "shield", label: "Fake Job Detection", tone: "green" },
            { icon: "search", label: "Semantic Search", tone: "purple" },
            { icon: "plane", label: "Auto Job Apply", tone: "purple" },
            { icon: "doc", label: "Resume Parsing", tone: "orange" },
          ].map((f) => (
            <div
              key={f.label}
              className="card px-3 py-2 flex items-center gap-2 shadow-sm"
            >
              <span
                className={`w-6 h-6 rounded flex items-center justify-center ${
                  f.tone === "green"
                    ? "bg-green-50 text-green-600"
                    : f.tone === "orange"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-brand-50 text-brand-600"
                }`}
              >
                <MiniIcon name={f.icon} />
              </span>
              <span className="text-[11.5px] font-semibold whitespace-nowrap">
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* COL 3 — Dashboard card + green character */}
        <div className="flex flex-col gap-4">
          <div className="card p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-ink-700">
                Dashboard Overview
              </div>
              <span className="w-6 h-6 rounded-md bg-green-50 text-green-600 flex items-center justify-center">
                <TrendIcon size={12} />
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {[
                { v: "248", l: "Jobs" },
                { v: "5,214", l: "Candidates" },
                { v: "324", l: "Interviews" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded bg-brand-50 px-1.5 py-1.5 text-center"
                >
                  <div className="text-[8px] text-ink-500">{s.l}</div>
                  <div className="font-display font-extrabold text-[14px] text-brand-700">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] font-semibold text-ink-700 mb-1.5">
              Top Matched Candidates
            </div>
            {[
              { name: "Rohan Mehta", role: "Full Stack Developer", match: 96 },
              { name: "Priya Sharma", role: "UI/UX Designer", match: 93 },
            ].map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 py-1.5 border-t border-ink-100 first:border-0"
              >
                <div className="w-6 h-6 rounded-full illus-placeholder text-[7px] !min-h-0 !p-0">
                  [ph]
                </div>
                <div className="flex-1 leading-tight">
                  <div className="text-[10.5px] font-semibold">{c.name}</div>
                  <div className="text-[9px] text-ink-500">{c.role}</div>
                </div>
                <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-1 py-0.5 rounded">
                  {c.match}% Match
                </span>
              </div>
            ))}
          </div>

          <div className="illus-placeholder text-[10px] aspect-square">
            [Illustration:
            <br />
            green-blazer
            <br />
            character + laptop]
          </div>
        </div>
      </div>
    </div>
  );
}

function SeekersColumn() {
  return (
    <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-6 lg:p-7">
      <ColHeader
        tone="blue"
        icon="user"
        title="For Job Seekers"
        subtitle="Find better opportunities while avoiding fake jobs."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        <FeatureCard
          icon="shield"
          title="Ghost / Fake Job Detection"
          body="Automatically detects scam, expired, suspicious and misleading job postings."
          badge="AI"
          chip={{
            text: "Verified Opportunity",
            tone: "green",
            iconCheck: true,
          }}
        />
        <FeatureCard
          icon="duplicate"
          title="Duplicate Job Detection"
          body="Eliminates duplicate jobs posted across multiple platforms."
          badge="AI"
          chip={{ text: "12 Duplicates Removed", tone: "purple" }}
        />
        <FeatureCard
          icon="robot"
          title="Auto Job Apply"
          body="Automatically applies to jobs that match your preferences, skills and experience."
          badge="AI"
          chip={{ text: "Applied Automatically ✓", tone: "green" }}
        />
        <FeatureCard
          icon="target"
          title="Smart Job Matching"
          body="Personalized job recommendations using AI scoring."
        />
        <FeatureCard
          icon="bell"
          title="Smart Job Alerts"
          body="Get real-time alerts for highly relevant job opportunities."
        />
        <FeatureCard
          icon="track"
          title="Application Status Tracking"
          body="Track every application stage in real-time."
        >
          <ApplicationStages />
        </FeatureCard>
      </div>
      <FootNote tone="blue" icon="shield">
        Stay safe from fake jobs while AI works for you 24/7.
      </FootNote>
    </div>
  );
}

function AgenciesColumn() {
  return (
    <div className="bg-green-50/40 border border-green-100 rounded-2xl p-6 lg:p-7">
      <ColHeader
        tone="green"
        icon="building"
        title="For Recruitment Agencies"
        subtitle="Reduce manual work and hire faster using AI."
      />
      <div className="mt-5 space-y-3">
        <BulkResumeCard />
        <div className="grid sm:grid-cols-2 gap-3">
          <FeatureCard
            icon="search"
            title="Semantic Search"
            body="Search using natural language. Find the best candidates beyond keyword matching."
            badge="AI"
          >
            <SemanticSearchBlock />
          </FeatureCard>
          <FeatureCard
            icon="fakeprofile"
            title="Fake Profile Identification"
            body="AI detects and flags fake or misleading profiles to reduce risk."
            badge="AI"
          >
            <FakeProfileBlock />
          </FeatureCard>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <FeatureCard
            icon="match"
            title="AI Candidate Matching"
            body="Automatically match candidates with job requirements."
            badge="AI"
          />
          <FeatureCard
            icon="analytics"
            title="Hiring Analytics & Reports"
            body="Get data-driven insights and improve hiring performance."
            badge="AI"
          />
          <FeatureCard
            icon="team"
            title="Team Collaboration"
            body="Collaborate with your team, share notes and feedback."
            badge="AI"
          >
            <TeamMembersBlock />
          </FeatureCard>
        </div>
      </div>
      <FootNote tone="green" icon="check">
        Everything you need to hire smarter and scale your agency.
      </FootNote>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  badge,
  chip,
  children,
}: {
  icon: string;
  title: string;
  body: string;
  badge?: string;
  chip?: {
    text: string;
    tone: "green" | "purple" | "orange";
    iconCheck?: boolean;
  };
  children?: React.ReactNode;
}) {
  const chipTone = {
    green: "bg-green-50 text-green-700 border border-green-100",
    purple: "bg-brand-50 text-brand-700 border border-brand-100",
    orange: "bg-orange-50 text-orange-700 border border-orange-100",
  };
  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-md bg-brand-50 flex items-center justify-center text-brand-600">
          <FeatureGlyph name={icon} />
        </div>
        {badge && (
          <span className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 font-display font-bold text-[13px] leading-tight">
        {title}
      </div>
      <p className="mt-1.5 text-ink-500 text-[11.5px] leading-relaxed">
        {body}
      </p>
      {chip && (
        <div
          className={`mt-3 inline-flex w-fit items-center gap-1 text-[10px] px-2 py-1 rounded-md font-semibold ${chipTone[chip.tone]}`}
        >
          {chip.iconCheck && <CheckIcon />} {chip.text}
        </div>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

function BulkResumeCard() {
  return (
    <div className="card p-4 lg:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-md bg-brand-50 flex items-center justify-center text-brand-600">
          <FeatureGlyph name="upload" />
        </div>
        <span className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
          AI
        </span>
      </div>
      <div className="mt-3 grid lg:grid-cols-[1.4fr_1fr] gap-4 items-center">
        <div>
          <div className="font-display font-bold text-[14px]">
            Bulk Resume Upload & Parsing
          </div>
          <p className="mt-1.5 text-ink-500 text-[12px] leading-relaxed">
            Upload thousands of resumes and let AI extract key information
            instantly.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["PDF", "DOCX", "ZIP", "Email Imports"].map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded bg-ink-100 text-ink-700 font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-full rounded-lg border border-dashed border-brand-200 bg-brand-50/40 p-3 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
              <UploadCloudIcon />
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-semibold">
            <CheckIcon /> 1000+ Resumes
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-semibold">
            <CheckIcon /> 98% Parsing Accuracy
          </span>
        </div>
      </div>
    </div>
  );
}

function SemanticSearchBlock() {
  return (
    <div className="rounded-md bg-ink-100/40 p-2.5 border border-ink-100">
      <div className="px-2 py-1.5 rounded bg-white border border-ink-200 text-[10px] text-ink-700 flex items-center gap-1.5">
        <SearchIcon size={11} />
        <span className="leading-tight">
          Java developer with 5 years experience in banking domain and AWS
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-brand-700 font-semibold">
          432 Relevant Candidates Found
        </span>
        <div className="flex -space-x-1">
          <span className="w-4 h-4 rounded-full bg-brand-200" />
          <span className="w-4 h-4 rounded-full bg-brand-300" />
          <span className="w-4 h-4 rounded-full bg-brand-400" />
          <span className="text-[9px] font-bold text-ink-500 self-center pl-1">
            +429
          </span>
        </div>
      </div>
    </div>
  );
}

function FakeProfileBlock() {
  const items = [
    "Fake Experience",
    "Resume Manipulation",
    "Duplicate Profile",
    "AI Generated Content",
  ];
  return (
    <div className="rounded-md bg-ink-100/40 p-2.5 border border-ink-100 flex gap-3">
      <div className="flex-1 space-y-1">
        {items.map((label) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-ink-700">
              <span className="text-green-600">✓</span> {label}
            </div>
            <span className="text-[9px] font-semibold text-green-600">
              Detected
            </span>
          </div>
        ))}
      </div>
      <div className="shrink-0 flex flex-col items-center justify-center">
        <svg width="60" height="34" viewBox="0 0 60 34">
          <defs>
            <linearGradient id="fpGauge" x1="0" x2="1">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path
            d="M5 30 A25 25 0 0 1 55 30"
            stroke="url(#fpGauge)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="30"
            x2="48"
            y2="14"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-[9px] font-bold text-red-600 -mt-0.5">
          High Risk
        </div>
      </div>
    </div>
  );
}

function TeamMembersBlock() {
  return (
    <div className="flex items-center gap-2">
      <div className="font-display font-extrabold text-[18px] text-ink-900">
        8
      </div>
      <div className="leading-tight">
        <div className="text-[10px] font-semibold">Team Members Active</div>
        <div className="flex -space-x-1 mt-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 rounded-full bg-brand-200 border border-white"
            />
          ))}
          <span className="text-[9px] font-bold text-ink-500 self-center pl-1">
            +5
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationStages() {
  const stages = [
    { label: "Applied", icon: "doc" },
    { label: "Screening", icon: "users" },
    { label: "Shortlisted", icon: "star" },
    { label: "Interview", icon: "user" },
    { label: "Offer", icon: "check" },
  ];
  return (
    <div className="grid grid-cols-5 gap-1 items-start">
      {stages.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center text-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i < 2 ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-500"}`}
          >
            <FeatureGlyph name={s.icon} />
          </div>
          <div className="text-[8px] mt-1 text-ink-700">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function ColHeader({
  tone,
  icon,
  title,
  subtitle,
}: {
  tone: "blue" | "green";
  icon: "user" | "building";
  title: string;
  subtitle: string;
}) {
  const colorMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-700", title: "text-blue-700" },
    green: {
      bg: "bg-green-100",
      text: "text-green-700",
      title: "text-green-700",
    },
  };
  const c = colorMap[tone];
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${c.bg} ${c.text}`}
      >
        {icon === "user" ? <UserGlyph /> : <BuildingGlyph />}
      </div>
      <div>
        <h2
          className={`font-display text-[26px] font-extrabold tracking-tight ${c.title}`}
        >
          {title}
        </h2>
        <p className="text-ink-500 text-[13px]">{subtitle}</p>
      </div>
    </div>
  );
}

function FootNote({
  tone,
  icon,
  children,
}: {
  tone: "blue" | "green";
  icon: "shield" | "check";
  children: React.ReactNode;
}) {
  const cls =
    tone === "blue"
      ? "bg-blue-100/70 text-blue-700"
      : "bg-green-100/70 text-green-700";
  return (
    <div
      className={`mt-5 px-4 py-3 rounded-lg text-[13px] font-semibold flex items-center gap-2 ${cls}`}
    >
      {icon === "shield" ? <ShieldIcon /> : <CheckIcon />}
      {children}
    </div>
  );
}

/* ---- Icons ---- */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12.5px] font-semibold border border-brand-100">
      <span className="text-brand-500">✦</span>
      {children}
    </span>
  );
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 5.5l4 2.5-4 2.5v-5z" fill="currentColor" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function BrainIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 4c-2.2 0-4 1.8-4 4v.5C4 9.7 3 11 3 12.5S4 15 5 15.5V16c0 2.2 1.8 4 4 4 1 0 2-.4 2.7-1H12c.7.6 1.7 1 2.7 1 2.2 0 4-1.8 4-4v-.5c1-.4 2-1.7 2-3s-1-2.6-2-3V8c0-2.2-1.8-4-4-4-1 0-2 .4-2.7 1H12c-.7-.6-1.7-1-2.7-1z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TrendIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 17l6-6 4 4 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8h6v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UploadCloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.7-1A4 4 0 0 0 7 18z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 12v6M9 15l3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BuildingGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MiniIcon({ name }: { name: string }) {
  const m: Record<string, ReactElement> = {
    shield: <ShieldIcon />,
    search: <SearchIcon />,
    plane: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    doc: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  };
  return m[name] ?? <span>•</span>;
}
function FeatureGlyph({ name }: { name: string }) {
  const m: Record<string, ReactElement> = {
    shield: <ShieldIcon />,
    duplicate: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect
          x="8"
          y="3"
          width="13"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <rect
          x="3"
          y="7"
          width="13"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="white"
        />
      </svg>
    ),
    robot: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="7"
          width="16"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="9" cy="13" r="1.5" fill="currentColor" />
        <circle cx="15" cy="13" r="1.5" fill="currentColor" />
        <path d="M12 4v3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    target: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
    bell: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2zM10 20a2 2 0 0 0 4 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    track: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" />
        <rect x="7" y="13" width="3" height="5" fill="currentColor" />
        <rect x="12" y="9" width="3" height="9" fill="currentColor" />
        <rect x="17" y="6" width="3" height="12" fill="currentColor" />
      </svg>
    ),
    upload: <UploadCloudIcon />,
    search: <SearchIcon />,
    fakeprofile: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5M3 3l18 18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    match: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 6a3 3 0 0 1 6 0v12a3 3 0 0 1-6 0M3 12h6M15 12h6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    analytics: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M7 17l4-5 3 3 5-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    team: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle
          cx="17"
          cy="10"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
    doc: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
    users: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle
          cx="17"
          cy="10"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
    star: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    user: <UserGlyph />,
    check: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8 12l3 3 5-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };
  return m[name] ?? <span>•</span>;
}
