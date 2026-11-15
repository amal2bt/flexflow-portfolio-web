import { useRef, useState } from "react";
import { apiDelete, apiForm, apiPost, apiPut, assetUrl, useApi } from "../../api";
import { ActionButtons } from "../components/ActionButtons";
import { Brand, DottedCard } from "../components/Shell";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { Field } from "../components/Field";
import { FileInput } from "../components/FileInput";
import { collectFields, useAction, useImage } from "../lib/helpers";

type StepRow = { id: number; title: string; description?: string | null; sort?: number };
type ViewMode = { kind: "list" } | { kind: "add" } | { kind: "edit"; step: StepRow };

function ProcessCycle() {
  const labels = ["PLAN", "DESIGN", "IMPLEMENT", "TEST", "DEPLOY", "UPKEEP"];
  return (
    <div className="process-cycle">
      <div className="cycle-ring" />
      <div className="cycle-center"><Brand /></div>
      {labels.map((label, i) => (
        <div className={`cycle-part cycle-part-${i + 1}`} key={label}>
          <small>{i + 1}</small>{label}
        </div>
      ))}
      <i className="dot d1" /><i className="dot d2" /><i className="dot d3" /><i className="dot d4" /><i className="dot d5" /><i className="dot d6" />
    </div>
  );
}

