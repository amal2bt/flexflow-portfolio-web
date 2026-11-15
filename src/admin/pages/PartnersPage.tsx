import { useRef, useState } from "react";
import { apiDelete, apiForm, assetUrl, useApi } from "../../api";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { FileInput } from "../components/FileInput";
import { Icon } from "../components/Icon";
import { Modal } from "../components/Modal";
import { collectFields, useAction, useImage } from "../lib/helpers";

type PartnerRow = { id: number; name: string; sub?: string | null; mark?: string | null; cls?: string | null; logo?: string | null };

type PaginatedPartners = {
  data: PartnerRow[];
  current_page: number;
  last_page: number;
  total: number;
};

const ITEMS_PER_PAGE = 8;

export function PartnersPage({ notify }: { notify: () => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch paginated data from backend using the current page query parameter
  const { data: response, loading, error, reload } = useApi<PaginatedPartners | PartnerRow[]>(
    `/partners?page=${currentPage}`, 
    { data: [], current_page: 1, last_page: 1, total: 0 }
  );
  
  const [editing, setEditing] = useState<PartnerRow | null>(null);

  const uploadCard = useRef<HTMLDivElement>(null);
  const editModal = useRef<HTMLDivElement>(null);
  const uploadImg = useImage(undefined);
  const editImg = useImage(editing?.logo);
  const { error: aErr, run, setError } = useAction(notify);

  const upload = () => {
    const f = collectFields(uploadCard.current);
    const name = f["Partner Name"]?.trim() ?? "";
    if (!name) { setError("Enter a partner name."); return; }
    const form = new FormData();
    form.set("name", name);
    form.set("sub", f.Sub ?? "");
    form.set("mark", f.Mark ?? "");
    form.set("cls", f.Class ?? "");
    if (uploadImg.fileRef.current) form.set("logo", uploadImg.fileRef.current);
    run(apiForm("/partners", form, "POST"), reload);
  };

  const saveEdit = () => {
    const f = collectFields(editModal.current);
    const form = new FormData();
    form.set("name", f.Name ?? "");
    form.set("sub", f.Sub ?? "");
    form.set("mark", f.Mark ?? "");
    form.set("cls", f.Class ?? "");
    if (editImg.fileRef.current) form.set("logo", editImg.fileRef.current);
    if (editImg.remove) form.set("remove_image", "1");
    run(apiForm(`/partners/${editing?.id}`, form, "PUT")).then(() => { setEditing(null); reload(); }).catch(() => {});
  };

  const remove = (id: number) => { 
    if (id > 0 && window.confirm("Delete this partner?")) run(apiDelete(`/partners/${id}`), reload); 
  };

  const logoUrl = (logo: PartnerRow) => assetUrl(logo.logo);

  // Extract partners array and pagination metadata safely from Laravel's response object
  const partners = Array.isArray(response) ? response : (response?.data || []);
  const totalPages = Array.isArray(response) ? Math.ceil(response.length / ITEMS_PER_PAGE) : (response?.last_page || 1);
  const totalCount = Array.isArray(response) ? response.length : (response?.total || partners.length);

  // Backend already handles pagination slicing, so we use the array directly
  const paginatedData = partners;

  const state = partners.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No partner logos yet." };

  return (
    <div className="partners-page">
      {aErr && <div className="banner banner--error">{aErr}</div>}
      
      <section className="plain-card partner-upload" ref={uploadCard}>
        <h2><Icon name="upload" />Add Partner Logo</h2>
        <span className="upload-label">Partner Logo</span>
        <div className="partner-upload-row">
          <div>
            <Field label="Partner Name" value="" placeholder="e.g. LUMORA" />
            <FileInput onFile={uploadImg.pick} />
            <p>Recommended: PNG or WEBP with transparent background.</p>
          </div>
          <Button icon="upload" onClick={upload}>Upload Logo</Button>
        </div>
      </section>

      <section className="plain-card">
        <div className="partner-title">
          <h2>Partner Logos</h2>
          <span>{totalCount} Logos</span>
        </div>

        <div className="logo-grid">
          {paginatedData.map((logo) => (
            <article className="logo-tile" key={logo.id}>
              <div className={`logo-preview ${logo.cls ?? ""}`}>
                {logo.logo ? <img className="logo-img" src={logoUrl(logo)} alt={logo.name} /> : <i>{logo.mark || "?"}</i>}
                <strong>{logo.name}</strong><small>{logo.sub}</small>
              </div>
              <div className="logo-actions">
                <Button tone="edit" icon="edit" onClick={() => { setEditing(logo); editImg.clear(); }} title="Edit" />
                <Button tone="ghost" icon="trash" onClick={() => remove(logo.id)} title="Delete" />
              </div>
            </article>
          ))}
          {state && <div className="table-state">{state.text}</div>}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px" }}>
            {currentPage > 1 && (
              <Button tone="ghost" onClick={() => setCurrentPage((p) => p - 1)}>
                Previous
              </Button>
            )}

            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages && (
              <Button tone="ghost" onClick={() => setCurrentPage((p) => p + 1)}>
                Next
              </Button>
            )}
          </div>
        )}
      </section>

      {editing && (
        <Modal title={`Edit Partner — ${editing.name}`} onClose={() => setEditing(null)} footer={<><Button tone="teal" onClick={saveEdit}>Save Partner</Button></>}>
          <div className="modal-form" ref={editModal}>
            <Field label="Name" value={editing.name} />
            <Field label="Sub" value={editing.sub ?? ""} />
            <Field label="Mark" value={editing.mark ?? ""} />
            <Field label="Class" value={editing.cls ?? ""} />
            {editImg.image && <div className="image-preview"><img src={assetUrl(editImg.image)} alt="Partner logo" /><button type="button" className="image-remove" onClick={editImg.clear}>×</button></div>}
            <label className="media-label">Partner Logo</label>
            <FileInput onFile={editImg.pick} />
          </div>
        </Modal>
      )}
    </div>
  );
}