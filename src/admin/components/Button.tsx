import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Button({ children, tone = "primary", icon, onClick, className = "", title, disabled = false }: { children?: ReactNode; tone?: "primary" | "teal" | "edit" | "danger" | "details" | "ghost" | "dark" | "light"; icon?: IconName; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; className?: string; title?: string; disabled?: boolean }) {
  return <button className={`button button--${tone} ${className}`} onClick={onClick} title={title} disabled={disabled}>{icon && <Icon name={icon} size={14} />}{children}</button>;
}
