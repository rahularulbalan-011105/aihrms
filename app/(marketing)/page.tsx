import Pill from "@/components/marketing/Pill";
import HeroActions from "@/components/marketing/HeroActions";
import StatsStrip, { type Stat } from "@/components/marketing/StatsStrip";
import {
  MailIcon,
  BrainIcon,
  TargetIcon,
  BoltIcon,
  DocIcon,
  UsersIcon,
  ChartIcon,
  CheckCircleIcon,
  TrendIcon,
} from "@/components/marketing/icons";

const STATS: Stat[] = [
  { value: "2M+",   label: "Candidates Processed", caption: "Across Platform" },
  { value: "50K+",  label: "Active Recruiters",    caption: "Trusted by professionals" },
  { value: "10K+",  label: "Hiring Agencies",      caption: "Growing with HireMind" },
  { value: "500K+", label: "Jobs Posted",          caption: "Every Month" },
  { value: "98%",   label: "Matching Accuracy",    caption: "AI-Powered Precision" },
];

export default function Home() {
  return (
    <>
      {/* Hero ---------------------------------------------------------- */}
      <section className="page-tint">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-14 lg:pt-20 pb-12 lg:pb-16 grid lg:grid-cols-[0.95fr_1.25fr] gap-12 items-center">
          {/* LEFT — copy + CTAs */}
          <div>
            <Pill>AI-Powered Recruitment Platform</Pill>
            <h1 className="mt-6 font-display text-[44px] lg:text-[60px] leading-[1.04] font-extrabold tracking-tight">
              Find the Right Talent <br />
              Faster with <span className="gradient-text">AI</span>
            </h1>
            <p className="mt-6 text-ink-500 text-[15px] lg:text-[16px] max-w-[480px] leading-[1.7]">
              HireMind helps recruiters, agencies, and employers automate hiring
              with intelligent candidate matching, resume analysis, screening
              automation, and hiring insights.
            </p>

            <HeroActions
              primary={{ label: "Start Free Trial", href: "/signup", icon: "arrow" }}
              secondary={{ label: "Book Live Demo", href: "/book-demo", icon: "play" }}
            />

            <div className="mt-10 flex items-center gap-2.5 text-ink-700 text-[14px]">
              <span className="inline-flex w-8 h-8 rounded-md bg-brand-50 items-center justify-center text-brand-600">
                <MailIcon />
              </span>
              contactus@arvantra-ai.com
            </div>
          </div>

          {/* RIGHT — visual diagram */}
          <Diagram />
        </div>
      </section>

      {/* Stats strip --------------------------------------------------- */}
      <StatsStrip stats={STATS} />

      <div className="h-8 lg:h-12" />
    </>
  );
}

function Diagram() {
  return (
    <div className="relative">
      <div className="relative z-10 grid grid-cols-[0.85fr_1.2fr_1.1fr_0.5fr] gap-5 items-center">
        <div className="flex flex-col gap-7 justify-around h-[460px] py-4">
          <FloatBadge icon="brain"  title="AI Resume" subtitle="Parsed" />
          <FloatBadge icon="target" title="Top Match" subtitle="Found" />
          <FloatBadge icon="bolt"   title="Interview" subtitle="Ready" />
        </div>
        <CandidateCard />
        <div className="flex flex-col gap-3 justify-between h-[460px] py-2">
          <RailItem icon="doc"   title="Resume Uploaded"   sub="PDF, DOCX" />
          <RailItem icon="brain" title="AI Parsing"        sub="Extracting information" />
          <RailItem icon="users" title="Skill Extraction"  sub="Identifying key skills" />
          <RailItem icon="chart" title="Candidate Ranking" sub="AI ranking top candidates" />
          <RailItem icon="check" title={<span><strong className="font-extrabold">98% Match</strong> Found</span>} sub="Best fit for this role" highlight />
        </div>
        <div className="flex items-center justify-start">
          <div className="card px-3 py-2.5 flex items-center gap-2.5 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.18)]">
            <span className="w-8 h-8 rounded-md bg-green-50 text-green-600 flex items-center justify-center shrink-0"><TrendIcon /></span>
            <div className="leading-tight">
              <div className="text-[12px] font-semibold whitespace-nowrap">Hiring Time</div>
              <div className="text-[10px] text-ink-500">Reduced 70%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard() {
  return (
    <div className="card p-6 text-center shadow-[0_24px_60px_-24px_rgba(109,76,255,0.45)]">
      <div className="mx-auto w-[88px] h-[88px] rounded-full illus-placeholder text-[10px] !min-h-[88px]">[photo]</div>
      <div className="mt-3 font-display font-bold text-[18px] leading-tight">Sarah Johnson</div>
      <div className="text-ink-500 text-[12px]">Senior Java Developer</div>
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {["Java", "Spring Boot", "AWS", "Kubernetes"].map((s) => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 font-semibold">{s}</span>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-[11px] text-ink-500 font-semibold">Match Score</div>
        <CircularScore value={98} />
        <div className="text-[11px] text-green-600 font-semibold -mt-1">Excellent Match</div>
      </div>
    </div>
  );
}

function FloatBadge({ icon, title, subtitle }: { icon: "brain" | "target" | "bolt"; title: string; subtitle: string }) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3 shadow-sm w-[180px]">
      <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
        {icon === "brain"  && <BrainIcon />}
        {icon === "target" && <TargetIcon />}
        {icon === "bolt"   && <BoltIcon />}
      </div>
      <div className="leading-tight">
        <div className="text-[13px] font-semibold text-ink-900">{title}</div>
        <div className="text-[11px] text-ink-500">{subtitle}</div>
      </div>
    </div>
  );
}

function RailItem({ icon, title, sub, highlight }: { icon: "doc" | "brain" | "users" | "chart" | "check"; title: React.ReactNode; sub: string; highlight?: boolean }) {
  return (
    <div className={`card px-3.5 py-2.5 flex items-center gap-3 ${highlight ? "border-green-300 bg-green-50/30" : ""}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${highlight ? "bg-green-50 text-green-600" : "bg-brand-50 text-brand-600"}`}>
        {icon === "doc"   && <DocIcon />}
        {icon === "brain" && <BrainIcon />}
        {icon === "users" && <UsersIcon />}
        {icon === "chart" && <ChartIcon />}
        {icon === "check" && <CheckCircleIcon />}
      </div>
      <div className="leading-tight">
        <div className="text-[12.5px] font-semibold text-ink-900">{title}</div>
        <div className="text-[10.5px] text-ink-500">{sub}</div>
      </div>
    </div>
  );
}

function CircularScore({ value }: { value: number }) {
  const r = 36; const c = 2 * Math.PI * r; const offset = c - (value / 100) * c;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="block mx-auto my-1">
      <circle cx="55" cy="55" r={r} stroke="#E5E7EB" strokeWidth="7" fill="none" />
      <circle cx="55" cy="55" r={r} fill="none" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 55 55)" />
      <text x="55" y="63" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0F172A" fontFamily="var(--font-display)">{value}%</text>
    </svg>
  );
}
