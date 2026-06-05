"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function BrandLogoImg({ height = 48 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="HireMind" height={height} width={Math.round(height * 1.46)} style={{ height: `${height}px`, width: "auto", objectFit: "contain" }} />
  );
}

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

const AI_FEATURES = [
  { icon: "🎯", label: "Smart Matching" },
  { icon: "📄", label: "Resume AI" },
  { icon: "🛡", label: "Fraud Detection" },
  { icon: "📊", label: "Predictive Analytics" },
];

const TRUST_LOGOS = ["TATA", "Infosys", "Wipro", "Tech Mahindra", "HCL", "Accenture", "Cognizant"];

const STEPS = ["Choose Account Type", "Create Account", "Complete Profile"];

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FF]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-ink-100">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <BrandLogoImg height={56} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-[14px] text-ink-600 hover:text-ink-900 flex items-center gap-1.5 transition">
              <InfoIcon /> Need help?
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-ink-200 text-[14px] font-semibold text-ink-700 hover:bg-ink-50 transition">
              <SignInIcon /> Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Step indicator ── */}
      <div className="bg-white border-b border-ink-100 py-4">
        <div className="mx-auto max-w-[700px] px-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3 flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] border-2 ${
                    i === 0 ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-ink-300 text-ink-400"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-[11px] font-semibold whitespace-nowrap ${i === 0 ? "text-brand-600" : "text-ink-400"}`}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-ink-200 mb-5 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="flex-1 py-8 px-6">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center mb-8">
            <h1 className="font-display text-[36px] font-extrabold text-ink-900 tracking-tight">
              Create Your Account
            </h1>
            <div className="mt-1 mx-auto w-16 h-1 rounded-full bg-brand-500" />
            <p className="mt-3 text-ink-500 text-[15px]">
              Choose the option that best describes you to get started with HireMind
            </p>
          </div>

          {/* Role cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Candidate card */}
            <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#F4F1FF] p-8 flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <div className="text-[70px]">👨‍💻</div>
                  <div className="mt-2 text-[12px] text-ink-500">Candidate with AI tools</div>
                </div>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                    <CandidateIcon />
                  </div>
                  <h2 className="font-display font-extrabold text-[22px] text-brand-700">Candidate</h2>
                </div>
                <p className="text-ink-500 text-[13.5px] mb-5">
                  Find the best jobs matched to your skills and advance your career.
                </p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {CANDIDATE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-ink-700">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-[11px] font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => router.push("/register/candidate")}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-95 transition"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  I&apos;m a Candidate <ArrowRightIcon />
                </button>
                <p className="mt-3 text-center text-[12px] text-ink-400 flex items-center justify-center gap-1.5">
                  <CandidateIcon /> For job seekers looking for opportunities
                </p>
              </div>
            </div>

            {/* Recruitment Company card */}
            <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#F0FDF4] p-8 flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <div className="text-[70px]">👩‍💼</div>
                  <div className="mt-2 text-[12px] text-ink-500">Recruiter with AI match</div>
                </div>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CompanyIcon />
                  </div>
                  <h2 className="font-display font-extrabold text-[22px] text-green-700">Recruitment Company</h2>
                </div>
                <p className="text-ink-500 text-[13.5px] mb-5">
                  Source, screen and hire top talent faster with the power of AI.
                </p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {COMPANY_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-ink-700">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-[11px] font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => router.push("/register/company")}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-95 transition bg-green-600 hover:bg-green-700"
                >
                  I&apos;m a Recruitment Company <ArrowRightIcon />
                </button>
                <p className="mt-3 text-center text-[12px] text-ink-400 flex items-center justify-center gap-1.5">
                  <CompanyIcon /> For recruitment agencies and hiring teams
                </p>
              </div>
            </div>
          </div>

          {/* AI Platform strip */}
          <div className="mt-8 bg-white rounded-2xl border border-ink-100 shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[20px]">✨</span>
                  <span className="font-bold text-[15px] text-ink-900">AI-Powered Platform</span>
                </div>
                <p className="text-ink-500 text-[13px] max-w-[280px] leading-relaxed">
                  Leverage AI to find the right opportunities, connect with the right people, and make smarter hiring decisions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 ml-auto">
                {AI_FEATURES.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-100 bg-ink-50/60 text-[13px] font-semibold text-ink-700">
                    <span>{f.icon}</span>{f.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust section */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-ink-500 font-medium mb-4">
              Trusted by 10,000+ Users &amp; 500+ Companies
            </p>
            <div className="flex items-center justify-center flex-wrap gap-6">
              {TRUST_LOGOS.map((logo) => (
                <div key={logo} className="text-[13px] font-bold text-ink-400 tracking-wide uppercase">
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Icons ── */
function InfoIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function SignInIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function CandidateIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>; }
function CompanyIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><path d="M8 9h2M14 9h2M8 13h2M14 13h2M8 17h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>; }
function ArrowRightIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
