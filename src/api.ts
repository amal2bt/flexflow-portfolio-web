import { useCallback, useEffect, useState } from "react";

/**
 * Base URL for the Laravel API. Configure it with VITE_API_BASE_URL in `.env`.
 * Defaults to `php artisan serve` so the app works with zero config.
 */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

/** Origin of the Laravel app without the trailing `/api` (used for uploaded files). */
export const API_ORIGIN = API_BASE.replace(/\/api$/, "");

/** Client origin that hosts the marketing site (same app, `/` routes). */
export const SITE_ORIGIN = window.location.origin;

const TOKEN_KEY = "flexflow_admin_token";
const USER_KEY = "flexflow_admin_user";

export type AuthUser = { id: number; name: string; email: string; role?: string };

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string | null) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};
export const isAuthenticated = () => Boolean(getToken());

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};
const setStoredUser = (user: AuthUser | null) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
};

/** Drop the stored credentials without contacting the API. */
export function clearSession(): void {
  setToken(null);
  setStoredUser(null);
}

/**
 * Handles a stale/expired token: drops the stored credentials and, when the
 * user is inside the authenticated admin area, bounces them back to the login
 * view. The public marketing site keeps rendering its open (unauthenticated)
 * routes, so it is only cleared there.
 *
 * Guarded so a burst of concurrent 401s only triggers a single redirect.
 */
let handlingUnauthorized = false;
function handleUnauthorized(): void {
  clearSession();

  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  if (window.location.pathname.includes("/admin")) {
    // Hash navigation lets the admin's own routing react (and show the login
    // view) without a full page reload.
    window.location.hash = "/login";
  }

  // The API rejected the token (expired, revoked or unknown). Let the admin
  // UI explain why the session ended.
  window.dispatchEvent(new Event("flexflow_session_expired"));

  // Allow a later session (after a fresh login) to be handled again.
  window.setTimeout(() => {
    handlingUnauthorized = false;
  }, 0);
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Default retry delay when a 429 response omits a usable `Retry-After` header. */
export const DEFAULT_RETRY_AFTER = 600;

/** Upper bound (24h) so a malformed header can never lock the UI indefinitely. */
const MAX_RETRY_AFTER = 86_400;

const clampRetryAfter = (seconds: number): number => Math.min(MAX_RETRY_AFTER, Math.max(0, seconds));

/**
 * Seconds the caller should wait before retrying. `Retry-After` is either a
 * delta in seconds or an HTTP date; anything missing/unparseable falls back to
 * {@link DEFAULT_RETRY_AFTER}.
 */
export function parseRetryAfter(header: string | null): number {
  if (!header) return DEFAULT_RETRY_AFTER;

  const value = header.trim();
  const seconds = Number(value);
  if (value !== "" && Number.isFinite(seconds)) return clampRetryAfter(Math.ceil(seconds));

  const date = Date.parse(value);
  if (!Number.isNaN(date)) return clampRetryAfter(Math.ceil((date - Date.now()) / 1000));

  return DEFAULT_RETRY_AFTER;
}

/**
 * Non-2xx API response. Carries the HTTP status and, for 429 throttling, the
 * number of seconds the caller should wait (`null` when none was advertised).
 */
export class ApiError extends Error {
  status: number;
  retryAfter: number | null;

  constructor(message: string, status: number, retryAfter: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function request<T>(method: HttpMethod, path: string, body?: unknown, isForm = false): Promise<T> {
  const init: RequestInit = { method, headers: { Accept: "application/json" } };

  const token = getToken();
  if (token) init.headers = { ...init.headers, Authorization: `Bearer ${token}` };

  if (body instanceof FormData) {
    // The PHP built-in dev server (php artisan serve) does not expose
    // multipart bodies for raw PUT/PATCH verbs, so bridge those through a
    // POST using Laravel's standard `_method` override, which Symfony honors.
    if (method === "PUT" || method === "PATCH") {
      body.append("_method", method);
      init.method = "POST";
    }
    init.body = body;
  } else if (body !== undefined) {
    init.headers = { ...init.headers, "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, init);

  if (!res.ok) {
    // A 401 means the stored token is stale/expired. Clear it and bounce the
    // admin back to login — except when the login form itself is submitting,
    // so "Invalid credentials" can still be shown inline without a loop.
    if (res.status === 401 && path !== "/login") {
      handleUnauthorized();
    }

    let detail = res.statusText;
    try {
      const parsed = await res.json();
      detail = parsed?.message ?? detail;
    } catch {
      /* ignore non-JSON error bodies */
    }
    const retryAfter = res.status === 429 ? parseRetryAfter(res.headers.get("Retry-After")) : null;
    throw new ApiError(`${method} ${path} failed: ${res.status} ${detail}`, res.status, retryAfter);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const apiGet = <T>(path: string) => request<T>("GET", path);
export const apiPost = <T>(path: string, body?: unknown) => request<T>("POST", path, body);
export const apiPut = <T>(path: string, body?: unknown) => request<T>("PUT", path, body);
export const apiPatch = <T>(path: string, body?: unknown) => request<T>("PATCH", path, body);
export const apiDelete = <T>(path: string) => request<T>("DELETE", path);
export const apiForm = <T>(path: string, form: FormData, method: HttpMethod = "POST") => request<T>(method, path, form, true);

/** Authenticate and persist the returned auth token + user profile. */
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await request<{ user: AuthUser; token: string }>("POST", "/login", { email, password });
  setToken(res.token);
  setStoredUser(res.user);
  return res.user;
}

/**
 * Invalidate the token on the API and clear local credentials.
 *
 * The local credentials are dropped first — and synchronously — so a failing
 * or hanging API call can never leave a usable token behind. The captured
 * token is still sent to the API so the server side is invalidated as well.
 */
export async function logout(): Promise<void> {
  const token = getToken();
  clearSession();
  if (!token) return;
  try {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
  } catch {
    /* best effort: the token is replaced by the next sign-in anyway */
  }
}

/**
 * Resolve a stored image path. Uploaded files live under the Laravel origin
 * (`/storage/...`); bundled site images (`/images/...`) are served by the
 * frontend itself and are returned untouched.
 */
export function assetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/storage/")) return `${API_ORIGIN}${path}`;
  return path;
}

type ApiState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
  setData: (value: T) => void;
};

/**
 * Fetch a resource and keep `fallback` until the API responds. This lets the
 * UI render instantly with the existing mock data and seamlessly switch to the
 * live data managed from the admin panel, without any layout changes.
 */
export function useApi<T>(path: string | null, fallback: T): ApiState<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!path) return;
    let active = true;
    setLoading(true);
    apiGet<T>(path)
      .then((result) => {
        if (!active) return;
        if (result !== null && result !== undefined) setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path]);

  useEffect(load, [load]);

  // Keep the rendered data in sync with admin edits: refetch whenever the tab
  // regains focus/visibility (e.g. the marketing site open beside the admin
  // panel) so changes appear without a manual reload.
  useEffect(() => {
    if (!path) return;
    const refresh = () => load();
    const onVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [path, load]);

  return { data, loading, error, reload: load, setData };
}