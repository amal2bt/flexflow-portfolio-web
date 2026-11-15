import type { ReactNode } from "react";

export type IconName =
  | "dashboard"
  | "top"
  | "info"
  | "services"
  | "contact"
  | "partners"
  | "messages"
  | "users"
  | "website"
  | "logout"
  | "eye"
  | "edit"
  | "trash"
  | "check"
  | "plus"
  | "upload"
  | "location"
  | "pin"
  | "phone"
  | "mail"
  | "whatsapp"
  | "facebook"
  | "linkedin"
  | "instagram"
  | "chart"
  | "cloud"
  | "shield"
  | "gear"
  | "globe"
  | "house"
  | "heart"
  | "cart"
  | "userBadge"
  | "checkCircle"
  // FontAwesome Icons (Sidebar & General UI)
  | "fa-tachometer-alt me-2"
  | "fa-mountain"
  | "fa-table"
  | "fa-file-alt me-2"
  | "fa-comments"
  | "fa-envelope"
  | "fa-laptop me-2"
  | "fa-sign-out-alt me-2"
  // Bootstrap Icons (Sidebar, Services, Contact, Why Invest)
  | "bi-speedometer2"
  | "bi-rocket-takeoff"
  | "bi-info-circle"
  | "bi-info-circle-fill"
  | "bi-people-fill"
  | "bi-people-fill me-2"
  | "bi-hdd-rack"
  | "bi-geo-alt"
  | "bi-people"
  | "bi-chat-left-dots"
  | "bi-person-badge"
  | "bi-globe"
  | "bi-box-arrow-right"
  | "bi-telephone"
  | "bi-envelope"
  | "bi-whatsapp"
  | "bi-facebook"
  | "bi-linkedin"
  | "bi-instagram"
  | "bi-cpu"
  | "bi-motherboard"
  | "bi-motherboard-fill"
  | "bi-gear"
  | "bi-gear-fill"
  | "bi-gear-wide"
  | "bi-braces"
  | "bi-braces-asterisk"
  | "bi-code-slash"
  | "bi-terminal"
  | "bi-terminal-fill"
  | "bi-bug"
  | "bi-bug-fill"
  | "bi-cloud"
  | "bi-cloud-check"
  | "bi-cloud-upload"
  | "bi-cloud-download"
  | "bi-wifi"
  | "bi-hdd-network"
  | "bi-shield-lock"
  | "bi-shield-check"
  | "bi-fingerprint"
  | "bi-kanban"
  | "bi-kanban-fill"
  | "bi-calendar-check"
  | "bi-calendar-event"
  | "bi-headset"
  | "bi-clipboard-check"
  | "bi-clipboard-data"
  | "bi-bar-chart-line"
  | "bi-graph-up"
  | "bi-diagram-3"
  | "bi-cast"
  | "bi-box-seam"
  | "bi-cloud-haze2"
  | "bi-cloud-plus"
  | "bi-lightbulb"
  | "bi-lightning"
  | "bi-award"
  | "bi-binoculars"
  | "bi-wallet2"
  | "bi-currency-bitcoin"
  | "bi-diagram-2"
  | "bi-person-video3"
  | "bi-person-workspace"
  | "bi-person-check"
  | "bi-server"
  // Maintenance & Repair
  | "bi-tools"
  | "bi-hammer"
  | "bi-wrench"
  | "bi-screwdriver"
  // Home & Property
  | "bi-house-door"
  | "bi-building"
  | "bi-door-open"
  | "bi-thermometer-half"
  // Electrical
  | "bi-lightbulb-fill"
  | "bi-plug"
  | "bi-battery-charging"
  // Plumbing
  | "bi-droplet"
  | "bi-pipe"
  | "bi-cloud-rain"
  // Cleaning
  | "bi-brush"
  | "bi-bucket"
  | "bi-recycle"
  // Transport & Delivery
  | "bi-truck"
  | "bi-truck-flatbed"
  | "bi-bicycle"
  | "bi-car-front"
  // Business & Orders
  | "bi-bag-check"
  | "bi-cash-stack"
  // Staff & Team
  | "bi-person"
  | "bi-person-gear"
  // Quality & Status
  | "bi-badge-check"
  | "bi-star-fill"
  // Digital & Misc
  | "bi-gear-wide-connected"
  | "bi-flag"
  | "bi-clock"
  | "bi-map"
  // Productivity, SaaS, Innovation, & Team Icons
  | "bi-bar-chart-steps";

