import { useRef, useState } from "react";
import { apiDelete, apiPost, apiPut, useApi } from "../../api";
import { Button } from "../components/Button";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { Icon, type IconName } from "../components/Icon";
import { Modal } from "../components/Modal";
import { SelectField } from "../components/SelectField";
import { collectFields, useAction } from "../lib/helpers";

type ContactItemRow = { id: number; icon?: string | null; label: string; value?: string | null };

const CONTACT_ICONS = [
  "bi-geo-alt",
  "bi-telephone",
  "bi-envelope",
  "bi-instagram",
  "bi-facebook",
  "bi-linkedin",
  "bi-whatsapp",
];

// Helper to clean database icon strings like "bi bi-whatsapp" -> "bi-whatsapp"
const sanitizeIconName = (icon?: string | null): IconName => {
  if (!icon) return "bi-geo-alt";
  const cleaned = icon.replace(/^bi\s+/, "").trim();
  return cleaned as IconName;
};

export function ContactPage({ notify }: { notify: () => void }) {
  const { data, loading, error, reload } = useApi<ContactItemRow[]>("/contact-items", []);
  const [creating, setCreating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { error: aErr, run } = useAction(notify);

  const update = (id: number, root: Element | null) => {
    const f = collectFields(root);
    run(apiPut(`/contact-items/${id}`, { label: f.Label ?? "", value: f["Value / Link"] ?? "" }), reload);
  };

  const remove = (id: number) => {
    if (id > 0 && window.confirm("Delete this contact item?")) run(apiDelete(`/contact-items/${id}`), reload);
  };

  const saveNew = () => {
    const f = collectFields(modalRef.current);
    const p = apiPost("/contact-items", { icon: f.Icon ?? "bi-geo-alt", label: f.Label ?? "", value: f["Value / Link"] ?? "", sort: data.length });
    run(p, reload).then(() => setCreating(false)).catch(() => { /* banner shows the error */ });
  };

  const state = data.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No contact items yet." };

  return (
    <DottedCard className="contact-wrapper">
      {aErr && <div className="banner banner--error">{aErr}</div>}
      <div className="card-action"><Button tone="teal" icon="plus" onClick={() => setCreating(true)}>Add Contact Item</Button></div>
      <div className="contact-grid">
        {data.map((item, i) => (
          <article className="contact-card" key={item.id ?? i}>
            <div className="contact-icon">
              <Icon name={sanitizeIconName(item.icon)} size={45} />
              <Button onClick={(e) => update(item.id, e.currentTarget.closest(".contact-card"))}>Update</Button>
              <Button tone="ghost" icon="trash" onClick={() => remove(item.id)} title="Delete" />
            </div>
            <div>
              <Field label="Label" value={item.label} />
              <Field label="Value / Link" value={item.value ?? ""} />
            </div>
          </article>
        ))}
        {state && <div className="table-state">{state.kind === "loading" ? "Loading…" : state.kind === "empty" ? state.text : state.text}</div>}
      </div>
      {creating && (
        <Modal title="Add Contact Item" onClose={() => setCreating(false)} footer={<><Button tone="teal" onClick={saveNew}>Save</Button></>}>
          <div className="modal-form" ref={modalRef}>
            <SelectField 
              label="Icon" 
              value="bi-geo-alt" 
              options={CONTACT_ICONS.map((i) => ({ 
                value: i, 
                label: (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Icon name={i as IconName} size={16} />
                    <span>{i}</span>
                  </span>
                ) 
              }))} 
            />
            <Field label="Label" value="" placeholder="e.g. Address" />
            <Field label="Value / Link" value="" placeholder="e.g. Beirut, Lebanon" />
          </div>
        </Modal>
      )}
    </DottedCard>
  );
}