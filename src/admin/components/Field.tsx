import { useEffect, useState } from "react";

export function Field({ label, value, area = false, focused = false, placeholder, type = "text", disabled = false, onChange }: { label: string; value: string; area?: boolean; focused?: boolean; placeholder?: string; type?: string; disabled?: boolean; onChange?: (value: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const apply = onChange ?? setText;
  return (
    <label className="field">
      <span>{label}</span>
      {area
        ? <textarea placeholder={placeholder} value={onChange ? value : text} onChange={(e) => apply(e.target.value)} disabled={disabled} />
        : <input type={type} className={focused ? "is-focused" : ""} placeholder={placeholder} value={onChange ? value : text} onChange={(e) => apply(e.target.value)} disabled={disabled} />}
    </label>
  );
}
