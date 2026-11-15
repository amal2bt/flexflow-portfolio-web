import { useCallback, useEffect, useState, type ReactNode } from "react";
import { apiGet } from "@/api";
import { services as fallbackServices, type Service } from "@/data/siteData";
import { SiteDataContext, toService, type RawSitePayload, type SitePayload } from "@/context/SiteContext";

/**
 * Hydrates the public marketing site with the live aggregate `GET /site`
 * payload and keeps it in sync with the admin panel:
 *  - fetches once on mount,
 *  - refetches whenever the admin dispatches `flexflow_site_updated`,
 *  - refetches when this tab regains focus/visibility (covers a second tab).
 */
export function SiteProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<RawSitePayload>({});

  const load = useCallback(() => {
    apiGet<RawSitePayload>("/site")
      .then((result) => {
        if (result) setRaw(result);
      })
      .catch(() => {
        /* keep whatever we have; sections fall back to their static copy */
      });
  }, []);

  useEffect(() => {
    load();

    const onSync = () => load();
    const onFocus = () => load();
    const onVisibility = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("flexflow_site_updated", onSync);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("flexflow_site_updated", onSync);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const list: Service[] = raw.services?.length ? raw.services.map(toService) : fallbackServices;
  const site: SitePayload = { ...raw, services: list };

  return <SiteDataContext.Provider value={site}>{children}</SiteDataContext.Provider>;
}
