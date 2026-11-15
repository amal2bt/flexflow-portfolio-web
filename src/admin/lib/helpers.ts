import { useEffect, useRef, useState } from "react";

/** Read every `.field` control inside a root keyed by its visible label. */
export function collectFields(root: Element | null): Record<string, string> {
  const out: Record<string, string> = {};
  root?.querySelectorAll<HTMLElement>(".field").forEach((field) => {
    const label = field.querySelector("span")?.textContent?.trim() ?? "";
    const control = field.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select");
    if (label && control) out[label] = control.value;
  });
  return out;
}

export function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Track a section image: current URL + picked file + explicit removal. */
export function useImage(current?: string | null) {
  const [image, setImage] = useState<string | undefined>(current ?? undefined);
  const fileRef = useRef<File | null>(null);
  const [remove, setRemove] = useState(false);
  useEffect(() => setImage(current ?? undefined), [current]);
  const pick = (file: File | null) => { fileRef.current = file; if (file) setRemove(false); };
  const clear = () => { fileRef.current = null; setRemove(true); setImage(undefined); };
  return { image, fileRef, remove, pick, clear };
}

/** Run an async action with success toast + refetch, surfacing failures. */
export function useAction(notify: () => void) {
  const [error, setError] = useState("");
  const run = (p: Promise<unknown>, refetch?: () => void) =>
    p
      .then(() => {
        // Tell any mounted public site (or open tab) to re-pull the live data.
        window.dispatchEvent(new Event("flexflow_site_updated"));
        refetch?.();
        notify();
        setError("");
      })
      .then(() => { /* placeholder so the chain stays a promise */ })
      .catch((err: unknown) => { setError(errorText(err)); throw err; });
  return { error, run, setError };
}

export function fmtDate(value?: string | null): string {
  if (!value) return "";
  return value.replace("T", " ").replace("Z", "").slice(0, 19);
}
