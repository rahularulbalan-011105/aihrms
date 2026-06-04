import Link from "next/link";

const STATS = [
  { value: "2M+",   label: "Candidates Processed", caption: "Across Platform" },
  { value: "50K+",  label: "Active Recruiters",    caption: "Trusted by professionals" },
  { value: "10K+",  label: "Hiring Agencies",      caption: "Growing with AI HRMS" },
  { value: "500K+", label: "Jobs Posted",          caption: "Every Month" },
  { value: "98%",   label: "Matching Accuracy",    caption: "AI-Powered Precision" },
];

export default function Home() {
  return (
    <>
      {/* Hero ---------------------------------------------------------- */}
      <section className="page-tint">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-14 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-[0.95fr_1.25fr] gap-12 items-center">
          {/* LEFT — copy + CTAs */}
          <div>
            <Pill>AI-Powered Recruitment Platform</Pill>
            <h1 className="mt-6 font-display text-[44px] lg:text-[60px] leading-[1.04] font-extrabold tracking-tight">
              Find the Right Talent <br />
              Faster with <span className="gradient-text">AI</span>
            </h1>
            <p className="mt-6 text-ink-500 text-[15px] lg:text-[16px] max-w-[480px] leading-[1.7]">
              AI HRMS helps recruiters, agencies, and employers automate hiring
              with intelligent candidate matching, resume analysis, screening
              automation, and hiring insights.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white text-[14px] font-semibold shadow-[0_10px_30px_-10px_rgba(109,76,255,0.55)] hover:opacity-95 transition"
                style={{ background: "var(--gradient-brand)" }}
              >
                Start Free Trial
                <ArrowIcon />
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-brand-300 text-brand-700 text-[14px] font-semibold hover:bg-brand-50 transition"
              >
                Book Live Demo
                <PlayIcon />
              </Link>
            </div>

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
      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-[1280px] card px-6 lg:px-10 py-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <StatIcon />
              </div>
              <div className="leading-tight">
                <div className="font-display font-extrabold text-[22px] text-ink-900">{s.value}</div>
                <div className="text-[12px] font-semibold text-ink-900">{s.label}</div>
                <div className="text-[10px] text-ink-500">{s.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-16 lg:h-24" />
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
      <Link href="/candidate/sarah" className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-[12.5px] font-semibold shadow-sm hover:opacity-95 transition" style={{ background: "var(--gradient-brand)" }}>
        View Candidate Profile <ArrowIcon size={12} />
      </Link>
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

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12.5px] font-semibold border border-brand-100"><span className="text-brand-500">✦</span>{children}</span>;
}
function ArrowIcon({ size = 14 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function PlayIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M6.5 5.5l4 2.5-4 2.5v-5z" fill="currentColor" /></svg>; }
function MailIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" /></svg>; }
function BrainIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 4c-2.2 0-4 1.8-4 4v.5C4 9.7 3 11 3 12.5S4 15 5 15.5V16c0 2.2 1.8 4 4 4 1 0 2-.4 2.7-1H12c.7.6 1.7 1 2.7 1 2.2 0 4-1.8 4-4v-.5c1-.4 2-1.7 2-3s-1-2.6-2-3V8c0-2.2-1.8-4-4-4-1 0-2 .4-2.7 1H12c-.7-.6-1.7-1-2.7-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>; }
function TargetIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>; }
function BoltIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" /></svg>; }
function DocIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /><path d="M14 2v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.6" /></svg>; }
function UsersIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>; }
function ChartIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" /><rect x="7" y="13" width="3" height="5" fill="currentColor" /><rect x="12" y="9" width="3" height="9" fill="currentColor" /><rect x="17" y="6" width="3" height="12" fill="currentColor" /></svg>; }
function CheckCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function TrendIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 8h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function StatIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1-4 4-6 7-6s6 2 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>; }
