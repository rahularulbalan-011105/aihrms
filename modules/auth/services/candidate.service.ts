import { API, getAccessToken } from "@/lib/api/config";
import type { CandidateRegStep1Data } from "../types/auth.types";

/* ── helpers ── */
async function authedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  if (!token) throw new Error("No access token");
  return fetch(`${API.CANDIDATE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") { window.location.href = "/login"; }
    throw new Error("Session expired. Please log in again.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message ?? `API error ${res.status}`);
  return json.data as T;
}

/* ── Master data (public — no auth required) ── */

export interface DegreeCourse { name: string; category: string; }
export interface EducationTypeItem { name: string; }

export async function fetchDegreeCourses(): Promise<DegreeCourse[]> {
  const res = await fetch(`${API.CANDIDATE}/master/degrees`);
  const json = await res.json().catch(() => ({}));
  return (json.data ?? []) as DegreeCourse[];
}

export async function fetchEducationTypes(): Promise<EducationTypeItem[]> {
  const res = await fetch(`${API.CANDIDATE}/master/education-types`);
  const json = await res.json().catch(() => ({}));
  return (json.data ?? []) as EducationTypeItem[];
}

/* ── Basic Info ── */

/** PUT /profile/basic-info */
export async function updateCandidateBasicInfo(data: CandidateRegStep1Data): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("No access token — register first");

  const body = {
    fullName:        `${data.firstName} ${data.lastName}`.trim(),
    countryCode:     "+91",
    phoneNumber:     data.phone,
    dateOfBirth:     data.dateOfBirth || null,
    currentLocation: data.currentLocation,
    linkedinUrl:     null,
  };

  const res = await fetch(`${API.CANDIDATE}/profile/basic-info`, {
    method:  "PUT",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Candidate API error ${res.status}`);
  }
}

/* ── Education ── */

export interface EducationPayload {
  degree: string;
  institution: string;
  specialization?: string;
  location?: string;
  yearOfPassing?: string;
  grade?: string;
  educationType?: string;
  description?: string;
}

