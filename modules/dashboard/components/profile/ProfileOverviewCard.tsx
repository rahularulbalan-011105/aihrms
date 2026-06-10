import type { FullProfile } from "@/modules/auth/services/candidate.service";

const MATCH_SEGMENTS = [
  { label: "Skills Match",     pct: 45, color: "#22c55e" },
  { label: "Experience Match", pct: 30, color: "#3b82f6" },
  { label: "Education Match",  pct: 10, color: "#6d4cff" },
  { label: "Other Factors",    pct: 15, color: "#d1d5db" },
];

function formatExp(years: number | null): string {
  if (!years) return "—";
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  if (y === 0) return `${m} Mos`;
  if (m === 0) return `${y} Yr${y !== 1 ? "s" : ""}`;
  return `${y} Yr${y !== 1 ? "s" : ""} ${m} Mos`;
}

function toLabel(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

interface Props { profile: FullProfile | null; }

export default function ProfileOverviewCard({ profile }: Props) {
  const empTypes = profile?.preferences
    .filter(p => p.type === "EMPLOYMENT_TYPE")
    .map(p => toLabel(p.value))
    .join(", ") || "—";

  const fields = [
    { label: "Current Role",              value: profile?.currentRole        || "—" },
    { label: "Experience",                value: formatExp(profile?.totalExperienceYears ?? null) },
    { label: "Current Company",           value: profile?.currentCompany     || "—" },
    { label: "Preferred Employment Type", value: empTypes },
    { label: "Preferred Location",        value: profile?.preferredLocation  || "—" },
    { label: "Expected Salary (CTC)",     value: profile?.expectedSalary     || "—" },
    { label: "Notice Period",             value: profile?.noticePeriod || profile?.workExperiences?.find(w => w.currentlyWorking)?.noticePeriod || "—" },
    { label: "Open to Relocate",          value: profile ? (profile.openToRelocate ? "Yes" : "No") : "—" },
  ];

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: field grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <div className="text-[11.5px] text-ink-400 font-medium">{label}</div>
              <div className="text-[13.5px] font-semibold text-ink-900 mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        {/* Right: match score (static — AI feature pending) */}
        <div className="lg:w-[280px] shrink-0 border-t lg:border-t-0 lg:border-l border-ink-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="text-[12.5px] font-semibold text-ink-700 mb-3">
            Overall Match Score <span className="text-ink-400 font-normal">(Based on your profile)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0">
              <div className="w-full h-full rounded-full" style={{
                background: `conic-gradient(
                  ${MATCH_SEGMENTS[0].color} 0% 45%,
                  ${MATCH_SEGMENTS[1].color} 45% 75%,
                  ${MATCH_SEGMENTS[2].color} 75% 85%,
                  ${MATCH_SEGMENTS[3].color} 85% 100%
                )`,
              }} />
              <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">92%</span>
                <span className="text-[9px] text-ink-500 font-medium">High Match</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {MATCH_SEGMENTS.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-[11px] text-ink-600">{label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-ink-700">{pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-ink-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