export function ProcessPage({ notify }: { notify: () => void }) {
  const { data: section, reload: reloadSection } = useApi<{ title?: string; text1?: string; text2?: string; image?: string }>("/process-section", {});
  const { data: steps, loading, error, reload } = useApi<StepRow[]>("/process-steps", []);
  
  const [view, setView] = useState<ViewMode>({ kind: "list" });
  
  // Controlled form state
  const [stepNumber, setStepNumber] = useState<number | string>("");
  const [stepTitle, setStepTitle] = useState("");
  const [stepDesc, setStepDesc] = useState("");

  const sectionCard = useRef<HTMLDivElement>(null);
  const img = useImage(section?.image);
  const { error: aErr, run } = useAction(notify);

  const openAdd = () => {
    setStepNumber(steps.length + 1);
    setStepTitle("");
    setStepDesc("");
    setView({ kind: "add" });
  };

  const openEdit = (step: StepRow, index: number) => {
    setStepNumber(step.sort ? step.sort + 1 : index + 1);
    setStepTitle(step.title);
    setStepDesc(step.description ?? "");
    setView({ kind: "edit", step });
  };

  const saveMain = () => {
    const f = collectFields(sectionCard.current);
    const form = new FormData();
    form.set("title", f.Title ?? "");
    form.set("text1", f["Text 1 (lead paragraph)"] ?? "");
    form.set("text2", f["Text 2"] ?? "");
    if (img.fileRef.current) form.set("image", img.fileRef.current);
    if (img.remove) form.set("remove_image", "1");
    run(apiForm("/process-section", form, "POST"), reloadSection);
  };

  const saveStep = async () => {
    const isEdit = view.kind === "edit";
    // Sort array in memory first
    const currentSteps = [...steps].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
    
    // Determine target 0-based insertion index
    const parsedPos = parseInt(String(stepNumber), 10);
    const targetPos = Math.max(1, Math.min(isNaN(parsedPos) ? currentSteps.length + 1 : parsedPos, currentSteps.length + (isEdit ? 0 : 1)));
    const targetIndex = targetPos - 1;

    let reorderedList: { id?: number; title: string; description?: string | null }[] = [];

    if (isEdit) {
      const existingIdx = currentSteps.findIndex((s) => s.id === view.step.id);
      if (existingIdx !== -1) {
        const [removed] = currentSteps.splice(existingIdx, 1);
        currentSteps.splice(targetIndex, 0, { ...removed, title: stepTitle, description: stepDesc });
      }
      reorderedList = currentSteps;
    } else {
      currentSteps.splice(targetIndex, 0, { id: -1, title: stepTitle, description: stepDesc });
      reorderedList = currentSteps;
    }

    // Save step with target sort index
    const payload = {
      title: stepTitle,
      description: stepDesc,
      sort: targetIndex,
    };

    const request = isEdit
      ? apiPut(`/process-steps/${view.step.id}`, payload)
      : apiPost("/process-steps", payload);

    try {
      await run(request, reload);

      // Re-sync all remaining existing items' sort orders on backend if shifted
      const updatePromises = reorderedList.map((item, index) => {
        if (item.id && item.id > 0 && item.id !== (isEdit ? view.step.id : -1)) {
          return apiPut(`/process-steps/${item.id}`, { sort: index });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      reload();
      setView({ kind: "list" });
    } catch {
      // Error is handled by run action hook
    }
  };

  const removeStep = (id: number) => { 
    if (id > 0 && window.confirm("Delete this process step?")) run(apiDelete(`/process-steps/${id}`), reload); 
  };

  // Sort steps strictly by sort field
  const sortedSteps = [...steps].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  const rows = sortedSteps.map((step, i) => ({ 
    number: i + 1, 
    title: step.title, 
    description: step.description, 
    actions: <ActionButtons onEdit={() => openEdit(step, i)} onDelete={() => removeStep(step.id)} /> 
  }));

  const state = rows.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No process steps yet." };

  // Render Form View (Add / Edit)
  if (view.kind === "add" || view.kind === "edit") {
    const isEdit = view.kind === "edit";
    return (
      <div className="stack process-page">
        <div className="breadcrumb-nav" style={{ marginBottom: "16px", color: "#666" }}>
          <span style={{ cursor: "pointer", color: "#0066cc" }} onClick={() => setView({ kind: "list" })}>Dashboard</span> / <span style={{ cursor: "pointer", color: "#0066cc" }} onClick={() => setView({ kind: "list" })}>Our Process</span> / {isEdit ? "Edit" : "Add"}
        </div>
        {aErr && <div className="banner banner--error">{aErr}</div>}

        <DottedCard title={isEdit ? "Edit Step" : "Add New Step"}>
          <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div className="field-group">
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Step Number</label>
              <input 
                type="number" 
                min="1"
                className="input-field"
                value={stepNumber} 
                onChange={(e) => setStepNumber(e.target.value)} 
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div className="field-group">
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Title</label>
              <input 
                type="text" 
                className="input-field"
                value={stepTitle} 
                onChange={(e) => setStepTitle(e.target.value)} 
                placeholder="Enter step title"
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div className="field-group">
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Description</label>
              <textarea 
                className="input-field"
                rows={4}
                value={stepDesc} 
                onChange={(e) => setStepDesc(e.target.value)} 
                placeholder="Enter step description..."
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              <Button tone="teal" onClick={saveStep}>{isEdit ? "Save Changes" : "Add Step"}</Button>
            </div>
          </div>
        </DottedCard>
      </div>
    );
  }

  // Render Default List View
  return (
    <div className="stack process-page">
      {aErr && <div className="banner banner--error">{aErr}</div>}
      
      <DottedCard title="Main Process Section">
        <div className="two-column">
          <div ref={sectionCard}>
            <Field label="Title" value={section?.title ?? ""} placeholder="Our Proven Development Process" />
            <Field label="Text 1 (lead paragraph)" area value={section?.text1 ?? ""} placeholder="Every FlexFlow project follows a structured, collaborative process…" />
            <Field label="Text 2" area value={section?.text2 ?? ""} placeholder="From early planning to long-term maintenance, we combine design thinking…" />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 className="media-label" style={{ textAlign: "center", marginBottom: "12px", width: "100%" }}>Image</h3>
            
            <div className="image-preview-container">
              {img.image ? (
                <img className="preview-img" src={assetUrl(img.image)} alt="Process section" />
              ) : (
                <ProcessCycle />
              )}
            </div>

            <div className="image-actions" style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", width: "100%", marginBottom: "16px" }}>
              <FileInput onFile={img.pick} />
              {img.image && <Button tone="ghost" icon="trash" onClick={img.clear}>Remove</Button>}
            </div>

            <div className="align-right" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Button tone="teal" onClick={saveMain}>Save Main Section</Button>
            </div>
          </div>
        </div>
      </DottedCard>

      <DottedCard title="Process Steps">
        <div className="card-action">
          <Button tone="teal" icon="plus" onClick={openAdd}>Add Step</Button>
        </div>
        <DataTable 
          className="process-table" 
          columns={[
            { key: "number", label: "#", className: "col-number" }, 
            { key: "title", label: "Title", className: "col-title" }, 
            { key: "description", label: "Description", className: "wide-cell" }, 
            { key: "actions", label: "Actions", className: "col-actions" }
          ]} 
          rows={rows} 
          state={state} 
        />
      </DottedCard>
    </div>
  );
}