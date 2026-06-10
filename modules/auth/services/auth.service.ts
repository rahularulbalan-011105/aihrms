import { API, getAccessToken, setAccessToken, clearAuth, setStoredUserName, setRefreshToken, setUserId } from "@/lib/api/config";
import type { LoginPayload, SignupPayload, AuthUser, CandidateRegStep1Data } from '../types/auth.types';

/** DELETE /users/me — rollback user account if downstream registration fails */
export async function deleteCurrentUser(): Promise<void> {
  const token = getAccessToken();
  if (!token) return;
  await fetch(`${API.USERS}/users/me`, {
    method:  "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  clearAuth();
}

const ACCOUNT_TYPE_MAP: Record<string, string> = {
  candidate: "CANDIDATE",
  recruiter:  "RECRUITMENT_COMPANY",
};

/** POST /auth/login → stores tokens + returns userId */
export async function loginUser(payload: LoginPayload): Promise<string> {
  const body = {
    accountType: ACCOUNT_TYPE_MAP[payload.role] ?? "CANDIDATE",
    email:       payload.email.trim().toLowerCase(),
    password:    payload.password,
    rememberMe:  payload.rememberMe ?? false,
  };

  const res = await fetch(`${API.USERS}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const details = json?.error?.details as Record<string, string> | null;
    const fieldMsg = details ? Object.values(details).join(", ") : null;
    throw new Error(fieldMsg ?? json?.message ?? `Login failed (${res.status})`);
  }

  const { userId, accessToken, refreshToken } = json.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken); // C-2: SSR-safe helper
  setUserId(userId);             // C-2: SSR-safe helper
  return userId as string;
}

/** POST /auth/register → stores token + returns userId */
export async function registerCandidateUser(data: CandidateRegStep1Data): Promise<string> {
  // dateOfBirth from HTML date input is "YYYY-MM-DD" — send null if empty
  const dateOfBirth = data.dateOfBirth?.trim() || null;

  const body = {
    accountType:     "CANDIDATE",
    fullName:        `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
    email:           data.email.trim().toLowerCase(),
    countryCode:     process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE ?? "+91", // H-4: configurable
    phoneNumber:     data.phone.trim(),
    password:        data.password,
    confirmPassword: data.confirmPassword,
    dateOfBirth,
    currentLocation: data.currentLocation.trim(),
    source:          data.hearAboutUs || null,
  };

  if (process.env.NODE_ENV === "development") { // C-4: no PII in production logs
    console.debug("[register] payload →", { ...body, password: "***", confirmPassword: "***" });
  }

  const res = await fetch(`${API.USERS}/auth/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (process.env.NODE_ENV === "development") {
    console.debug("[register] response →", res.status, json?.message);
  }

  if (!res.ok) {
    // ApiResponse shape: { message, error: { code, details: { field: msg } } }
    const details = json?.error?.details as Record<string, string> | null;
    const fieldMsg = details ? Object.values(details).join(", ") : null;
    const msg = fieldMsg ?? json?.message ?? `Registration failed (${res.status})`;
    throw new Error(msg);
  }

  const { userId, accessToken, refreshToken } = json.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken); // C-2: SSR-safe helper
  setUserId(userId);             // C-2: SSR-safe helper
  setStoredUserName(body.fullName); // cache name for immediate header display
  return userId as string;
}

// ─── Stub service ─────────────────────────────────────────────────────────────
// These methods simulate network delay until real backend endpoints are wired up.
// authService.login has been removed — use loginUser() above instead (C-3).
// TODO: Replace signup/verifyOtp/resendOtp with real POST /api/users/auth/... calls.

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  signup: async (payload: SignupPayload): Promise<{ message: string; email: string }> => {
    await delay(900);
    return { message: 'OTP sent to your email', email: payload.email };
  },

  verifyOtp: async (email: string, otp: string): Promise<AuthUser> => {
    await delay(700);
    if (otp === '000000') throw new Error('Invalid OTP');
    return {
      id: 'usr_1',
      email,
      fullName: 'New User',
      role: 'candidate',
      token: 'mock-access-token',
    };
  },

  resendOtp: async (_email: string): Promise<{ message: string }> => {
    await delay(500);
    return { message: 'OTP resent successfully' };
  },
};
