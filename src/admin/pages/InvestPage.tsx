import { useRef, useState } from "react";
import { apiDelete, apiForm, apiPost, apiPut, assetUrl, useApi } from "../../api";
import { ActionButtons } from "../components/ActionButtons";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { FileInput } from "../components/FileInput";
import { Icon, type IconName } from "../components/Icon";
import { Modal } from "../components/Modal";
import { SelectField } from "../components/SelectField";
import { collectFields, useAction, useImage } from "../lib/helpers";

type InvestStatRow = { id: number; label: string; value: number };

type InvestFeatureRow = { id: number; icon?: string | null; title: string; description?: string | null };

function InvestArtwork() {
  return (
    <div className="invest-art" style={{ width: "100%", height: "100%", minHeight: "360px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src="/why-invest-reference.png" alt="Business colleagues working together on a laptop" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

const FEATURE_ICONS: Partial<Record<IconName, string>> = {
  // Benefits & Financial / Security
  "bi-cash-stack": "Cash Stack / Financial",
  "bi-bar-chart-line": "Chart / Analytics",
  "bi-cloud-upload": "Cloud Upload",
  "bi-shield-lock": "Security / Protection",
  "bi-recycle": "Recycle / Sustainability",

  // Productivity / SaaS
  "bi-kanban": "Kanban / Project",
  "bi-kanban-fill": "Kanban (Solid)",
  "bi-calendar-check": "Scheduling",
  "bi-calendar-event": "Events",
  "bi-chat-left-dots": "Communication",
  "bi-headset": "Support / Helpdesk",
  "bi-clipboard-check": "Task Management",
  "bi-clipboard-data": "Analytics Dashboard",
  "bi-graph-up": "Growth Chart",
  "bi-diagram-3": "Organizational Structure",
  "bi-cast": "Screen Sharing / Streaming",
  "bi-box-seam": "Package / Deployment",
  "bi-cloud-haze2": "Cloud Monitoring",
  "bi-cloud-plus": "Cloud Expansion",

  // Innovation / Business
  "bi-lightbulb": "Ideas / Creativity",
  "bi-lightning": "Performance / Efficiency",
  "bi-award": "Quality Award",
  "bi-rocket-takeoff": "Startup Launch",
  "bi-speedometer2": "Performance Speed",
  "bi-bar-chart-steps": "Process Automation",
  "bi-binoculars": "Market Research",
  "bi-wallet2": "Finance Tools",
  "bi-currency-bitcoin": "Crypto",
  "bi-diagram-2": "Workflow",

  // Team / Users
  "bi-people": "Team / Users",
  "bi-person-badge": "Employee Badge",
  "bi-person-video3": "Conference / Meeting",
  "bi-person-workspace": "Workspace",
  "bi-person-check": "Verified Member",
};

export function InvestPage({ notify }: { notify: () => void }) {
  const { data: section, reload: reloadSection } = useApi<{ title?: string; subtitle?: string; image?: string }>("/invest-section", {});
  const { data: stats, loading: statsLoading, error: statsError, reload: reloadStats } = useApi<InvestStatRow[]>("/invest-stats", []);
  const { data: features, loading: featLoading, error: featError, reload: reloadFeatures } = useApi<InvestFeatureRow[]>("/invest-features", []);
  
  const [editingStat, setEditingStat] = useState<InvestStatRow | null>(null);
  const [editingFeature, setEditingFeature] = useState<InvestFeatureRow | null>(null);
  
  const sectionCard = useRef<HTMLDivElement>(null);
  const statModal = useRef<HTMLDivElement>(null);
  const featureModal = useRef<HTMLDivElement>(null);
  
  const img = useImage(section?.image);
  const { error: aErr, run } = useAction(notify);

  const saveTextSection = () => {
    const f = collectFields(sectionCard.current);
    const form = new FormData();
    form.set("title", f.Title ?? "");
    form.set("subtitle", f.Subtitle ?? "");
    run(apiForm("/invest-section", form, "POST"), reloadSection);
  };

  const saveImageSection = () => {
    const form = new FormData();
    if (img.fileRef.current) form.set("image", img.fileRef.current);
    if (img.remove) form.set("remove_image", "1");
    run(apiForm("/invest-section", form, "POST"), reloadSection);
  };

  const saveStat = () => {
    const f = collectFields(statModal.current);
    const payload = { label: f.Label ?? "", value: Number(f.Value ?? 0) || 0 };
    const p = editingStat && editingStat.id > 0
      ? apiPut(`/invest-stats/${editingStat.id}`, payload)
      : apiPost("/invest-stats", { ...payload, sort: stats.length });
    run(p, reloadStats).then(() => setEditingStat(null)).catch(() => {});
  };

  const removeStat = (id: number) => { 
    if (id > 0 && window.confirm("Delete this statistic?")) run(apiDelete(`/invest-stats/${id}`), reloadStats); 
  };

  const saveFeature = () => {
    const f = collectFields(featureModal.current);
    const payload = { icon: f.Icon ?? "bi-kanban", title: f.Title ?? "", description: f.Description ?? "" };
    const p = editingFeature && editingFeature.id > 0
      ? apiPut(`/invest-features/${editingFeature.id}`, payload)
      : apiPost("/invest-features", { ...payload, sort: features.length });
    run(p, reloadFeatures).then(() => setEditingFeature(null)).catch(() => {});
  };

  const removeFeature = (id: number) => { 
    if (id > 0 && window.confirm("Delete this feature?")) run(apiDelete(`/invest-features/${id}`), reloadFeatures); 
  };

  const statRows = stats.map((stat) => ({ 
    label: stat.label, 
    value: `${stat.value}%`, 
    actions: <ActionButtons onEdit={() => setEditingStat(stat)} onDelete={() => removeStat(stat.id)} /> 
  }));

  const featureRows = features.map((feature) => {
    const iconName = (feature.icon as IconName) in FEATURE_ICONS ? (feature.icon as IconName) : "bi-kanban";
    return {
      icon: (
        <span 
          className="service-icon" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: "32px", 
            height: "32px", 
            color: "#022b3a"
          }}
        >
          <Icon name={iconName} size={16} />
        </span>
      ),
      title: feature.title,
      description: feature.description,
      actions: <ActionButtons onEdit={() => setEditingFeature(feature)} onDelete={() => removeFeature(feature.id)} />
    };
  });

  const statState = statRows.length ? undefined : statsLoading ? { kind: "loading" as const } : statsError ? { kind: "error" as const, text: statsError } : { kind: "empty" as const, text: "No statistics yet." };
  const featureState = featureRows.length ? undefined : featLoading ? { kind: "loading" as const } : featError ? { kind: "error" as const, text: featError } : { kind: "empty" as const, text: "No features yet." };

  return (
    <div className="stack invest-page">
      {aErr && <div className="banner banner--error">{aErr}</div>}
      
      {/* Top Section Title & Subtitle Card */}
      <section className="plain-card invest-heading-card" style={{ backgroundColor: "#ffffff", padding: "24px 30px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.1rem", fontWeight: "600", color: "#111827" }}>
          Section Title and Subtitle
        </h2>
        <div ref={sectionCard}>
          <div className="two-column" style={{ gap: "24px", alignItems: "start" }}>
            <Field label="Title" value={section?.title ?? ""} placeholder="This Is Where FlexFlow Comes In" />
            <Field label="Subtitle" area value={section?.subtitle ?? ""} placeholder="We replace complexity with intelligent digital solutions that simplify operations..." />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <Button tone="teal" onClick={saveTextSection}>Update</Button>
          </div>
        </div>
      </section>

      {/* Dotted Grid Card: Statistics Left | Main Image Right */}
      <DottedCard style={{ backgroundColor: "#ffffff", padding: "30px" }}>
        <div className="two-column" style={{ gap: "40px", alignItems: "start" }}>
          
          {/* Left Column: Statistics */}
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.1rem", fontWeight: "600" }}>
              Statistics (Percentages)
            </h2>
            <DataTable 
              controls={false} 
              sortable={false} 
              footer={false} 
              columns={[
                { key: "label", label: "Label" }, 
                { key: "value", label: "Value (%)" }, 
                { key: "actions", label: "Actions" }
              ]} 
              rows={statRows} 
              state={statState} 
            />
          </div>

          {/* Right Column: Main Image */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.1rem", fontWeight: "600" }}>
              Main Image
            </h2>
            
            <div style={{ width: "100%", minHeight: "360px", maxHeight: "460px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "20px" }}>
              {img.image ? (
                <img 
                  src={assetUrl(img.image)} 
                  alt="Why invest" 
                  style={{ width: "100%", height: "100%", maxHeight: "440px", objectFit: "contain", borderRadius: "8px" }} 
                />
              ) : (
                <InvestArtwork />
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <FileInput onFile={img.pick} />
              {img.image && <Button tone="ghost" icon="trash" onClick={img.clear}>Remove</Button>}
              <Button tone="teal" onClick={saveImageSection}>Update Image</Button>
            </div>
          </div>

        </div>
      </DottedCard>

      {/* Invest Features Table Card */}
      <DottedCard title="Invest Features" style={{ backgroundColor: "#ffffff", padding: "30px" }}>
        <div className="card-action" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <Button tone="teal" icon="plus" onClick={() => setEditingFeature({ id: -1, icon: "bi-kanban", title: "", description: "" })}>
            Add Feature
          </Button>
        </div>
        <DataTable 
          columns={[
            { key: "icon", label: "Icon" }, 
            { key: "title", label: "Title" }, 
            { key: "description", label: "Description", className: "wide-cell" }, 
            { key: "actions", label: "Actions" }
          ]} 
          rows={featureRows} 
          state={featureState} 
        />
      </DottedCard>

      {/* Modals */}
      {editingStat && (
        <Modal title={editingStat.id > 0 ? "Edit Statistic" : "Add Statistic"} onClose={() => setEditingStat(null)} footer={<><Button tone="teal" onClick={saveStat}>Save Statistic</Button></>}>
          <div className="modal-form" ref={statModal}>
            <Field label="Label" value={editingStat.label} />
            <Field label="Value" value={String(editingStat.value)} placeholder="e.g. 100" />
          </div>
        </Modal>
      )}

      {editingFeature && (
        <Modal title={editingFeature.id > 0 ? "Edit Feature" : "Add Feature"} onClose={() => setEditingFeature(null)} footer={<><Button tone="teal" onClick={saveFeature}>Save Feature</Button></>}>
          <div className="modal-form" ref={featureModal} style={{ overflow: "visible", paddingBottom: "160px" }}>
            <Field label="Title" value={editingFeature.title} />
            <Field label="Description" area value={editingFeature.description ?? ""} />
            <SelectField 
              label="Icon" 
              value={editingFeature.icon ?? "bi-kanban"} 
              options={Object.entries(FEATURE_ICONS).map(([iconKey, labelDesc]) => ({ 
                value: iconKey, 
                label: (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Icon name={iconKey as IconName} size={16} />
                    <span>{labelDesc} ({iconKey})</span>
                  </span>
                ) 
              }))} 
            />
          </div>
        </Modal>
      )}
    </div>
  );
}