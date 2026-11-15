import { Icon } from "./Icon";

export type ToastTone = "success" | "warning";

export function Toast({ text, tone = "success" }: { text: string; tone?: ToastTone }) {
  return (
    <div className={tone === "warning" ? "toast toast--warning" : "toast"}>
      <Icon name={tone === "warning" ? "bi-clock" : "check"} size={16} />
      {text}
    </div>
  );
}
