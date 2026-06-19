"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listJobs,
  fetchJobCounts,
  type JobApiResponse,
  type JobCountsResponse,
} from "./services/job.service";
import { Pagination } from "@/components/ui/Pagination";
import {
  BriefIcon,
  CalendarIcon,
  ChevronDown,
  DocIcon,
  FunnelIcon,
  UsersIcon,
} from "./shared/icons";
import { StatCard } from "./components/StatCard";
import { FilterSelect } from "./components/FilterSelect";
import { JobCard } from "./components/jobs-list/JobCard";
import {
  JobInsightsPanel,
  RecommendedCandidatesPanel,
  TopSkillsPanel,
} from "./components/jobs-list/RailPanels";

type StatusTab = "ALL" | "PUBLISHED" | "DRAFT" | "CLOSED";

const TABS: { key: StatusTab; label: string }[] = [
  { key: "ALL", label: "All Jobs" },
  { key: "PUBLISHED", label: "Active" },
  { key: "DRAFT", label: "Draft" },
  { key: "CLOSED", label: "Closed" },
];

const PAGE_SIZE = 3;

export default function JobsList() {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [jobs, setJobs] = useState<JobApiResponse[]>([]);
  const [counts, setCounts] = useState<JobCountsResponse>({
    total: 0,
    published: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobCounts()
      .then(setCounts)
      .catch(() => {}); // non-fatal
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const status = tab === "ALL" ? undefined : tab;
    listJobs(status)
      .then(({ content }) => {
        if (active) setJobs(content);
      })
      .catch((err) => {
        if (active)
          setError(err instanceof Error ? err.message : "Failed to load jobs");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab]);

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const pageJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Top skills in demand — aggregated from the loaded jobs (skill → # of jobs).
  const topSkills = (() => {
    const counts = new Map<string, number>();
    for (const job of jobs) {
      for (const skill of job.skills ?? []) {
        counts.set(skill.name, (counts.get(skill.name) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, jobs: count }))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 5);
  })();

  // Reset to the first page whenever the job set changes (tab switch / reload).
  useEffect(() => {
    setPage(1);
  }, [jobs]);

  // Auto-select the first job on the current page when the selection isn't visible.
  useEffect(() => {
    if (pageJobs.length === 0) {
      setSelectedJobId(null);
      return;
    }
    if (!pageJobs.some((job) => job.id === selectedJobId))
      setSelectedJobId(pageJobs[0].id);
  }, [jobs, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabCount: Record<StatusTab, number> = {
    ALL: counts.total,
    PUBLISHED: counts.published,
    DRAFT: counts.drafts,
    CLOSED: Math.max(counts.total - counts.published - counts.drafts, 0),
  };

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Centre column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">
                Jobs
              </h1>
              <p className="text-ink-500 text-[13.5px] mt-1">
                Find the right talent by posting jobs or exploring candidates.
              </p>
            </div>
            <Link
              href="/company/jobs/new"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity"
            >
              <span className="text-[15px]">+</span> Post a New Job
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              iconBg="bg-brand-50 text-brand-600"
              icon={<BriefIcon />}
              value={String(counts.published)}
              label="Active Jobs"
            />
            <StatCard
              iconBg="bg-green-50 text-green-600"
              icon={<UsersIcon />}
              value={String(counts.drafts)}
              label="Draft Jobs"
            />
            <StatCard
              iconBg="bg-blue-50 text-blue-600"
              icon={<DocIcon />}
              value="96"
              label="Applications"
            />
            <StatCard
              iconBg="bg-orange-50 text-orange-600"
              icon={<CalendarIcon />}
              value="12"
              label="Interviews"
            />
          </div>

          {/* Filter bar */}
          <div className="card p-3 flex flex-wrap items-center gap-2">
            <FilterSelect
              label="All Locations"
              options={[
                "All Locations",
                "Bangalore",
                "Hyderabad",
                "Pune",
                "Chennai",
              ]}
            />
            <FilterSelect
              label="Job Function"
              options={["All", "Engineering", "DevOps", "Design"]}
            />
            <FilterSelect
              label="Experience Level"
              options={["All", "Entry", "Mid", "Senior"]}
            />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
              <FunnelIcon /> Filters
            </button>
          </div>

          {/* Tabs + sort */}
          <div className="flex items-center justify-between gap-4 border-b border-ink-100">
            <div className="flex gap-1 flex-wrap">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                    tab === t.key
                      ? "border-brand-600 text-brand-700"
                      : "border-transparent text-ink-500 hover:text-ink-800"
                  }`}
                >
                  {t.label} ({tabCount[t.key]})
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-ink-500 shrink-0">
              Sort by:{" "}
              <span className="font-semibold text-ink-700">Most Recent</span>
              <ChevronDown />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16 text-center text-ink-400 text-[13px]">
              Loading jobs…
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700"
            >
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="card p-10 flex flex-col items-center text-center">
              <h2 className="font-display text-[16px] font-extrabold text-ink-900">
                No jobs here yet
              </h2>
              <p className="text-ink-500 text-[12.5px] mt-1 mb-4">
                {tab === "DRAFT"
                  ? "You have no draft jobs."
                  : "Post your first job to start attracting candidates."}
              </p>
              <Link
                href="/company/jobs/new"
                className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <span>+</span> Post a Job
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {pageJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    selected={job.id === selectedJobId}
                    onSelect={() => setSelectedJobId(job.id)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center pt-1">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-4 hidden lg:block">
          <JobInsightsPanel counts={counts} />
          <RecommendedCandidatesPanel />
          <TopSkillsPanel skills={topSkills} />
        </aside>
      </div>
    </div>
  );
}
