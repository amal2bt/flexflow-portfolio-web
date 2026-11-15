import { useRef, useState } from "react";
import { apiDelete, apiPost, apiPut, useApi } from "../../api";
import { ActionButtons } from "../components/ActionButtons";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { Modal } from "../components/Modal";
import { collectFields, useAction } from "../lib/helpers";

type ChallengeRow = { id: number; title: string; description?: string | null };

export function ChallengeModalPage({ notify }: { notify: () => void }) {
  const { data, loading, error, reload } = useApi<ChallengeRow[]>("/challenges", []);
  const [editing, setEditing] = useState<ChallengeRow | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { error: aErr, run } = useAction(notify);
  const save = () => {
    const f = collectFields(modalRef.current);
    const payload = { title: f.Title ?? "", description: f.Description ?? "" };
    const p = editing && editing.id > 0
      ? apiPut(`/challenges/${editing.id}`, payload)
      : apiPost("/challenges", { ...payload, sort: data.length });
    run(p, reload).then(() => setEditing(null)).catch(() => { /* banner shows the error */ });
  };
  const remove = (id: number) => { if (id > 0 && window.confirm("Delete this challenge?")) run(apiDelete(`/challenges/${id}`), reload); };
  const rows = data.map((challenge) => ({ title: challenge.title, description: challenge.description, actions: <ActionButtons onEdit={() => setEditing(challenge)} onDelete={() => remove(challenge.id)} /> }));
  const state = rows.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No challenges yet." };
  return <DottedCard className="challenges-card">
    {aErr && <div className="banner banner--error">{aErr}</div>}
    <div className="card-action"><Button tone="teal" icon="plus" onClick={() => setEditing({ id: -1, title: "", description: "" })}>Add Challenge</Button></div>
    <DataTable columns={[{ key: "title", label: "Title", className: "challenge-title" }, { key: "description", label: "Description", className: "challenge-description" }, { key: "actions", label: "Actions", className: "challenge-actions" }]} rows={rows} state={state} />
    {editing && <Modal title={editing.id > 0 ? "Edit Challenge" : "Add Challenge"} onClose={() => setEditing(null)} footer={<><Button tone="teal" onClick={save}>Save Challenge</Button></>}>
      <div className="modal-form" ref={modalRef}><Field label="Title" value={editing.title} /><Field label="Description" area value={editing.description ?? ""} /></div>
    </Modal>}
  </DottedCard>;
}
