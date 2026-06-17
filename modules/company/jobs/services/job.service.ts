import { API, getAccessToken } from "@/lib/api/config";
import type { JobDraft } from "../shared/types";

export interface JobApiResponse {
  id: string;
  title: string;
  department: string | null;
  workMode: string | null;
  employmentType: string | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "EXPIRED";
  openings: number;
  workplaceLocation: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobCountsResponse {
  total: number;
  published: number;
  drafts: number;
}

function jsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAccessToken()}`,
  };
}

/** "12,00,000" → 1200000 ; "" / undefined → null */
function toNum(value: string | undefined | null): number | null {
  if (value == null) return null;
  const cleaned = String(value).replace(/,/g, "").trim();
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** "" → null ; otherwise the trimmed string (used for optional date fields) */
function orNull(value: string | undefined | null): string | null {
  const v = value?.trim();
  return v ? v : null;
}

/** Maps the in-memory wizard draft to the backend JobUpsertRequest payload. */
function draftToRequest(draft: JobDraft) {
  const d = draft.details;
  const r = draft.requirements;
  const c = draft.compensation;
  const p = draft.preferences;

  return {
    details: {
      title: d.title.trim(),
      roleCategory: orNull(d.roleCategory),
      department: orNull(d.department),
      employmentType: orNull(d.employmentType),
      openings: d.openings,
      workLocationType: orNull(d.workLocationType),
      workplaceLocation: orNull(d.workplaceLocation),
      workMode: orNull(d.workMode),
      startingDate: orNull(d.startingDate),
      description: orNull(d.description),
      experienceMinYears: toNum(d.experienceMin),
      experienceMaxYears: toNum(d.experienceMax),
      noticePeriod: orNull(d.noticePeriod),
      educationQualification: orNull(d.educationQualification),
      industry: orNull(d.industry),
      jobShift: orNull(d.jobShift),
      applicationDeadline: orNull(d.applicationDeadline),
      jobExpiry: orNull(d.jobExpiry),
      confidential: d.confidential === "Yes",
      showApplicationCount: d.showApplicationCount,
    },
    requirements: {
      requirementExpYears: r.minExperience ?? null,
      requirementExpUnit: orNull(r.experienceUnit),
      seniorityLevel: orNull(r.experienceLevel),
      responsibilities: orNull(r.responsibilities),
      skills: r.skills
        .filter((s) => s.name?.trim())
        .map((s) => ({
          name: s.name.trim(),
          minExperience: s.years ?? 0,
          unit: "YEARS",
          mandatory: true,
        })),
    },
    compensation: {
      salaryType: orNull(c.salaryType),
      currency: orNull(c.currency),
      annualCtc: toNum(c.annualCtc),
      basicPay: toNum(c.basicPay),
      hra: toNum(c.hra),
      specialAllowance: toNum(c.specialAllowance),
      otherAllowances: toNum(c.otherAllowances),
      variablePay: toNum(c.variablePay),
      joiningBonus: toNum(c.joiningBonus),
      benefits: c.benefits,
      otherBenefits: orNull(c.otherBenefits),
    },
    preferences: {
      workArrangement: orNull(p.workArrangement),
      prefWorkLocation: orNull(p.workLocation),
      workingHours: orNull(p.workingHours),
      timeZone: orNull(p.timeZone),
      seniority: orNull(p.seniority),
      employmentTypes: p.employmentTypes,
      noticePeriods: p.noticePeriods,
      genderPreference: orNull(p.genderPreference),
      diversityHiring: orNull(p.diversityHiring),
      equalOpportunity: p.equalOpportunity,
      additionalPreferences: orNull(p.additionalPreferences),
    },
  };
}

/** POST /company/jobs/publish — creates the job and publishes it in one call. */
export async function publishJob(draft: JobDraft): Promise<{ id: string }> {
  const res = await fetch(`${API.COMPANY}/company/jobs/publish`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(draftToRequest(draft)),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Failed to publish job (${res.status})`);
  return { id: json.data.id as string };
}

/** POST /company/jobs/draft — saves the job without publishing. */
export async function saveDraftJob(draft: JobDraft): Promise<{ id: string }> {
  const res = await fetch(`${API.COMPANY}/company/jobs/draft`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(draftToRequest(draft)),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Failed to save draft (${res.status})`);
  return { id: json.data.id as string };
}

/** GET /company/jobs — paginated list, optionally filtered by status. */
export async function listJobs(
  status?: "PUBLISHED" | "DRAFT",
  page = 0,
  size = 20,
): Promise<{ content: JobApiResponse[]; totalElements: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);

  const res = await fetch(`${API.COMPANY}/company/jobs?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Failed to load jobs (${res.status})`);
  return {
    content: (json?.data?.content ?? []) as JobApiResponse[],
    totalElements: (json?.data?.totalElements ?? 0) as number,
  };
}

/** GET /company/jobs/counts — totals for the dashboard stat card. */
export async function fetchJobCounts(): Promise<JobCountsResponse> {
  const res = await fetch(`${API.COMPANY}/company/jobs/counts`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Failed to load job counts (${res.status})`);
  return json.data as JobCountsResponse;
}
