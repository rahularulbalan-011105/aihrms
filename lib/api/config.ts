export const API = {
  USERS:     "/api/users",
  CANDIDATE: "/api/candidate",
} as const;

const isBrowser = typeof window !== "undefined";

/** Reads the stored access token (set after register/login) */
export const getAccessToken = (): string | null =>
  isBrowser ? localStorage.getItem("hiremind_access_token") : null;

export const setAccessToken = (token: string) =>
  localStorage.setItem("hiremind_access_token", token);

/** Full name cached at registration/profile-fetch time */
export const getStoredUserName = (): string | null =>
  isBrowser ? localStorage.getItem("hiremind_user_name") : null;

export const setStoredUserName = (name: string) =>
  localStorage.setItem("hiremind_user_name", name);

/** Job title cached at registration/profile-fetch time */
export const getStoredJobTitle = (): string | null =>
  isBrowser ? localStorage.getItem("hiremind_job_title") : null;

export const setStoredJobTitle = (title: string) =>
  localStorage.setItem("hiremind_job_title", title);

export const clearAuth = () => {
  ["hiremind_access_token", "hiremind_refresh_token", "hiremind_user_id",
   "hiremind_user_name", "hiremind_job_title"].forEach((k) =>
    localStorage.removeItem(k)
  );
};
