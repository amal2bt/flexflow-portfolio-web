import { useRef, useState } from "react";
import { apiDelete, apiForm, apiPost, apiPut, assetUrl, useApi } from "../../api";
import { ActionButtons } from "../components/ActionButtons";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { FileInput } from "../components/FileInput";
import { Modal } from "../components/Modal";
import { collectFields, useAction, useImage } from "../lib/helpers";

export type ServiceCardRow = { id: number; title: string; description?: string | null; image?: string | null };

export type ServiceRow = { 
  id: number; 
  slug: string; 
  title: string; 
  short?: string | null; 
  icon?: string | null; 
  color?: string | null; 
  side_title?: string | null; 
  side_copy?: string | null; 
  heading?: string | null; 
  intro?: string | null; 
  closing?: string | null; 
  cards?: ServiceCardRow[] 
};

export function ServiceDetail({ serviceId, service, onClose, notify }: { serviceId: number; service: ServiceRow; onClose: () => void; notify: () => void }) {
  const { data, loading, error, reload } = useApi<ServiceRow>(serviceId > 0 ? `/services/${serviceId}` : null, service);
  const [editingCard, setEditingCard] = useState<ServiceCardRow | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardModal = useRef<HTMLDivElement>(null);
  const cardImg = useImage(editingCard?.image);
  const { error: aErr, run } = useAction(notify);

  const cards = data?.cards ?? [];

  const saveContent = () => {
    const f = collectFields(contentRef.current);
    const payload = {
      title: data?.title || service.title,
      short: data?.short || service.short,
      icon: data?.icon || service.icon,
      color: data?.color || service.color,
      side_title: f["Title 1"] ?? "",
      side_copy: f["Text 1"] ?? "",
      heading: f["Title 2"] ?? "",
      intro: f["Text 2"] ?? "",
      closing: f["Text 3"] ?? "",
    };
    run(apiPut(`/services/${serviceId}`, payload), reload);
  };

  const saveCard = () => {
    const f = collectFields(cardModal.current);
    const form = new FormData();
    form.set("title", f.Title ?? "");
    form.set("description", f.Description ?? "");
    if (cardImg.fileRef.current) form.set("image", cardImg.fileRef.current);
    if (cardImg.remove) form.set("remove_image", "1");

    const p = editingCard && editingCard.id > 0
      ? apiForm(`/cards/${editingCard.id}`, form, "PUT")
      : apiForm(`/services/${serviceId}/cards`, form, "POST");

    run(p, reload).then(() => setEditingCard(null)).catch(() => {});
  };

  const removeCard = (id: number) => { 
    if (id > 0 && window.confirm("Delete this service detail card?")) run(apiDelete(`/cards/${id}`), reload); 
  };

  const cardRows = cards.map((card) => ({
    image: card.image ? <img className="card-thumb" src={assetUrl(card.image)} alt={card.title} style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "6px" }} /> : "—",
    title: card.title,
    description: card.description,
    actions: <ActionButtons onEdit={() => { setEditingCard(card); cardImg.clear(); }} onDelete={() => removeCard(card.id)} />,
  }));

  const state = cardRows.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No detail items yet." };

  return (
    <div className="stack service-detail-view" style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 0" }}>
      {aErr && <div className="banner banner--error">{aErr}</div>}
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <Button tone="ghost" onClick={onClose}>← Back to Services</Button>
      </div>

      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "700", margin: "0 0 24px 0", color: "#032b5e" }}>
        Manage Service: {data?.title || service.title}
      </h1>

      <DottedCard style={{ backgroundColor: "#ffffff", padding: "24px", marginBottom: "28px" }}>
        <div ref={contentRef} className="two-column" style={{ gap: "32px" }}>
          <div className="stack" style={{ gap: "12px" }}>
            <h3 style={{ textAlign: "center", fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>Sidebar Content</h3>
            <Field label="Title 1" value={data?.side_title ?? ""} placeholder="One Platform. Complete Business Control." />
            <Field label="Text 1" area value={data?.side_copy ?? ""} placeholder="Manage every part of your business from one intelligent platform..." />
          </div>

          <div className="stack" style={{ gap: "12px" }}>
            <h3 style={{ textAlign: "center", fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>Main Content</h3>
            <Field label="Title 2" value={data?.heading ?? ""} placeholder="Enterprise Resource Planning Solutions Built Around Your Business" />
            <Field label="Text 2" area value={data?.intro ?? ""} placeholder="Every business operates differently, which is why FlexFlow ERP is fully customizable..." />
            <Field label="Text 3" area value={data?.closing ?? ""} placeholder="FlexFlow ERP is more than software; it is a long-term business platform..." />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <Button tone="teal" onClick={saveContent}>Save Content</Button>
        </div>
      </DottedCard>

      <DottedCard title="Detail Items" style={{ backgroundColor: "#ffffff", padding: "24px" }}>
        <div className="card-action" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <Button tone="teal" icon="plus" onClick={() => { setEditingCard({ id: -1, title: "", description: "" }); cardImg.clear(); }}>
            + Add Detail
          </Button>
        </div>

        <DataTable 
          columns={[
            { key: "image", label: "Image" }, 
            { key: "title", label: "Title" }, 
            { key: "description", label: "Description", className: "wide-cell" }, 
            { key: "actions", label: "Actions" }
          ]} 
          rows={cardRows} 
          state={state} 
          controls={false} 
          sortable={false} 
          footer={false} 
        />
      </DottedCard>

      {editingCard && (
        <Modal title={editingCard.id > 0 ? "Edit Detail Card" : "Add Detail Card"} onClose={() => setEditingCard(null)} footer={<><Button tone="teal" onClick={saveCard}>Save Card</Button></>}>
          <div className="modal-form" ref={cardModal}>
            <Field label="Title" value={editingCard.title} />
            <Field label="Description" area value={editingCard.description ?? ""} />
            
            <label className="media-label" style={{ display: "block", margin: "12px 0 6px 0" }}>Card Image</label>
            <div className="image-preview-container">
              {cardImg.image ? (
                <img className="preview-img" src={assetUrl(cardImg.image)} alt="Card image" />
              ) : (
                <div style={{ color: "#888", fontSize: "14px" }}>No image selected</div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginTop: "12px" }}>
              <FileInput onFile={cardImg.pick} />
              {cardImg.image && <Button tone="ghost" icon="trash" onClick={cardImg.clear}>Remove</Button>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}