const paths: Partial<Record<IconName, ReactNode>> = {
  top: <><path d="M12 19V5M6 11l6-6 6 6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
  services: <><path d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16" /></>,
  contact: <><circle cx="12" cy="12" r="9" /><path d="M8.5 8.5c1 4 3 6 7 7l2-2-3-1-1 1c-1.6-.8-2.7-1.9-3.5-3.5l1-1-1-3-2 2Z" /></>,
  partners: <><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 12a4 4 0 1 0 0-8M2 20c0-4 2-6 6-6s6 2 6 6M14 15c4-1 8 1 8 5" /></>,
  messages: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  users: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-5 2-7 6-7s6 2 6 7M15 14c4 0 6 2 6 6" /></>,
  website: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M7 6h.01M10 6h.01" /></>,
  logout: <><path d="M10 5H4v14h6M14 8l4 4-4 4M8 12h10" /></>,
  eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  edit: <><path d="m4 16-1 5 5-1L19 9l-4-4L4 16ZM13 7l4 4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  upload: <><path d="M12 16V4M7 9l5-5 5 5M4 15v5h16v-5" /></>,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  pin: <><path d="M12 17v4M10 4h4l1 7-3 1-3-1 1-7Z" /></>,
  phone: <path d="M7 3 4 5c0 8 7 15 15 15l2-3-5-3-2 2c-3-1-5-3-6-6l2-2-3-5Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  whatsapp: <><circle cx="12" cy="12" r="9" /><path d="M8 8c1 4 4 7 8 8l2-2-3-2-1 1c-2-1-3-2-4-4l1-1-2-3-1 3Z" /></>,
  facebook: <path d="M14 21v-8h3l.5-4H14V7c0-1 .5-2 2-2h2V2h-3c-4 0-5 2-5 5v2H7v4h3v8" />,
  linkedin: <><rect x="3" y="9" width="4" height="12" /><path d="M5 3v.01M11 21V9h4v2c1-2 6-3 6 4v6M3 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  cloud: <path d="M6 19a4 4 0 0 1-1-7.9A7 7 0 0 1 18.7 9 5 5 0 0 1 19 19H6Z" />,
  shield: <><path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z" /></>,
  house: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
  heart: <path d="M12 21S3 16 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12Z" />,
  cart: <><path d="M3 4h2l2 12h11l2-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
  userBadge: <><circle cx="10" cy="8" r="4" /><path d="M3 21c0-5 2-8 7-8 2 0 4 .5 5 2" /><circle cx="18" cy="17" r="4" /><path d="m16.5 17 1 1 2-2" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  if (name.startsWith("fa-") || name.startsWith("fas ")) {
    const fontAwesomeClass = name.startsWith("fa-") ? `fa ${name}` : name;
    return (
      <i 
        className={`${fontAwesomeClass} icon`} 
        style={{ 
          fontSize: `${size}px`, 
          lineHeight: 1, 
          display: "inline-flex", 
          alignItems: "center", 
          justifyContent: "center",
          filter: "none",
          textShadow: "none",
          boxShadow: "none"
        }} 
        aria-hidden="true" 
      />
    );
  }

  if (name.startsWith("bi-")) {
    return (
      <i 
        className={`bi ${name} icon`} 
        style={{ 
          fontSize: `${size}px`, 
          lineHeight: 1, 
          display: "inline-flex", 
          alignItems: "center", 
          justifyContent: "center",
          filter: "none",
          textShadow: "none",
          boxShadow: "none"
        }} 
        aria-hidden="true" 
      />
    );
  }

  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}