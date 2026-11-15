import { useRef, useState } from "react";
import { apiDelete, apiPost, apiPut, useApi } from "../../api";
import { ActionButtons } from "../components/ActionButtons";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { Icon, type IconName } from "../components/Icon";
import { SelectField } from "../components/SelectField";
import { collectFields, useAction } from "../lib/helpers";
import { ServiceDetail, type ServiceRow } from "./ServiceDetail";

const SERVICE_ICONS: Record<string, string> = {
  // Maintenance
  "bi-tools": "Maintenance / Repair",
  "bi-hammer": "Construction / Fixing",
  "bi-wrench": "Mechanical Service",
  "bi-gear-fill": "General Service",
  "bi-screwdriver": "Tools / Repair",
  // Home & Property
  "bi-house": "Home / Property",
  "bi-house-door": "Real Estate",
  "bi-building": "Apartments / Buildings",
  "bi-door-open": "Entry / Access",
  "bi-thermometer-half": "HVAC / Temperature",
  // Electrical
  "bi-lightning": "Electrical",
  "bi-lightbulb-fill": "Lighting",
  "bi-plug": "Power Plug",
  "bi-battery-charging": "Battery / Power",
  // Plumbing
  "bi-droplet": "Water / Plumbing",
  "bi-pipe": "Pipes",
  "bi-cloud-rain": "Water Systems",
  // Cleaning
  "bi-brush": "Cleaning",
  "bi-bucket": "Bucket / Mopping",
  "bi-recycle": "Waste Removal",
  // Transport / Delivery
  "bi-truck": "Delivery",
  "bi-truck-flatbed": "Transport",
  "bi-bicycle": "Courier",
  "bi-car-front": "Vehicle Service",
  // Shopping / Orders / Business
  "bi-cart": "Shopping / Orders",
  "bi-bag-check": "Order Complete",
  "bi-box-seam": "Package",
  "bi-cash-stack": "Payment",
  // Team / Staff
  "bi-person": "Staff",
  "bi-person-gear": "Technician",
  "bi-people": "Team",
  "bi-person-check": "Verified Worker",
  // Quality / Status
  "bi-check-circle": "Done / Verified",
  "bi-badge-check": "Certified",
  "bi-star-fill": "Rating",
  "bi-shield-check": "Secure",
  // Digital / Tech Services
  "bi-globe": "Internet Services",
  "bi-wifi": "Connectivity",
  "bi-phone": "Support / Hotline",
  "bi-envelope": "Email Service",
  "bi-gear-wide-connected": "Automation",
  // Misc
  "bi-heart": "Loved Service",
  "bi-flag": "Report / Issue",
  "bi-calendar-check": "Scheduled Appointment",
  "bi-clock": "Time-Based Service",
  "bi-map": "Location / Field Service",
};

