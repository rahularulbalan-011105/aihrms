import { API, getAccessToken } from "@/lib/api/config";

/** Mirrors the backend TeamMemberUpsertRequest (camelCase fields). */
export interface TeamMemberUpsertRequest {
  fullName: string;
  email: string;
  countryCode?: string;
  phone?: string;
  designation: string;
  department?: string;
  employeeType?: string;
  role: string;
  permissions: string;
  reportingManager?: string;
  accessScope?: string;
  invitedVia?: string;
  tempPasswordEnabled: boolean;
  twoFactorEnabled: boolean;
  message?: string;
}

export type TeamMemberStatus = "ACTIVE" | "INVITED" | "INACTIVE";

export interface TeamMemberResponse extends TeamMemberUpsertRequest {
  id: string;
  status: TeamMemberStatus;
  createdAt: string;
  updatedAt: string;
}

/** Row shape for the team members list table. */
export interface TeamMemberSummaryResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string | null;
  accessScope: string | null;
  status: TeamMemberStatus;
  lastActivity: string;
}

/** POST /company/team — invite (create) a team member. */
export async function createTeamMember(
  payload: TeamMemberUpsertRequest,
): Promise<TeamMemberResponse> {
  const res = await fetch(`${API.COMPANY}/company/team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to invite team member (${res.status})`);
  }
  return json.data as TeamMemberResponse;
}

/** GET /company/team/{id} — full team-member detail (used to prefill the edit form). */
export async function getTeamMember(id: string): Promise<TeamMemberResponse> {
  const res = await fetch(`${API.COMPANY}/company/team/${id}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to load team member (${res.status})`);
  }
  return json.data as TeamMemberResponse;
}

/** PUT /company/team/{id} — update a team member. */
export async function updateTeamMember(
  id: string,
  payload: TeamMemberUpsertRequest,
): Promise<TeamMemberResponse> {
  const res = await fetch(`${API.COMPANY}/company/team/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to update team member (${res.status})`);
  }
  return json.data as TeamMemberResponse;
}

/** DELETE /company/team/{id} — remove a team member. */
export async function deleteTeamMember(id: string): Promise<void> {
  const res = await fetch(`${API.COMPANY}/company/team/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? `Failed to delete team member (${res.status})`);
  }
}

/** GET /company/team — paginated list of team members. */
export async function listTeamMembers(
  page = 0,
  size = 20,
): Promise<{ content: TeamMemberSummaryResponse[]; totalElements: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await fetch(`${API.COMPANY}/company/team?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to load team members (${res.status})`);
  }
  return {
    content: (json?.data?.content ?? []) as TeamMemberSummaryResponse[],
    totalElements: (json?.data?.totalElements ?? 0) as number,
  };
}
