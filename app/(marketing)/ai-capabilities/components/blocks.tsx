/** Demo preview blocks rendered inside each capability card. */

export function MatchBars() {
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

export function SkillsExtracted() {
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

export function SearchBlock() {
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

export function TopCandidate() {
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

export function ScreeningTable() {
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

export function RiskWarn() {
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

export function DuplicateBlock() {
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

export function AutoApplyBlock() {
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

export function RiskGauge() {
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

export function AnalyticsBlock() {
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

/** Block key → component, so capability data can reference a preview by name. */
export const BLOCKS: Record<string, () => React.ReactElement> = {
  matchBars: MatchBars,
  skillsExtracted: SkillsExtracted,
  searchBlock: SearchBlock,
  topCandidate: TopCandidate,
  screeningTable: ScreeningTable,
  riskWarn: RiskWarn,
  duplicateBlock: DuplicateBlock,
  autoApplyBlock: AutoApplyBlock,
  riskGauge: RiskGauge,
  analyticsBlock: AnalyticsBlock,
};
