import Image from "next/image";
import Link from "next/link";
import AuthHeader from "./AuthHeader";
import RoleCard from "./role-selection/RoleCard";
import AIPlatformStrip from "./role-selection/AIPlatformStrip";
import TrustStrip from "./role-selection/TrustStrip";

const CANDIDATE_FEATURES = [
  "Smart Job Matching",
  "AI Resume Analysis",
  "Auto Apply to Jobs",
  "Application Tracking",
  "Career Insights & Alerts",
];

const COMPANY_FEATURES = [
  "Resume Parsing & Screening",
  "Bulk Upload & Management",
  "Semantic & AI Search",
  "Fake Profile Detection",
  "Team Collaboration",
];

export default function RoleSelectionPage() {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* ── Header ── */}
      <AuthHeader
        border
        cta={{ label: "Login", href: "/login", icon: <SignInIcon /> }}
      />

      {/* ── Main ── */}
      <main className="flex-1 min-h-0 overflow-hidden py-4 px-6">
        <div className="mx-auto max-w-[1060px]">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="font-display text-[28px] font-extrabold text-ink-900 tracking-tight">
              Create Your Account
            </h1>
            <p className="mt-1.5 text-ink-500 text-[13.5px]">
              Choose the option that best describes you to get started with
              HireMind
            </p>
            <div className="mt-2 mx-auto w-12 h-0.5 rounded-full bg-brand-500" />
          </div>

          {/* ── Role cards ── */}
          <div className="grid md:grid-cols-2 gap-4">
            <RoleCard
              illustration={<CandidateIllustration />}
              icon={<CandidateIcon size={20} />}
              title="Candidate"
              description="Find the best jobs matched to your skills and advance your career."
              features={CANDIDATE_FEATURES}
              ctaLabel="I'm a Candidate"
              ctaHref="/register/candidate"
              ctaClass="btn-gradient-brand"
              footerIcon={<CandidateIcon size={11} />}
              footerLabel="For job seekers looking for opportunities"
            />
            <RoleCard
              illustration={<CompanyIllustration />}
              icon={<CompanyIcon size={20} />}
              title="Recruitment Company"
              description="Source, screen and hire top talent faster with the power of AI."
              features={COMPANY_FEATURES}
              ctaLabel="I'm a Recruitment Company"
              ctaHref="/register/company"
              ctaClass="btn-gradient-company"
              footerIcon={<CompanyIcon size={11} />}
              footerLabel="For recruitment agencies and hiring teams"
            />
          </div>

          <AIPlatformStrip />
          <TrustStrip />
        </div>
      </main>
    </div>
  );
}

/* ── Illustrations ── */
function CandidateIllustration() {
  return (
    <>
      {/* bg circle shade */}
      <div className="absolute inset-x-6 top-8 bottom-0 rounded-full bg-[#C4B5FD]/30 z-0" />
      {/* character */}
      <Image
        src="/images/candidate.png"
        alt="Candidate"
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-contain object-bottom z-[1]"
        priority
      />
      {/* chips — over image */}
      <div className="absolute top-[38%] left-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-ink-700">Job Match</div>
        <div className="text-yellow-500 text-[9.5px] tracking-widest mt-0.5">★★★★☆</div>
      </div>
      <div className="absolute top-[55%] right-1 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-brand-600">🔔 New Jobs</div>
      </div>
    </>
  );
}

function CompanyIllustration() {
  return (
    <>
      {/* bg circle shade */}
      <div className="absolute inset-x-6 top-8 bottom-0 rounded-full bg-[#BFDBFE]/40 z-0" />
      {/* character */}
      <Image
        src="/images/recruiter.png"
        alt="Recruiter"
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-contain object-bottom z-[1]"
        priority
      />
      {/* chips */}
      <div className="absolute top-[38%] left-2 bg-white rounded-xl shadow-md px-2.5 py-2 z-20 flex flex-col items-center">
        <div className="text-[9px] font-semibold text-ink-700">AI Match</div>
        <div className="text-brand-600 font-extrabold text-[15px] leading-none mt-0.5">95%</div>
      </div>
      <div className="absolute top-[55%] right-1 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20 flex flex-col items-center">
        <div className="text-[9px] font-semibold text-ink-700">Shortlisted</div>
        <div className="text-brand-600 font-bold text-[11px] mt-0.5">👥 125</div>
      </div>
    </>
  );
}

/* ── Icons ── */
function SignInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CandidateIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="7"
        r="4"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 21c0-3.866 4.029-7 9-7s9 3.134 9 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CompanyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="3"
        width="20"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M2 9h20" stroke="currentColor" strokeWidth="1.6" />
      <rect
        x="6"
        y="13"
        width="3"
        height="3"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="10.5"
        y="13"
        width="3"
        height="3"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="15"
        y="13"
        width="3"
        height="3"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect
        x="8"
        y="17"
        width="8"
        height="4"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  );
}
