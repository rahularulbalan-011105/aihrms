"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredCompanyName } from "@/lib/api/config";
import { fetchJob, type JobDetail } from "./services/job.service";
import { NextCard, Detail } from "./components/publish-success/pieces";
import { SuccessRail } from "./components/publish-success/SuccessRail";
import {
  ArrowRight, BriefIcon, BuildingIcon, GridIcon, PaperPlane, PinIcon,
  ShareIcon, ShieldIcon, ShortlistIcon, SuccessGraphic, TargetIcon, UserIcon,
} from "./components/publish-success/icons";

const DASH = "—";

function formatDate(iso?: string | null): string {
  if (!iso) return DASH;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return DASH;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatMoney(amount: number | null | undefined, currency: string | null): string {
  if (amount == null) return DASH;
  return `${currency || "₹"} ${amount.toLocaleString("en-IN")} per annum`;
}
function formatExperience(min: number | null | undefined, max: number | null | undefined): string {
  if (min == null && max == null) return DASH;
  if (min != null && max != null) return `${min} – ${max} Years`;
  return `${min ?? max} Years`;
}

export default function PublishSuccess({ jobId }: { jobId?: string }) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    setCompanyName(getStoredCompanyName() ?? "");
    if (jobId) fetchJob(jobId).then(setJob).catch(() => {});
  }, [jobId]);

  const jobHref = jobId ? `/company/jobs/${jobId}/applications` : "/company/jobs";
  const locationText = job?.workplaceLocation
    ? `${job.workplaceLocation}${job.workMode ? ` (${job.workMode})` : ""}`
    : DASH;
  const openingsText =
    job?.openings != null ? `${job.openings} Opening${job.openings === 1 ? "" : "s"}` : DASH;

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          {/* Hero success */}
          <div className="bg-white border border-ink-100 rounded-xl px-6 py-7 flex flex-col md:flex-row items-center gap-6">
            <SuccessGraphic />
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-[22px] font-extrabold inline-flex items-center gap-2">
                Job Published Successfully! <span aria-hidden="true">🎉</span>
              </h1>
              <p className="text-ink-500 text-[13.5px] mt-1">Your job post is now live and visible to candidates.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Link href={jobHref} className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
                  View Job Post <PaperPlane />
                </Link>
                <Link href="/company/dashboard" className="px-4 py-2.5 rounded-lg border border-brand-300 text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition inline-flex items-center gap-2">
                  <GridIcon /> Go to Jobs Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Published Job Summary */}
          <div className="bg-white border border-ink-100 rounded-xl p-5">
            <h2 className="font-display text-[15px] font-extrabold mb-3">Published Job Summary</h2>
            <div className="grid grid-cols-[88px_1fr] gap-4 items-start">
              <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-3 grid place-items-center">
                <span className="w-12 h-12 rounded-md bg-white text-brand-700 grid place-items-center"><BriefIcon /></span>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
                </div>
              </div>
              <div>
                <div className="font-display text-[17px] font-extrabold">{job?.title ?? DASH}</div>
                <div className="flex items-center gap-3 text-[12px] text-ink-600 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1"><BuildingIcon /> {companyName || DASH}</span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1"><PinIcon /> {locationText}</span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1"><BriefIcon /> {job?.employmentType ?? DASH}</span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1"><UserIcon /> {openingsText}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pt-3 border-t border-ink-100">
                  <Detail label="Department" value={job?.department ?? DASH} />
                  <Detail label="Salary" value={formatMoney(job?.annualCtc, job?.currency ?? null)} />
                  <Detail label="Role / Category" value={job?.roleCategory ?? DASH} />
                  <Detail label="Notice Period" value={job?.noticePeriod ?? DASH} />
                  <Detail label="Experience" value={formatExperience(job?.experienceMinYears, job?.experienceMaxYears)} />
                  <Detail label="Job ID" value={job?.id ?? DASH} />
                  <Detail label="Posted On" value={formatDate(job?.publishedAt ?? job?.createdAt)} />
                </div>
                <Link href={jobHref} className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-brand-700 font-semibold">
                  View Full Job Details <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div>
            <h2 className="font-display text-[15px] font-extrabold mb-2">What&apos;s Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <NextCard icon={<TargetIcon />} title="Track Applications" body="We'll notify you when candidates start applying." action="View Applications" tint="bg-blue-50 text-blue-700" />
              <NextCard icon={<ShortlistIcon />} title="Shortlist Candidates" body="Review and shortlist the best candidates for your job." action="Go to Candidates" tint="bg-orange-50 text-orange-700" />
              <NextCard icon={<ShareIcon />} title="Share with your Network" body="Increase visibility by sharing this job with your network." action="Share Job" tint="bg-brand-50 text-brand-700" />
            </div>
          </div>

          {/* Confirmation strip */}
          <div className="bg-white border border-ink-100 rounded-xl p-4 flex items-start gap-3">
            <span className="w-10 h-10 rounded-md bg-brand-50 text-brand-700 grid place-items-center"><ShieldIcon /></span>
            <p className="text-[12.5px] text-ink-700 flex-1">
              I confirm that all the information provided is accurate and complies with company policies and applicable laws.
            </p>
            <span className="w-5 h-5 rounded bg-brand-600 text-white grid place-items-center text-[11px]">✓</span>
          </div>
        </div>

        {/* Right Rail */}
        <SuccessRail />
      </div>
    </div>
  );
}
