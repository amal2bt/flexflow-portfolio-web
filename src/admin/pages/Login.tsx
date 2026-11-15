import { useEffect, useRef, useState } from "react";
import { ApiError, login, SITE_ORIGIN, type AuthUser } from "../../api";
import { Brand } from "../components/Shell";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { collectFields, errorText } from "../lib/helpers";
import type { Page } from "../types";

const pad = (value: number) => String(value).padStart(2, "0");

/** Format a remaining lockout as `MM:SS` (minutes may exceed 99 for long windows). */
const formatCountdown = (seconds: number) => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

/**
 * Every 429 from the API is a strict 10-minute lockout (the backend resets its
 * timer when the limit trips and always returns `Retry-After: 600`), so the
 * countdown always starts from the full window regardless of the header.
 */
const LOCKOUT_SECONDS = 600;

/**
 * Absolute lockout expiry (epoch milliseconds) persisted in localStorage so a
 * page refresh (or a second admin tab) cannot bypass the countdown. This is a
 * UX guard only: the backend rate limiter remains the authoritative lockout,
 * so clearing storage still leaves the account blocked server-side.
 */
const LOCKOUT_STORAGE_KEY = "flexflow_login_lockout_until";

/** Read the persisted deadline, dropping expired/tampered values. */
const readPersistedLockout = (): number | null => {
  try {
    const raw = window.localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) return null;
    const until = Number(raw);
    const now = Date.now();
    if (!Number.isFinite(until) || until <= now) {
      window.localStorage.removeItem(LOCKOUT_STORAGE_KEY);
      return null;
    }
    // Clamp clock skew/tampering to one window so a bad value can never lock
    // the form beyond the enforced 10 minutes.
    return Math.min(until, now + LOCKOUT_SECONDS * 1000);
  } catch {
    // Storage can be unavailable (private mode, policy); fall back to memory.
    return null;
  }
};

const persistLockout = (until: number): void => {
  try {
    window.localStorage.setItem(LOCKOUT_STORAGE_KEY, String(until));
  } catch {
    /* ignore storage failures: the in-memory deadline still applies */
  }
};

const clearPersistedLockout = (): void => {
  try {
    window.localStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch {
    /* ignore storage failures */
  }
};

/** Whole seconds remaining until the deadline (rounded up). */
const secondsUntil = (deadline: number): number => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

export function Login({ navigate, onAuthed }: { navigate: (page: Page) => void; onAuthed: (user: AuthUser) => void }) {
  const formRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Absolute expiry of the active 429 lockout, restored from localStorage so a
  // refresh resumes the remaining time instead of resetting or dropping it.
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => readPersistedLockout());
  const [, setClock] = useState(0);
  const lockoutSeconds = lockoutUntil === null ? 0 : secondsUntil(lockoutUntil);
  const locked = lockoutSeconds > 0;

  // Tick once per second, deriving the remaining time from the absolute
  // deadline (so background-tab throttling cannot make the clock drift), and
  // clear the persisted value as soon as it expires.
  useEffect(() => {
    if (lockoutUntil === null) return;

    const tick = () => {
      if (lockoutUntil <= Date.now()) {
        clearPersistedLockout();
        setLockoutUntil(null);
        return;
      }
      setClock((value) => value + 1);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lockoutUntil]);

  // Keep every open admin tab in sync: a lockout started in one tab applies to
  // the others, and clearing it (expiry/login) releases them too.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== LOCKOUT_STORAGE_KEY) return;
      setLockoutUntil(readPersistedLockout());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const submit = async () => {
    if (busy || locked) return;
    const f = collectFields(formRef.current);
    const email = f["Email Address"]?.trim() ?? "";
    const password = f["Password"] ?? "";
    if (!email || !password) { setError("Enter your email and password."); return; }
    setBusy(true);
    setError("");
    try {
      const user = await login(email, password);
      clearPersistedLockout();
      setLockoutUntil(null);
      onAuthed(user);
      navigate("dashboard");
    } catch (err) {
      // Throttled by the API: always enforce the full 10-minute lockout and
      // persist its absolute deadline.
      if (err instanceof ApiError && err.status === 429) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        persistLockout(until);
        setLockoutUntil(until);
        setError("");
      } else {
        setError(errorText(err));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-visual"><LoginIllustration /></div>
        <div className="login-form" ref={formRef}>
          <Brand large />
          <h1>Log into your account</h1>
          <div className="login-rule" />
          {locked && (
            <div className="login-lockout" role="alert" aria-live="polite">
              <span className="login-lockout-icon" aria-hidden="true">🔒</span>
              <p className="login-lockout-text">
                Too many failed login attempts. Please try again after 10 minutes.{" "}
                <span className="login-lockout-clock">({formatCountdown(lockoutSeconds)})</span>
              </p>
            </div>
          )}
          <Field label="Email Address" value="" focused disabled={locked} />
          <Field label="Password" value="" type="password" disabled={locked} />
          {error && !locked && <p className="login-error" role="alert">{error}</p>}
          <Button
            className={`login-button${locked ? " is-locked" : ""}`}
            disabled={locked || busy}
            onClick={() => submit()}
          >
            {locked
              ? `Login Temporarily Blocked 🔒 (${formatCountdown(lockoutSeconds)})`
              : busy
                ? "Signing in…"
                : "Login"}
          </Button>
          <p>Don&apos;t want to log in? <button onClick={() => window.open(SITE_ORIGIN, "_blank")}>Check Website</button></p>
        </div>
      </section>
    </main>
  );
}

function LoginIllustration() {
  return (
    <div className="login-art" aria-label="Security login illustration" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src="/public/images/login2.jpg" alt="Login Security Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}