/** POST /profile/educations → returns backend-assigned education id */
export async function addEducation(payload: EducationPayload): Promise<string> {
  const res = await authedFetch("/profile/educations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const profile = await handleResponse<{ educations: { id: string }[] }>(res);
  const list = profile.educations ?? [];
  return list[list.length - 1]?.id ?? crypto.randomUUID();
}

/** PUT /profile/educations/:id */
export async function updateEducation(id: string, payload: EducationPayload): Promise<void> {
  const res = await authedFetch(`/profile/educations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await handleResponse<unknown>(res);
}

/** DELETE /profile/educations/:id */
export async function deleteEducation(id: string): Promise<void> {
  const res = await authedFetch(`/profile/educations/${id}`, {
    method: "DELETE",
  });
  await handleResponse<unknown>(res);
}

/* ── Skill Catalog ── */

export interface SkillCatalogItem { id: string; name: string; category: string; }

/** GET /skills?q= — public, no auth */
export async function fetchSkills(q = ""): Promise<SkillCatalogItem[]> {
  const url = `${API.CANDIDATE}/skills${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  const res  = await fetch(url);
  const json = await res.json().catch(() => ({}));
  return (json.data ?? []) as SkillCatalogItem[];
}

/* ── Candidate Skills ── */

const PROFICIENCY_MAP: Record<string, string> = {
  Beginner: "BEGINNER", Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED", Expert: "EXPERT", Master: "MASTER",
};

export interface SkillPayload {
  skillName: string;
  proficiencyLevel: string;   // BEGINNER | INTERMEDIATE | ADVANCED | EXPERT | MASTER
  experienceYears?: number;   // BigDecimal — convert months → fractional years
  lastUsed?: string;          // YYYY-MM-DD (first of month)
  topSkill: boolean;
  additionalDetails?: string;
}

/** POST /profile/skills → returns backend-assigned skill id */
export async function addCandidateSkill(payload: SkillPayload): Promise<string> {
  const res = await authedFetch("/profile/skills", { method: "POST", body: JSON.stringify(payload) });
  const profile = await handleResponse<{ skills: { id: string }[] }>(res);
  const list = profile.skills ?? [];
  return list[list.length - 1]?.id ?? crypto.randomUUID();
}

/** PUT /profile/skills/:id */
export async function updateCandidateSkill(id: string, payload: SkillPayload): Promise<void> {
  const res = await authedFetch(`/profile/skills/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  await handleResponse<unknown>(res);
}

/** DELETE /profile/skills/:id */
export async function deleteCandidateSkill(id: string): Promise<void> {
  const res = await authedFetch(`/profile/skills/${id}`, { method: "DELETE" });
  await handleResponse<unknown>(res);
}

export function buildSkillPayload(skill: import("../types/auth.types").Skill): SkillPayload {
  const expNum = parseFloat(skill.experienceValue) || 0;
  const expYears = skill.experienceUnit === "Months" ? Math.round((expNum / 12) * 10) / 10 : expNum;
  const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let lastUsed: string | undefined;
  if (skill.lastUsed) {
    const parts = skill.lastUsed.split(" ");
    const mIdx = MONTHS_SHORT.indexOf(parts[0]);
    if (mIdx !== -1 && parts[1]) lastUsed = `${parts[1]}-${String(mIdx + 1).padStart(2, "0")}-01`;
  }
  return {
    skillName:        skill.name,
    proficiencyLevel: PROFICIENCY_MAP[skill.proficiency] ?? "INTERMEDIATE",
    experienceYears:  expYears > 0 ? expYears : undefined,
    lastUsed,
    topSkill:         skill.highlighted,
    additionalDetails: skill.additionalDetails || undefined,
  };
}

/* ── Preferences ── */

const PREF_EMPLOYMENT_MAP: Record<string, string> = {
  "Full Time": "FULL_TIME",
  "Part Time": "PART_TIME",
  "Contract":  "CONTRACT",
  "Remote":    "REMOTE",
  "Hybrid":    "HYBRID",
  "Freelance": "FREELANCE",
};

export interface PreferencesPayload {
  noticePeriod?: string;
  expectedSalary?: string;
  salaryType?: string;
  preferredLocation?: string;
  openToRelocate: boolean;
  rolePreferences?: string[];
  preferredEmploymentTypes?: string[];
  benefits?: string[];
  additionalPreferences?: string;
}

/** PUT /profile/preferences */
export async function savePreferences(payload: PreferencesPayload): Promise<void> {
  const res = await authedFetch("/profile/preferences", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await handleResponse<unknown>(res);
}

export function buildPreferencesPayload(data: {
  noticePeriod: string;
  expectedSalary: string;
  salaryType: string;
  preferredLocation: string;
  openToRelocate: boolean;
  jobRolePreferences: string[];
  employmentTypes: string[];
  benefits: string[];
  additionalNotes: string;
}): PreferencesPayload {
  return {
    noticePeriod:             data.noticePeriod || undefined,
    expectedSalary:           data.expectedSalary || undefined,
    salaryType:               data.salaryType || undefined,
    preferredLocation:        data.preferredLocation || undefined,
    openToRelocate:           data.openToRelocate,
    rolePreferences:          data.jobRolePreferences.length ? data.jobRolePreferences : undefined,
    preferredEmploymentTypes: data.employmentTypes.map(t => PREF_EMPLOYMENT_MAP[t] ?? t).filter(Boolean),
    benefits:                 data.benefits.length ? data.benefits : undefined,
    additionalPreferences:    data.additionalNotes || undefined,
  };
}

/* ── Certifications ── */

export interface CertificationPayload {
  certificationName: string;
  issuingInstitution: string;
  credentialId?: string;
  certificateUrl?: string;
  passedYear?: number;
  validTill?: string;         // YYYY-MM-DD
  doesNotExpire: boolean;
  displayOnProfile: boolean;
  description?: string;
}

/** POST /profile/certifications → returns backend-assigned cert id */
export async function addCertification(payload: CertificationPayload): Promise<string> {
  const res = await authedFetch("/profile/certifications", { method: "POST", body: JSON.stringify(payload) });
  const profile = await handleResponse<{ certifications: { id: string }[] }>(res);
  const list = profile.certifications ?? [];
  return list[list.length - 1]?.id ?? crypto.randomUUID();
}

/** PUT /profile/certifications/:id */
export async function updateCertification(id: string, payload: CertificationPayload): Promise<void> {
  const res = await authedFetch(`/profile/certifications/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  await handleResponse<unknown>(res);
}

/** DELETE /profile/certifications/:id */
export async function deleteCertification(id: string): Promise<void> {
  const res = await authedFetch(`/profile/certifications/${id}`, { method: "DELETE" });
  await handleResponse<unknown>(res);
}

/* ── Work Experience ── */

export interface ProjectPayload {
  projectName: string;
  roleName?: string;
  description?: string;
  startDate?: string;       // YYYY-MM-DD
  endDate?: string;         // YYYY-MM-DD
  technologiesUsed?: string; // comma-separated
}

export interface WorkExperiencePayload {
  companyName: string;
  jobTitle: string;
  employmentType: string;   // backend enum: FULL_TIME, PART_TIME, etc.
  location?: string;
  startDate: string;        // YYYY-MM-DD
  endDate?: string | null;  // YYYY-MM-DD
  currentlyWorking: boolean;
  noticePeriod?: string;
  projects?: ProjectPayload[];
}

/** POST /profile/work-experiences → returns backend-assigned experience id */
export async function addWorkExperience(payload: WorkExperiencePayload): Promise<string> {
  const res = await authedFetch("/profile/work-experiences", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const profile = await handleResponse<{ workExperiences: { id: string }[] }>(res);
  const list = profile.workExperiences ?? [];
  return list[list.length - 1]?.id ?? crypto.randomUUID();
}

/** PUT /profile/work-experiences/:id */
export async function updateWorkExperience(id: string, payload: WorkExperiencePayload): Promise<void> {
  const res = await authedFetch(`/profile/work-experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await handleResponse<unknown>(res);
}

/** DELETE /profile/work-experiences/:id */
export async function deleteWorkExperience(id: string): Promise<void> {
  const res = await authedFetch(`/profile/work-experiences/${id}`, {
    method: "DELETE",
  });
  await handleResponse<unknown>(res);
}
