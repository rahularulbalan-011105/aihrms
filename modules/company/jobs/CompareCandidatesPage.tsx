import Link from "next/link";
import { CANDIDATES, GRID, JOB_TITLE, matchHex, matchLabel, matchText } from "./components/compare/data";
import { Cell, CompareRow, Dot, ExpLine, Ring } from "./components/compare/pieces";
import { ComparisonRail } from "./components/compare/ComparisonRail";
import { ArrowLeft, ArrowRight, BriefIcon, CapIcon, ClockIcon, DocIcon, DownloadIcon, PinIcon, ShareIcon, SkillsIcon, StarIcon, TargetIcon } from "./components/compare/icons";

/* Compare Candidates — side-by-side comparison grid (mock data). */
export default function CompareCandidatesPage({ jobId }: { jobId: string }) {
  const applicationsHref = `/company/jobs/${jobId}/applications`;
  const ranked = [...CANDIDATES].sort((a, b) => b.match - a.match);
  const best = ranked[0];

  return (
    <div className="px-4 py-3 max-w-[1500px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mb-2">
        <Link href="/company/jobs" className="hover:text-ink-800">Jobs</Link>
        <span aria-hidden="true">›</span>
        <Link href={applicationsHref} className="hover:text-ink-800">{JOB_TITLE}</Link>
        <span aria-hidden="true">›</span>
        <Link href={applicationsHref} className="hover:text-ink-800">View Applications</Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink-700 font-medium">Compare Candidates</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Compare Candidates</h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">{CANDIDATES.length} Selected</span>
          </div>
          <p className="text-ink-500 text-[13.5px] mt-1">Side-by-side comparison to help you choose the best fit for the role.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={applicationsHref} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink-200 text-ink-700 text-[13px] font-semibold hover:bg-ink-100 transition-colors">
            <ArrowLeft /> Back to Applications
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink-200 text-ink-700 text-[13px] font-semibold hover:bg-ink-100 transition-colors">
            <ShareIcon /> Share Comparison
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity">
            <DownloadIcon /> Export Report
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Main ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Candidate header cards */}
          <div className={`${GRID} gap-3`}>
            <div />
            {CANDIDATES.map((c) => (
              <div key={c.id} className="card p-4">
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-brand-600 text-white grid place-items-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <span className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-bold text-[13px] shrink-0">{c.initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display font-bold text-[13.5px] text-ink-900 truncate">{c.name}</span>
                      <span className={`text-[11px] font-bold ${matchText(c.match)}`}>{c.match}%</span>
                    </div>
                    <div className="text-[11.5px] text-ink-600 mt-0.5">{c.company}</div>
                    <div className="text-[11px] text-ink-500 mt-1 flex items-center gap-1"><PinIcon /> {c.location}</div>
                    <div className="text-[11px] text-ink-500 mt-0.5 flex items-center gap-1"><ClockIcon /> {c.exp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="card overflow-hidden">
            <CompareRow label="Overall Match" sub="AI-powered score" icon={<TargetIcon />}>
              {CANDIDATES.map((c) => (
                <Cell key={c.id}>
                  <div className="flex items-center gap-2.5">
                    <Ring pct={c.match} color={matchHex(c.match)} />
                    <div>
                      <div className={`font-display font-extrabold text-[20px] ${matchText(c.match)}`}>{c.match}%</div>
                      <div className={`text-[11px] font-semibold ${matchText(c.match)}`}>{matchLabel(c.match)}</div>
                    </div>
                  </div>
                </Cell>
              ))}
            </CompareRow>

            <CompareRow label="Key Strengths" icon={<StarIcon />}>
              {CANDIDATES.map((c) => (
                <Cell key={c.id}>
                  <ul className="space-y-1.5">
                    {c.strengths.map((s) => (
                      <li key={s} className="text-[12px] text-ink-700 flex items-start gap-1.5">
                        <span className="text-brand-500 mt-1.5 w-1 h-1 rounded-full bg-brand-500 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </Cell>
              ))}
            </CompareRow>

            <CompareRow label="Skills" sub="Top 5 skills" icon={<SkillsIcon />}>
              {CANDIDATES.map((c) => (
                <Cell key={c.id}>
                  <div className="space-y-2">
                    {c.skills.map((s) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <span className="text-[11px] text-ink-600 w-20 shrink-0 truncate">{s.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: matchHex(s.pct) }} />
                        </div>
                        <span className="text-[11px] font-semibold text-ink-700 w-8 text-right">{s.pct}%</span>
                      </div>
                    ))}
                    <button className="text-[11.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors inline-flex items-center gap-1 pt-1">
                      View All Skills <ArrowRight />
                    </button>
                  </div>
                </Cell>
              ))}
            </CompareRow>

            <CompareRow label="Experience Summary" sub="Highlights" icon={<BriefIcon />}>
              {CANDIDATES.map((c) => (
                <Cell key={c.id}>
                  <div className="space-y-1.5 text-[12px]">
                    <ExpLine label="Total Experience" value={c.experience.total} />
                    <ExpLine label="Relevant Experience" value={c.experience.relevant} />
                    <ExpLine label="Longest Tenure" value={`${c.experience.tenure} (${c.experience.tenureCo})`} />
                    <ExpLine label="Companies Worked" value={String(c.experience.companies)} />
                  </div>
                  <button className="text-[11.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors inline-flex items-center gap-1 pt-2">
                    View Full Experience <ArrowRight />
                  </button>
                </Cell>
              ))}
            </CompareRow>

            <CompareRow label="Education" sub="Highest Qualification" icon={<CapIcon />}>
              {CANDIDATES.map((c) => (
                <Cell key={c.id}>
                  <div className="font-semibold text-[12.5px] text-ink-900">{c.education.degree}</div>
                  <div className="text-[12px] text-ink-600 mt-0.5">{c.education.inst}</div>
                  <div className="text-[12px] text-ink-500">{c.education.year}</div>
                  <button className="text-[11.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors inline-flex items-center gap-1 pt-2">
                    View Education <ArrowRight />
                  </button>
                </Cell>
              ))}
            </CompareRow>

            <CompareRow label="Overview" sub="At a glance" icon={<DocIcon />} last>
              {CANDIDATES.map((c) => (
                <Cell key={c.id}>
                  <p className="text-[12px] text-ink-600 leading-relaxed">{c.overview}</p>
                </Cell>
              ))}
            </CompareRow>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-5 text-[12px] text-ink-500 px-1">
            <span className="text-ink-400">Scores are AI-powered and based on resume analysis, job requirements and public profile data.</span>
            <span className="flex items-center gap-1.5"><Dot color="#16a34a" /> Excellent (80% and above)</span>
            <span className="flex items-center gap-1.5"><Dot color="#f59e0b" /> Good (60% - 79%)</span>
            <span className="flex items-center gap-1.5"><Dot color="#ef4444" /> Needs Improvement (&lt;60%)</span>
          </div>
        </div>

        {/* ── Right rail ── */}
        <ComparisonRail ranked={ranked} best={best} />
      </div>
    </div>
  );
}
