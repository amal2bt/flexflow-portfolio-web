import { apiDelete, apiPatch } from "../../api";
import { fmtDate } from "../lib/helpers";
import { Button } from "./Button";
import { Modal } from "./Modal";

export type MessageRow = { id?: number; name?: string; email?: string; subject?: string; body?: string; created_at?: string; status?: string };

export function MessageModal({ message, onClose, onChanged, notify }: { message: MessageRow; onClose: () => void; onChanged: () => void; notify: () => void }) {
  const markRead = () => {
    if (message.id) apiPatch(`/messages/${message.id}`, { status: "read" }).then(onChanged).then(onClose).then(notify);
  };
  const del = () => {
    if (message.id && window.confirm("Delete this message?")) apiDelete(`/messages/${message.id}`).then(onChanged).then(onClose).then(notify);
  };
  return (
    <Modal title="Message Details" onClose={onClose}>
      <div className="message-detail">
        {([["Name", message.name], ["Email", message.email], ["Subject", message.subject], ["Status", message.status || "pending"], ["Sent", fmtDate(message.created_at)]] as Array<[string, string | undefined]>).map(([k, v]) => <p key={k}><b>{k}:</b> {v || "—"}</p>)}
        <div className="message-body"><b>Message</b><p>{message.body || "No message body."}</p></div>
      </div>
      <div className="modal-actions">
        <Button tone="teal" icon="check" onClick={markRead}>Mark as Read</Button>
        <Button tone="danger" icon="trash" onClick={del}>Delete</Button>
      </div>
    </Modal>
  );
}
