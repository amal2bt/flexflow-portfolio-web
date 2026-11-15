import { useState, type CSSProperties, type ReactNode } from "react";
import { SITE_ORIGIN } from "../../api";
import type { Page } from "../types";
import { Icon, type IconName } from "./Icon";

export function Brand({ large = false }: { large?: boolean }) {
  return (
    <div className={`brand ${large ? "brand--large" : ""}`}>
      <img src="/public/images/logo3.png" alt="FlexFlow Logo" style={{ width: large ? "42px" : "28px", height: "auto", objectFit: "contain" }} />
      <strong>FlexFlow</strong>
    </div>
  );
}
const nav: Array<{ page: Page; label: string; icon: IconName }> = [
  { page: "dashboard", label: "Dashboard", icon: "fa-tachometer-alt me-2" },
  { page: "top", label: "Top Section", icon: "fa-mountain" },
  { page: "services", label: "Services", icon: "fa-table" },
  { page: "contact", label: "Contact Info", icon: "bi-info-circle-fill" },
  { page: "partners", label: "Partners", icon: "fa-comments" }, // or keep your preferred fa icon
  { page: "messages", label: "Messages", icon: "fa-envelope" },
  { page: "users", label: "Users", icon: "bi-people-fill me-2" },
];
const infoNav: Array<{ page: Page; label: string }> = [
  { page: "about", label: "About US" },
  { page: "process", label: "Our Proccess" },
  { page: "challenges", label: "Buisness Challenges" },
  { page: "invest", label: "Why Invest" },
];

const iconBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  color: "#20d6b3",
  filter: "none",
  textShadow: "none",
  boxShadow: "none",
};

function NavItem({ label, icon, active, onClick, badge }: { label: string; icon: IconName; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button className={`nav-item ${active ? "is-active" : ""}`} onClick={onClick}>
      <span className="nav-icon" style={iconBadgeStyle}>
        <Icon name={icon} size={18} />
      </span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            backgroundColor: "#dc3545",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "10px",
            padding: "2px 8px",
            lineHeight: "1.6",
            minWidth: "18px",
            textAlign: "center",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function Sidebar({ page, navigate, onCheckSite, onLogout, unreadCount, role }: { page: Page; navigate: (page: Page) => void; onCheckSite: () => void; onLogout: () => void; unreadCount?: number; role?: string }) {
  const [expanded, setExpanded] = useState(infoNav.some((item) => item.page === page));
  const infoActive = infoNav.some((item) => item.page === page);
  const badgeFor = (item: Page) => (item === "messages" ? unreadCount : undefined);
  // User management is admin-only. Hiding it for employees is a UX guard only;
  // the API enforces the same rule server-side.
  const visibleNav = nav.filter((item) => item.page !== "users" || role === "admin");
  return (
    <aside className="sidebar">
      <nav>
        {visibleNav.slice(0, 2).map((item) => <NavItem key={item.page} {...item} badge={badgeFor(item.page)} active={page === item.page} onClick={() => navigate(item.page)} />)}
        <button className={`nav-item ${infoActive ? "is-active" : ""}`} onClick={() => setExpanded(!expanded)}>
          <span className="nav-icon" style={iconBadgeStyle}>
            <Icon name="fa-file-alt me-2" size={18} />
          </span>
          <span>Info Sections</span>
          <span className={`chevron ${expanded ? "is-open" : ""}`}>⌄</span>
        </button>
        {expanded && <div className="subnav">{infoNav.map((item) => <button key={item.page} className={page === item.page ? "is-active" : ""} onClick={() => navigate(item.page)}>{item.label}</button>)}</div>}
        {visibleNav.slice(2).map((item) => <NavItem key={item.page} {...item} badge={badgeFor(item.page)} active={page === item.page} onClick={() => navigate(item.page)} />)}
        <button className="nav-item" onClick={onCheckSite}>
          <span className="nav-icon" style={iconBadgeStyle}>
            <Icon name="fa-laptop me-2" size={18} />
          </span>
          <span>Check Website</span>
        </button>
        <button className="nav-item" onClick={onLogout}>
          <span className="nav-icon" style={iconBadgeStyle}>
            <Icon name="fa-sign-out-alt me-2" size={18} />
          </span>
          <span>Log Out</span>
        </button>
      </nav>
    </aside>
  );
}

export function Shell({ page, navigate, title, breadcrumb, children, titleAlign = "center", userName, role, onLogout, unreadCount }: { page: Page; navigate: (page: Page) => void; title?: string; breadcrumb?: string; children: ReactNode; titleAlign?: "center" | "left"; userName?: string; role?: string; onLogout: () => void; unreadCount?: number }) {
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);
  return (
    <div className={`app-shell app-shell--${page} ${navOpen ? "is-nav-open" : ""}`}>
      <header className="header"><button className="header-brand" onClick={() => navigate("dashboard")}># FlexFlow</button><button className="hamburger" aria-label="Toggle navigation" onClick={() => setNavOpen((open) => !open)}>☰</button><span className="admin-name">{userName || "Admin"}</span></header>
      <Sidebar page={page} navigate={(next) => { closeNav(); navigate(next); }} onCheckSite={() => { closeNav(); window.open(SITE_ORIGIN, "_blank"); }} onLogout={() => { closeNav(); onLogout(); }} unreadCount={unreadCount} role={role} />
      <button className="sidebar-overlay" aria-label="Close navigation" onClick={closeNav} />
      <main className="main">
        {breadcrumb && <div className="breadcrumb"><button onClick={() => navigate("dashboard")}>Dashboard</button><span>/</span><span>{breadcrumb}</span></div>}
        <div className={`content ${page === "dashboard" ? "content--dashboard" : ""}`}>
          {title && <div className={`page-heading page-heading--${titleAlign}`}><h1>{title}</h1></div>}
          {children}
        </div>
        <footer>© <button>FlexFlow</button>, All Right Reserved.</footer>
      </main>
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
    </div>
  );
}

export function DottedCard({ title, children, className = "", style }: { title?: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  return <section className={`dotted-card ${className}`} style={style}>{title && <h2>{title}</h2>}{children}</section>;
}