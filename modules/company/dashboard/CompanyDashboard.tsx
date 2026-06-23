"use client";

import { useEffect, useRef, useState } from "react";
import { getStoredCompanyName } from "@/lib/api/config";
import {
  fetchCompanyDashboard,
  type CompanyDashboardResponse,
} from "@/modules/company/jobs/services/job.service";
import EmptyDashboard from "./components/EmptyDashboard";
import PopulatedDashboard from "./components/PopulatedDashboard";

const ZERO_DASHBOARD: CompanyDashboardResponse = {
  total: 0,
  published: 0,
  drafts: 0,
  activeJobs: [],
};

/* Orchestrator: the company dashboard has two faces. With no jobs it shows the
 * onboarding empty state; once any job exists it shows the live hiring
 * dashboard. A single dashboard call returns both the job-status counts (which
 * decide the face — total > 0 → populated) and the Active-Jobs rows. */
export default function CompanyDashboard() {
  const [companyName, setCompanyName] = useState("");
  const [dashboard, setDashboard] = useState<CompanyDashboardResponse>(ZERO_DASHBOARD);
  const [ready, setReady] = useState(false);
  // Guard against React StrictMode double-invoking the fetch effect in dev,
  // which would call /jobs/dashboard twice. The ref persists across the
  // double-mount, so the request fires exactly once.
  const fetched = useRef(false);

  useEffect(() => {
    setCompanyName(getStoredCompanyName() ?? "");
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchCompanyDashboard()
      .then((data) => setDashboard(data))
      .catch(() => {
        // non-fatal — fall back to the empty state if company_api is unavailable
        setDashboard(ZERO_DASHBOARD);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="px-4 py-3 max-w-[1400px] mx-auto">
        <div className="py-24 text-center text-ink-400 text-[13px]">Loading dashboard…</div>
      </div>
    );
  }

  const counts = {
    total: dashboard.total,
    published: dashboard.published,
    drafts: dashboard.drafts,
  };

  return dashboard.total > 0 ? (
    <PopulatedDashboard companyName={companyName} counts={counts} activeJobs={dashboard.activeJobs} />
  ) : (
    <EmptyDashboard companyName={companyName} counts={counts} />
  );
}
