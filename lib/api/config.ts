export const API = {
  USERS:     "/api/users",
  CANDIDATE: "/api/candidate",
} as const;

/** Reads the stored access token (set after register/login) */
export const getAccessToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("hiremind_access_token") : null;

export const setAccessToken = (token: string) =>
  localStorage.setItem("hiremind_access_token", token);

export const clearAuth = () => {
  localStorage.removeItem("hiremind_access_token");
  localStorage.removeItem("hiremind_refresh_token");
  localStorage.removeItem("hiremind_user_id");
};
