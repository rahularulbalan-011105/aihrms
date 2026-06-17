import CTABanner from "@/components/marketing/CTABanner";

const STATS = [
  { value: "2M+", label: "Candidates Processed", caption: "with AI" },
  { value: "50K+", label: "Recruiters Using", caption: "AI HRMS" },
  { value: "10K+", label: "Agencies Trust", caption: "AI HRMS" },
  { value: "98%", label: "Matching Accuracy", caption: "with AI" },
  { value: "70%", label: "Faster Hiring with", caption: "AI Automation" },
];

export default function AICapabilitiesPage() {
  return (
    <>
      <section className="page-tint">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-14 lg:pt-20 pb-12 text-center">
          <Pill>Powerful AI. Smarter Hiring.</Pill>
          <h1 className="mt-5 font-display text-[42px] lg:text-[56px] leading-[1.05] font-extrabold tracking-tight">
            <span className="gradient-text">AI</span> Capabilities That Drive
            Results
          </h1>
          <p className="mt-5 text-ink-500 text-[15px] max-w-[700px] mx-auto leading-relaxed">
            HireMind uses advanced AI models and automation to simplify
            recruitment, reduce manual effort, and deliver the right outcomes.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <CapCard
            icon="match"
            tone="purple"
            title="AI Job Matching"
            body="Matches candidates to the most relevant jobs based on skills, experience and intent."
          >
            <MatchBars />
          </CapCard>
          <CapCard
            icon="parse"
            tone="blue"
            title="AI Resume Parsing"
            body="Extracts and structures information from resumes with high accuracy in seconds."
          >
            <SkillsExtracted />
          </CapCard>
          <CapCard
            icon="search"
            tone="purple"
            title="Semantic Search"
            body="Find the best candidates or jobs using natural language, not just keywords."
          >
            <SearchBlock />
          </CapCard>
          <CapCard
            icon="trophy"
            tone="green"
            title="AI Candidate Ranking"
            body="Ranks candidates by relevance, experience, skills, and potential fit using AI."
          >
            <TopCandidate />
          </CapCard>
          <CapCard
            icon="screen"
            tone="orange"
            title="AI Screening & Shortlisting"
            body="Automatically screens candidates and shortlists the most qualified profiles."
          >
            <ScreeningTable />
          </CapCard>
          <CapCard
            icon="shield"
            tone="red"
            title="Fake Job Detection"
            body="Detects scam, expired, misleading and low-quality job postings automatically."
          >
            <RiskWarn />
          </CapCard>
          <CapCard
            icon="duplicate"
            tone="blue"
            title="Duplicate Job Detection"
            body="Identifies and merges duplicate job postings across multiple platforms."
          >
            <DuplicateBlock />
          </CapCard>
          <CapCard
            icon="apply"
            tone="purple"
            title="Auto Job Apply"
            body="Automatically applies to best matching jobs based on your preferences."
          >
            <AutoApplyBlock />
          </CapCard>
          <CapCard
            icon="alert"
            tone="orange"
            title="Fake Profile Identification"
            body="Detects fake resumes, inflated experience, and suspicious candidate profiles."
          >
            <RiskGauge />
          </CapCard>
          <CapCard
            icon="analytics"
            tone="green"
            title="Hiring Analytics"
            body="Provides actionable insights and predictions to improve hiring quality and speed."
          >
            <AnalyticsBlock />
          </CapCard>
        </div>
      </section>

      <section className="px-6 lg:px-10 mt-12">
        <div className="mx-auto max-w-[1400px] card px-6 lg:px-10 py-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <StatGlyph />
              </div>
              <div className="leading-tight">
                <div className="font-display font-extrabold text-[22px] text-ink-900">
                  {s.value}
                </div>
                <div className="text-[12px] font-semibold text-ink-900">
                  {s.label}
                </div>
                <div className="text-[10px] text-ink-500">{s.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner
        title="AI That Works for You, 24x7"
        description="From intelligent matching to automation and fraud detection, HireMind helps you hire smarter and faster."
        primary={{ label: "Start Free Trial", href: "/signup", icon: "arrow" }}
        secondary={{
          label: "Book Live Demo",
          href: "/book-demo",
          icon: "play",
        }}
      />
      <div className="h-16" />
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12px] font-semibold border border-brand-100">
      <span className="text-brand-500">✦</span>
      {children}
    </span>
  );
}

const ICON_TONE: Record<string, string> = {
  purple: "bg-brand-50 text-brand-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  orange: "bg-orange-50 text-orange-700",
  red: "bg-red-50 text-red-700",
};