export function ServicesPage({ notify }: { notify: () => void }) {
  const { data, loading, error, reload } = useApi<ServiceRow[]>("/services", []);
  
  const [pageMode, setPageMode] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#93fbdc");
  const [selectedIcon, setSelectedIcon] = useState<IconName>("bi-gear-fill");
  const [detail, setDetail] = useState<ServiceRow | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);
  const { error: aErr, run } = useAction(notify);

  const handleOpenAdd = () => {
    setEditing({ id: -1, slug: "", title: "", short: "", icon: "bi-gear-fill", color: "#93fbdc" });
    setSelectedColor("#93fbdc");
    setSelectedIcon("bi-gear-fill");
    setPageMode("add");
  };

  const handleOpenEdit = (service: ServiceRow) => {
    setEditing(service);
    setSelectedColor(service.color || "#93fbdc");
    setSelectedIcon((service.icon as IconName) || "bi-gear-fill");
    setPageMode("edit");
  };

  const handleBackToList = () => {
    setEditing(null);
    setPageMode("list");
  };

  const save = () => {
    const f = collectFields(formRef.current);
    const payload = {
      title: f.Title ?? editing?.title ?? "",
      short: f.Description ?? editing?.short ?? "",
      icon: f.Icon ?? selectedIcon,
      color: selectedColor,
    };

    const isEdit = pageMode === "edit" && editing && editing.id > 0;
    const p = isEdit
      ? apiPut(`/services/${editing.id}`, payload)
      : apiPost("/services", payload);

    run(p, reload)
      .then(() => handleBackToList())
      .catch(() => {});
  };

  const remove = (id: number) => { 
    if (id > 0 && window.confirm("Delete this service and its detail cards?")) {
      run(apiDelete(`/services/${id}`), reload);
    }
  };

  if (detail) {
    return (
      <ServiceDetail 
        serviceId={detail.id} 
        service={detail} 
        onClose={() => setDetail(null)} 
        notify={notify} 
      />
    );
  }

  // -------------------------------------------------------------
  // 1. ADD / EDIT FULL-PAGE VIEW
  // -------------------------------------------------------------
  if (pageMode === "add" || pageMode === "edit") {
    const isEdit = pageMode === "edit";

    return (
      <DottedCard className="services-card" style={{ backgroundColor: "#ffffff" }}>
        {aErr && <div className="banner banner--error">{aErr}</div>}

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2>{isEdit ? "Edit Service" : "Add New Service"}</h2>
        </div>

        <div className="modal-form" ref={formRef} style={{ maxWidth: "600px", margin: "0 auto", overflow: "visible" }}>
          <Field label="Title" value={editing?.title ?? ""} />
          <Field label="Description" area value={editing?.short ?? ""} />

          {/* Color Selector Block (Icon preview removed) */}
          <div className="field-group" style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Icon Color
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Native Color Input Trigger */}
              <div
                style={{
                  position: "relative",
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  border: "2px solid #00c4cc",
                  backgroundColor: "#eef2f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "22px",
                    borderRadius: "4px",
                    backgroundColor: selectedColor,
                  }}
                />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Icon Selector with icons intact */}
          <SelectField 
            label="Icon" 
            value={selectedIcon} 
            options={Object.entries(SERVICE_ICONS).map(([iconKey, labelDesc]) => ({ 
              value: iconKey, 
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <Icon name={iconKey as IconName} size={16} />
                  <span>{labelDesc} ({iconKey})</span>
                </span>
              ) 
            }))} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement> | string) => {
              const val = typeof e === "string" ? e : e.target.value;
              setSelectedIcon(val as IconName);
            }}
          />

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center" }}>
            <Button tone={isEdit ? "teal" : "dark"} onClick={save}>
              {isEdit ? "Update" : "Add"}
            </Button>
            <Button tone="light" onClick={handleBackToList}>
              Cancel
            </Button>
          </div>
        </div>
      </DottedCard>
    );
  }

  // -------------------------------------------------------------
  // 2. MAIN LIST PAGE VIEW
  // -------------------------------------------------------------
  const rows = data.map((service) => {
    const iconName = (service.icon as IconName) in SERVICE_ICONS ? (service.icon as IconName) : "bi-gear-fill";
    const customColor = service.color || "#93fbdc";
    return { 
      icon: (
        <span 
          className="service-icon" 
          style={{ 
            color: customColor, 
            backgroundColor: customColor === "#ffffff" ? "rgba(0,0,0,0.05)" : `${customColor}15`, 
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            filter: "none", 
            textShadow: "none", 
            boxShadow: "none" 
          }}
        >
          <Icon name={iconName} size={20} />
        </span>
      ), 
      name: service.title, 
      description: service.short, 
      actions: (
        <ActionButtons 
          details 
          onDetails={() => setDetail(service)} 
          onEdit={() => handleOpenEdit(service)} 
          onDelete={() => remove(service.id)} 
        />
      ) 
    };
  });

  const state = rows.length ? undefined : loading ? { kind: "loading" as const } : error ? { kind: "error" as const, text: error } : { kind: "empty" as const, text: "No services yet." };

  return (
    <DottedCard className="services-card" style={{ backgroundColor: "#ffffff" }}>
      {aErr && <div className="banner banner--error">{aErr}</div>}
      <div className="card-action">
        <Button tone="teal" icon="plus" onClick={handleOpenAdd}>
          Add Service
        </Button>
      </div>
      <DataTable 
        controls={false} 
        sortable={false} 
        footer={false} 
        columns={[
          { key: "icon", label: "Icon", className: "service-icon-col" }, 
          { key: "name", label: "Name" }, 
          { key: "description", label: "Description", className: "wide-cell" }, 
          { key: "actions", label: "Actions" }
        ]} 
        rows={rows} 
        state={state} 
      />
    </DottedCard>
  );
}