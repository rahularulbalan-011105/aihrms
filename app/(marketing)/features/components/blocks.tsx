import { Glyph, SearchIcon, UploadCloudIcon, CheckIcon } from "@/components/marketing/icons";

/** Bulk resume upload card (full-width, top of the agencies column). */
export function BulkResumeCard() {
  return (
    <div className="card p-4 lg:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-md bg-brand-50 flex items-center justify-center text-brand-600">
          <UploadCloudIcon size={16} />
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

export function SemanticSearchBlock() {
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

export function FakeProfileBlock() {
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

export function TeamMembersBlock() {
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

export function ApplicationStages() {
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
            <Glyph name={s.icon} />
          </div>
          <div className="text-[8px] mt-1 text-ink-700">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Block key → component, referenced from feature card data. */
export const BLOCKS: Record<string, () => React.ReactElement> = {
  applicationStages: ApplicationStages,
  semanticSearch: SemanticSearchBlock,
  fakeProfile: FakeProfileBlock,
  teamMembers: TeamMembersBlock,
};
