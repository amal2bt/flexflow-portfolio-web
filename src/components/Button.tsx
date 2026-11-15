import type { ReactNode } from "react";

export default function Button({ children, outline = false, onClick, arrow = false }: { children: ReactNode; outline?: boolean; onClick?: () => void; arrow?: boolean }) {
  return <button className={`cta ${outline ? "outline" : ""}`} onClick={onClick}>{children}{arrow && <span>↗</span>}</button>;
}