function CapCard(props: {
  icon: string;
  tone: keyof typeof ICON_TONE;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center text-[16px] ${ICON_TONE[props.tone]}`}
        >
          <CapIcon name={props.icon} />
        </div>
        <span className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
          AI
        </span>
      </div>
      <div className="mt-3 font-display font-bold text-[14px] leading-tight">
        {props.title}
      </div>
      <p className="mt-1.5 text-ink-500 text-[11.5px] leading-relaxed">
        {props.body}
      </p>
      {props.children && (
        <div className="mt-4 rounded-md bg-ink-100/40 p-3 border border-ink-100">
          {props.children}
        </div>
      )}
    </div>
  );
}

function CapIcon({ name }: { name: string }) {
  const m: Record<string, string> = {
    match: "👥",
    parse: "📄",
    search: "🔎",
    trophy: "🏆",
    screen: "✓",
    shield: "🛡",
    duplicate: "📋",
    apply: "✈",
    alert: "⚠",
    analytics: "📊",
  };
  return <span>{m[name] ?? "•"}</span>;
}

function StatGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 20c1-4 4-6 7-6s6 2 7 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MatchBars() {
  return (
    <div className="space-y-2.5">
      <div className="text-[10px] text-ink-500 font-semibold">Match Score</div>
      {[98, 92, 86].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full illus-placeholder !min-h-0 text-[7px] !p-0">
            [ph]
          </div>
          <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${v}%`, background: "var(--gradient-brand)" }}
            />
          </div>
          <span className="text-[10px] font-semibold w-7 text-right">{v}%</span>
        </div>
      ))}
    </div>
  );
}

function SkillsExtracted() {
  return (
    <div>
      <div className="text-[10px] text-ink-500 font-semibold">
        Skills Extracted
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["Java", "Spring Boot", "AWS", "SQL", "Kubernetes"].map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-semibold"
          >
            {s}
          </span>
        ))}
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-700 font-semibold">
          +12 more
        </span>
      </div>
    </div>
  );
}

function SearchBlock() {
  return (
    <div>
      <div className="px-2.5 py-2 rounded-md bg-white border border-ink-200 text-[10px] text-ink-700 flex items-center gap-1.5">
        <span className="text-ink-400">🔎</span>
        <span className="leading-tight">
          Java developer with 5 years experience in banking domain
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-brand-700 font-semibold">
          432 Relevant Results Found
        </span>
        <div className="flex -space-x-1.5">
          <span className="w-5 h-5 rounded-full bg-brand-200" />
          <span className="w-5 h-5 rounded-full bg-brand-300" />
          <span className="w-5 h-5 rounded-full bg-brand-400" />
          <span className="text-[9px] font-bold text-ink-500 self-center pl-1">
            +429
          </span>
        </div>
      </div>
    </div>
  );
}

function TopCandidate() {
  return (
    <div>
      <div className="text-[10px] text-ink-500 font-semibold">
        Top Candidate
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full illus-placeholder text-[8px]">
          [ph]
        </div>
        <div className="flex-1 leading-tight">
          <div className="text-[11px] font-bold">Rohan Mehta</div>
          <div className="text-[9px] text-ink-500">Full Stack Developer</div>
        </div>
        <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded">
          96% Match
        </span>
      </div>
    </div>
  );
}

function ScreeningTable() {
  return (
    <div>
      <div className="text-[10px] text-ink-500 font-semibold">
        Screening Status
      </div>
      <div className="mt-2 space-y-1.5 text-[11px]">
        {[
          { label: "Total Candidates", value: "320", dot: "#94A3B8" },
          { label: "Shortlisted", value: "48", dot: "#22C55E" },
          { label: "Rejected", value: "272", dot: "#EF4444" },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-ink-700">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: r.dot }}
              />
              {r.label}
            </div>
            <span className="font-bold">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskWarn() {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
      <div className="text-[11px] font-bold text-red-700 flex items-center gap-1.5">
        ⚠ Risk Level: High
      </div>
      <p className="text-[10px] text-red-600 mt-1">
        This job posting has been flagged as potentially fake.
      </p>
    </div>
  );
}

function DuplicateBlock() {
  return (
    <div>
      <div className="text-[10px] text-ink-500 font-semibold">
        Duplicates Removed
      </div>
      <div className="text-[11px] font-bold mt-0.5">
        12 Duplicate Jobs Merged
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-ink-400">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="text-[14px]">
            📄{i < 3 && <span className="text-ink-300 mx-0.5">›</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function AutoApplyBlock() {
  return (
    <div>
      <div className="text-[10px] text-ink-500 font-semibold">
        Auto Apply Status
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <div className="leading-tight">
          <div className="text-[11px] font-bold">Applied to 25 jobs</div>
          <div className="text-[10px] text-ink-500">Today</div>
        </div>
        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[12px]">
          ✓
        </span>
      </div>
    </div>
  );
}

function RiskGauge() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] text-ink-500 font-semibold self-start">
        Risk Score
      </div>
      <svg width="120" height="65" viewBox="0 0 120 65">
        <defs>
          <linearGradient id="gauge" x1="0" x2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <path
          d="M10 60 A50 50 0 0 1 110 60"
          stroke="url(#gauge)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1="60"
          y1="60"
          x2="92"
          y2="28"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="60" r="3" fill="#0F172A" />
      </svg>
      <div className="text-[11px] font-bold text-red-600 -mt-1">High Risk</div>
    </div>
  );
}

function AnalyticsBlock() {
  return (
    <div className="grid grid-cols-2 gap-2 text-center">
      <div>
        <div className="text-[10px] text-ink-500">Time to Hire</div>
        <div className="text-[15px] font-bold text-green-600">↓ 35%</div>
      </div>
      <div>
        <div className="text-[10px] text-ink-500">Quality of Hire</div>
        <div className="text-[15px] font-bold text-blue-600">↑ 42%</div>
      </div>
    </div>
  );
}
