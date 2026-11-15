import { useState } from "react";
import { apiDelete, apiPatch, useApi } from "../../api";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { MessageModal, type MessageRow } from "../components/MessageModal";
import { DottedCard } from "../components/Shell";
import { fmtDate, useAction } from "../lib/helpers";

export function MessagesPage({ notify }: { notify: () => void }) {
  const [status, setStatus] = useState("All");
  const path = status === "All" ? "/messages" : `/messages?status=${status.toLowerCase()}`;
  const { data, loading, error, reload } = useApi<MessageRow[]>(path, []);
  const [viewing, setViewing] = useState<MessageRow | null>(null);
  const { run } = useAction(notify);
  const setMessageStatus = (id: number | undefined, next: string) => { if (id && id > 0) run(apiPatch(`/messages/${id}`, { status: next }), reload); };
  const remove = (id?: number) => { if (id && id > 0 && window.confirm("Delete this message?")) run(apiDelete(`/messages/${id}`), reload); };
  const rows = data.map((message) => ({
    name: message.name,
    email: message.email,
    subject: message.subject,
    date: fmtDate(message.created_at),
    status: message.status || "pending",
    actions: <div className="action-buttons icon-actions"><Button tone="teal" icon="check" title="Mark as read" onClick={() => setMessageStatus(message.id, "read")} /><Button icon="eye" title="View" onClick={() => setViewing(message)} /><Button tone="danger" icon="trash" title="Delete" onClick={() => remove(message.id)} /></div>,
  }));
  const state = rows.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No messages." };
  return <DottedCard>
    <div className="status-filter"><label>Filter by Status: <select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Pending</option><option>Read</option></select></label></div>
    <DataTable columns={[{ key: "name", label: "Name", className: "message-name" }, { key: "email", label: "Email" }, { key: "subject", label: "Subject", className: "wide-cell" }, { key: "date", label: "Date Sent" }, { key: "status", label: "Status" }, { key: "actions", label: "Actions" }]} rows={rows} state={state} />
    {viewing && <MessageModal message={viewing} onClose={() => setViewing(null)} onChanged={reload} notify={notify} />}
  </DottedCard>;
}
