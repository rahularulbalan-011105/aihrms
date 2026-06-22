"use client";

import { useEffect, useState } from "react";
import { getStoredCompanyName } from "@/lib/api/config";
import {
  fetchJobCounts,
  type JobCountsResponse,
} from "@/modules/company/jobs/services/job.service";
import EmptyDashboard from "./components/EmptyDashboard";
import PopulatedDashboard from "./components/PopulatedDashboard";

const ZERO_COUNTS: JobCountsResponse = { total: 0, published: 0, drafts: 0 };

/* Orchestrator: the company dashboard has two faces. With no jobs it shows the
 * onboarding empty state; once any job exists it shows the live hiring
 * dashboard. The job-count API decides which — total > 0 → populated view. */
export default function CompanyDashboard() {
  const [companyName, setCompanyName] = useState("");
  const [counts, setCounts] = useState<JobCountsResponse>(ZERO_COUNTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompanyName(getStoredCompanyName() ?? "");
  }, []);

  useEffect(() => {
    let active = true;
    fetchJobCounts()
      .then((c) => {
        if (active) setCounts(c);
      })
      .catch(() => {
        // non-fatal — fall back to the empty state if company_api is unavailable
        if (active) setCounts(ZERO_COUNTS);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="px-4 py-3 max-w-[1400px] mx-auto">
        <div className="py-24 text-center text-ink-400 text-[13px]">Loading dashboard…</div>
      </div>
    );
  }

  return counts.total > 0 ? (
    <PopulatedDashboard companyName={companyName} counts={counts} />
  ) : (
    <EmptyDashboard companyName={companyName} counts={counts} />
  );
}
