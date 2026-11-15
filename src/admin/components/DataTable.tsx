import { useMemo, useState, type ReactNode } from "react";

export type Column = { key: string; label: string; className?: string };

export type Row = Record<string, ReactNode>;

export function DataTable({ columns, rows, controls = true, search = true, sortable = true, footer = true, className = "", state, pageSizes = [10, 25, 50] }: { columns: Column[]; rows: Row[]; controls?: boolean; search?: boolean; sortable?: boolean; footer?: boolean; className?: string; state?: { kind: "loading" | "empty" | "error"; text?: string }; pageSizes?: number[] }) {
  const [pageSize, setPageSize] = useState(pageSizes[0] ?? 10);
  const [page, setPage] = useState(1);

  const total = rows.length;
  const totalPages = footer ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const visible = useMemo(() => (footer ? rows.slice(start, start + pageSize) : rows), [footer, rows, start, pageSize]);

  const stateText = state
    ? state.kind === "loading" ? "Loading…" : state.kind === "empty" ? (state.text || "No records yet.") : (state.text || "Failed to load data.")
    : "";
  const range = total ? `Showing ${start + 1} to ${Math.min(start + pageSize, total)} of ${total} entries` : "Showing 0 records";
  return (
    <div className={`data-table ${className}`}>
      {controls && <div className="table-controls"><label>Show <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>{pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}</select> entries</label>{search && <label>Search: <input /></label>}</div>}
      <div className="table-scroll"><table><thead><tr>{columns.map((col) => <th className={col.className} key={col.key}>{col.label}{sortable && <span className="sort">↕</span>}</th>)}</tr></thead><tbody>{visible.map((row, i) => <tr key={i}>{columns.map((col) => <td className={col.className} key={col.key}>{row[col.key]}</td>)}</tr>)}{state && total === 0 && <tr><td className="table-state" colSpan={columns.length}>{stateText}</td></tr>}</tbody></table></div>
      {footer && <div className="table-footer"><span>{range}</span><div className="pagination"><button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}>Previous</button>{Array.from({ length: totalPages }, (_, i) => <button className={i + 1 === current ? "is-active" : ""} key={i} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}>Next</button></div></div>}
    </div>
  );
}
