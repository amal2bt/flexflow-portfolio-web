import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthUser, apiGet, getStoredUser, isAuthenticated, logout } from "../api";
import { Shell } from "./components/Shell";
import { Toast, type ToastTone } from "./components/Toast";
import type { Page } from "./types";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { TopPage } from "./pages/TopPage";
import { AboutPage } from "./pages/AboutPage";
import { ProcessPage } from "./pages/ProcessPage";
import { ChallengeModalPage } from "./pages/ChallengeModalPage";
import { InvestPage } from "./pages/InvestPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ContactPage } from "./pages/ContactPage";
import { PartnersPage } from "./pages/PartnersPage";
import { MessagesPage } from "./pages/MessagesPage";
import { UsersPage } from "./pages/UsersPage";

const pageMeta: Partial<Record<Page, { title?: string; breadcrumb?: string; align?: "left" | "center" }>> = {
  top: { title: "Top Section", breadcrumb: "Top Section" },
  about: { title: 'Edit "About Us" Section', breadcrumb: "About Us" },
  process: { title: "Edit Work Process Section", breadcrumb: "Process" },
  challenges: { title: "Business Challenges", breadcrumb: "Business Challenges" },
  invest: { title: "Why Invest Section", breadcrumb: "Why Invest" },
  services: { title: "Services", breadcrumb: "Services" },
  contact: { title: "Contact Section", breadcrumb: "Contact" },
  partners: { title: "Trusted Partners", breadcrumb: "Trusted Partners", align: "left" },
  messages: { title: "Messages", breadcrumb: "Messages" },
  users: { title: "Employees & Roles", breadcrumb: "Users" },
};

/** Minimal shape needed to judge whether a message still needs attention. */
type MessageStatus = { status?: string | null };

/** Pending/unread until it is marked "read" (archived items are triaged too). */
const isUnread = (message: MessageStatus): boolean => {
  const status = (message.status ?? "").trim().toLowerCase();
  return status !== "read" && status !== "archived";
};

function App() {
  const pages: Page[] = ["login", "dashboard", "top", "about", "process", "challenges", "invest", "services", "contact", "partners", "messages", "users"];
  const getInitial = (): Page => {
    const hash = window.location.hash.replace("#/", "") as Page;
    const target = pages.includes(hash) ? hash : "login";
    return isAuthenticated() ? target : "login";
  };
  const [page, setPage] = useState<Page>(getInitial);
  const [toast, setToast] = useState<{ text: string; tone: ToastTone } | null>(null);
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const navigate = (next: Page) => {
    setPage(next);
    window.location.hash = `/${next}`;
    window.scrollTo(0, 0);
  };

  const fetchUnreadCount = useCallback(() => {
    if (!isAuthenticated()) {
      setUnreadCount(0);
      return;
    }
    apiGet<MessageStatus[]>("/messages")
      .then((data) => setUnreadCount(Array.isArray(data) ? data.filter(isUnread).length : 0))
      .catch(() => {
        /* The badge is non-critical: keep the last known value on failure. */
      });
  }, []);

  useEffect(() => {
    const onHash = () => setPage(getInitial());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Re-check auth and refresh the badge whenever the active page changes.
  useEffect(() => {
    if (!isAuthenticated() && page !== "login") {
      setUser(null);
      setPage("login");
      window.location.hash = "/login";
    } else if (isAuthenticated()) {
      fetchUnreadCount();
    }
  }, [page, fetchUnreadCount]);

  // The Users page is admin-only. This is a UX guard; the API independently
  // returns 403 for employees.
  useEffect(() => {
    if (page === "users" && user?.role !== "admin") {
      setPage("dashboard");
      window.location.hash = "/dashboard";
    }
  }, [page, user]);

  // Keep the badge current when the admin returns to this tab after reading
  // messages somewhere else (or in another window).
  useEffect(() => {
    if (!isAuthenticated()) return;
    const onFocus = () => fetchUnreadCount();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchUnreadCount();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchUnreadCount]);

  const showToast = (text: string, tone: ToastTone = "success", duration = 2200) => {
    setToast({ text, tone });
    window.setTimeout(() => setToast(null), duration);
  };
  const notify = () => { showToast("Changes saved successfully"); };
  const refreshMessages = () => { notify(); fetchUnreadCount(); };
  const doLogout = () => { void logout().then(() => { setUser(null); setUnreadCount(0); navigate("login"); }); };

  // The API is the single authority on token lifetime: it rejects an expired
  // token with a 401, which `api.ts` turns into this event.
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setUnreadCount(0);
      showToast("Your session has expired. Please sign in again.", "warning", 8000);
    };
    window.addEventListener("flexflow_session_expired", onExpired);
    return () => window.removeEventListener("flexflow_session_expired", onExpired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = useMemo(() => {
    if (page === "dashboard") return <Dashboard notify={notify} />;
    if (page === "top") return <TopPage notify={notify} />;
    if (page === "about") return <AboutPage notify={notify} />;
    if (page === "process") return <ProcessPage notify={notify} />;
    if (page === "challenges") return <ChallengeModalPage notify={notify} />;
    if (page === "invest") return <InvestPage notify={notify} />;
    if (page === "services") return <ServicesPage notify={notify} />;
    if (page === "contact") return <ContactPage notify={notify} />;
    if (page === "partners") return <PartnersPage notify={notify} />;
    if (page === "messages") return <MessagesPage notify={refreshMessages} />;
    return <UsersPage notify={notify} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (page === "login") {
    return (
      <>
        <Login navigate={navigate} onAuthed={(u) => { setUser(u); fetchUnreadCount(); }} />
        {toast && <Toast text={toast.text} tone={toast.tone} />}
      </>
    );
  }

  const meta = pageMeta[page] || {};

  return (
    <>
      <Shell
        page={page}
        navigate={navigate}
        title={meta.title}
        breadcrumb={meta.breadcrumb}
        titleAlign={meta.align}
        userName={user?.name}
        role={user?.role}
        onLogout={doLogout}
        unreadCount={unreadCount}
      >
        {page === "partners" && <p className="page-subtitle">Manage partner logos displayed on the website.</p>}
        {content}
      </Shell>
      {toast && <Toast text={toast.text} tone={toast.tone} />}
    </>
  );
}

export default App;
