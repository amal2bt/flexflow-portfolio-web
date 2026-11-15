import { createContext, useContext } from "react";
import { assetUrl } from "@/api";
import type { Service } from "@/data/siteData";

export type RawService = {
  slug: string;
  title: string;
  short?: string;
  icon?: string;
  color?: string;
  side_title?: string;
  side_copy?: string;
  heading?: string;
  intro?: string;
  closing?: string;
  cards?: Array<{ title: string; description?: string; image?: string | null }>;
};

export type ContactRow = { icon?: string | null; label: string; value?: string | null };

export type RawSitePayload = {
  top?: { title?: string; subtitle?: string; image?: string | null } | null;
  about?: { heading?: string; description?: string; catchphrase?: string; paragraph_2?: string; paragraph_3?: string; image?: string | null } | null;
  vision?: { vision_text?: string; vision_text_2?: string; vision_text_3?: string; image?: string | null; points?: Array<{ point: string }> } | null;
  process?: { section?: { title?: string; text1?: string; text2?: string; image?: string | null } | null; steps?: Array<{ title: string; description?: string }> } | null;
  invest?: { section?: { title?: string; subtitle?: string; image?: string | null } | null; stats?: Array<{ label: string; value: number }>; features?: Array<{ icon?: string; title: string; description?: string }> } | null;
  services?: RawService[] | null;
  challenges?: Array<{ title: string; description?: string }> | null;
  contact?: ContactRow[] | null;
  partners?: Array<{ name: string; logo?: string | null }> | null;
};

export type SitePayload = Omit<RawSitePayload, "services"> & { services?: Service[] };

export const emptySite: SitePayload = {};
export const SiteDataContext = createContext<SitePayload>(emptySite);
export const useSite = () => useContext(SiteDataContext);

/**
 * Normalize a stored icon name to one canonical token so the admin's Bootstrap
 * Icons (`bi-whatsapp`) and the site's short names (`whatsapp`) can be matched.
 * Also tolerates legacy values like `"bi bi-whatsapp"`.
 */
export function iconKey(icon?: string | null): string {
  const parts = (icon ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return parts.find((part) => part.startsWith("bi-")) ?? parts[0] ?? "";
}

/** Map a Laravel service record into the shape the marketing site renders. */
export function toService(s: RawService): Service {
  return {
    slug: s.slug,
    title: s.title,
    short: s.short ?? "",
    icon: s.icon ?? "check",
    color: s.color ?? "#20d6b3",
    sideTitle: s.side_title ?? "",
    sideCopy: s.side_copy ?? "",
    heading: s.heading ?? "",
    intro: s.intro ?? "",
    cards: (s.cards ?? []).map((c) => ({
      title: c.title,
      description: c.description ?? "",
      images: c.image ? [assetUrl(c.image) as string] : [],
    })),
    closing: s.closing ?? "",
  };
}
