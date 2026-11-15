import type { ReactNode } from "react";

export default function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return <div className="section-heading reveal">
    <div className="title-line"/><h2>{children}</h2><div className="title-line"/>
    {subtitle && <p>{subtitle}</p>}
  </div>;
}
