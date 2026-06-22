import { API, getAccessToken } from "@/lib/api/config";

/** Mirrors the backend ClientUpsertRequest (camelCase fields). */
export interface ClientUpsertRequest {
  clientName: string;
  website?: string;
  industry: string;
  companySize?: string;
  companyType?: string;
  annualRevenue?: string;
  headquarters: string;
  country: string;
  timeZone?: string;
  contactName: string;
  email: string;
  countryCode?: string;
  phone: string;
  designation?: string;
  department?: string;
  linkedin?: string;
  billingEmail: string;
  billingCountryCode?: string;
  billingPhone?: string;
  billingAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  accountManager?: string;
  status?: "ACTIVE" | "INACTIVE" | "PROSPECT";
}

export interface ClientResponse extends ClientUpsertRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Row shape for the clients list table. */
export interface ClientSummaryResponse {
  id: string;
  clientName: string;
  industry: string;
  accountManager: string | null;
  openJobs: number;
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
  lastActivity: string;
}

/** POST /company/clients — create a client organization. */
export async function createClient(
  payload: ClientUpsertRequest,
): Promise<ClientResponse> {
  const res = await fetch(`${API.COMPANY}/company/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to create client (${res.status})`);
  }
  return json.data as ClientResponse;
}

/** GET /company/clients — paginated list of client organizations. */
export async function listClients(
  page = 0,
  size = 20,
): Promise<{ content: ClientSummaryResponse[]; totalElements: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await fetch(`${API.COMPANY}/company/clients?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to load clients (${res.status})`);
  }
  return {
    content: (json?.data?.content ?? []) as ClientSummaryResponse[],
    totalElements: (json?.data?.totalElements ?? 0) as number,
  };
}
