import { useState } from "react";
import { useApi } from "../../api";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { MessageModal, type MessageRow } from "../components/MessageModal";
import { DottedCard } from "../components/Shell";
import { fmtDate } from "../lib/helpers";

export function Dashboard({ notify }: { notify: () => void }) {
  const { data, loading, error, reload } = useApi<{ stats?: Record<string, number>; recent_messages?: MessageRow[] }>("/dashboard", {});
  const [viewing, setViewing] = useState<MessageRow | null>(null);
  const stats = [
    [String(data?.stats?.pending_messages ?? 0), "Pending Messages"],
    [String(data?.stats?.total_messages ?? 0), "Totals Messages"],
    [String(data?.stats?.pending_testimonials ?? 0), "Pending Testimonials"],
    [String(data?.stats?.total_testimonials ?? 0), "Total Testimonials"],
  ];
  const messages = data?.recent_messages ?? [];
  const rows = messages.map((m, i) => ({
    number: i + 1,
    name: m.name,
    email: m.email,
    subject: m.subject,
    date: fmtDate(m.created_at),
    actions: <div className="action-buttons icon-actions"><Button icon="eye" title="View" onClick={() => { if (m.id && m.id > 0) setViewing(m); }} /></div>,
  }));
  const state = messages.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No messages yet." };
  return (
    <>
      <div className="stat-grid">
        {stats.map(([value, label]) => <article className="stat-card" key={label}><strong>{value}</strong><span>{label}</span></article>)}
      </div>
      <DottedCard title="Recent Messages" className="dashboard-table">
        {/* Added wrapper div with custom class to isolate the CSS rule */}
        <div className="hide-table-length">
          <DataTable columns={[{ key: "number", label: "#" }, { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "subject", label: "Subject", className: "wide-cell" }, { key: "date", label: "Date Sent" }, { key: "actions", label: "Actions" }]} rows={rows} state={state} />
        </div>
      </DottedCard>
      {viewing && <MessageModal message={viewing} onClose={() => setViewing(null)} onChanged={reload} notify={notify} />}
    </>
  );
}