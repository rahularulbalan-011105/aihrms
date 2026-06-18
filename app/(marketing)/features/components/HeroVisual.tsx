import { Glyph, BrainIcon, TrendIcon, CheckIcon } from "@/components/marketing/icons";

const HERO_PILLS = [
  { icon: "shield", label: "Fake Job Detection", tone: "green" },
  { icon: "search", label: "Semantic Search", tone: "purple" },
  { icon: "plane", label: "Auto Job Apply", tone: "purple" },
  { icon: "doc", label: "Resume Parsing", tone: "orange" },
];

/** Three-column hero composition shown on the Features page. */
export default function HeroVisual() {
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
          {HERO_PILLS.map((f) => (
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
                <Glyph name={f.icon} size={11} />
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
                { value: "248", label: "Jobs" },
                { value: "5,214", label: "Candidates" },
                { value: "324", label: "Interviews" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded bg-brand-50 px-1.5 py-1.5 text-center"
                >
                  <div className="text-[8px] text-ink-500">{s.label}</div>
                  <div className="font-display font-extrabold text-[14px] text-brand-700">
                    {s.value}
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
            ].map((candidate) => (
              <div
                key={candidate.name}
                className="flex items-center gap-2 py-1.5 border-t border-ink-100 first:border-0"
              >
                <div className="w-6 h-6 rounded-full illus-placeholder text-[7px] !min-h-0 !p-0">
                  [ph]
                </div>
                <div className="flex-1 leading-tight">
                  <div className="text-[10.5px] font-semibold">{candidate.name}</div>
                  <div className="text-[9px] text-ink-500">{candidate.role}</div>
                </div>
                <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-1 py-0.5 rounded">
                  {candidate.match}% Match
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
