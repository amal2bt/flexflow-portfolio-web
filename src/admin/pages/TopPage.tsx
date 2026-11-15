import { useEffect, useRef, useState } from "react";
import { apiForm, assetUrl, useApi } from "../../api";
import { Button } from "../components/Button";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { FileInput } from "../components/FileInput";
import { Icon } from "../components/Icon";
import { collectFields, useAction, useImage } from "../lib/helpers";

function HeroArtwork() {
  return (
    <div className="hero-art" style={{ transform: "scale(1.25)", transformOrigin: "center", margin: "40px 0" }}>
      <div className="halftone" />
      <div className="hero-cloud"><Icon name="cloud" size={35} /></div>
      <div className="hero-shield"><Icon name="shield" size={28} /></div>
      <div className="laptop"><div><span /><span /><span /></div></div>
      <div className="business-person person-one"><i /><b /><span /></div>
      <div className="business-person person-two"><i /><b /><span /></div>
      <div className="hero-gears"><Icon name="gear" size={34} /></div>
    </div>
  );
}

export function TopPage({ notify }: { notify: () => void }) {
  const unwrapTop = (raw: Record<string, unknown>): Record<string, unknown> => {
    const nested = (raw?.data ?? raw?.top) as Record<string, unknown> | undefined;
    return nested ?? raw;
  };
  const { data, reload } = useApi<Record<string, unknown>>("/top-section", {});
  const section = unwrapTop(data);
  const title = (section.title as string) ?? "";
  const subtitle = (section.subtitle as string) ?? "";
  const image = (section.image as string) ?? undefined;
  const [titleText, setTitleText] = useState(title);
  const [subtitleText, setSubtitleText] = useState(subtitle);
  useEffect(() => setTitleText(title), [title]);
  useEffect(() => setSubtitleText(subtitle), [subtitle]);
  const cardRef = useRef<HTMLDivElement>(null);
  const img = useImage(image);
  const { error, run } = useAction(notify);
  const loaded = typeof section.id === "number";

  const save = () => {
    const f = collectFields(cardRef.current);
    const form = new FormData();
    if (loaded) {
      form.set("title", titleText || f.Title || "");
      form.set("subtitle", subtitleText || f.Subtitle || "");
    }
    if (img.fileRef.current) form.set("image", img.fileRef.current);
    if (img.remove) form.set("remove_image", "1");
    run(apiForm("/top-section", form, "POST"), reload);
  };

  return (
    <DottedCard className="form-card" style={{ padding: "50px", maxWidth: "1200px", margin: "0 auto" }}>
      {error && <div className="banner banner--error">{error}</div>}
      <div className="two-column top-grid" style={{ gap: "50px", alignItems: "center" }}>
        <div ref={cardRef} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <Field 
            label="Title" 
            value={titleText} 
            onChange={setTitleText} 
            placeholder="Stop Managing Paper. START Managing Your Business." 
          />
          <Field 
            label="Subtitle" 
            area 
            value={subtitleText} 
            onChange={setSubtitleText} 
            placeholder="Modernize your operations with secure, scalable ERP and automation solutions…" 
          />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 className="media-label" style={{ textAlign: "center", marginBottom: "20px", width: "100%", fontSize: "1.2rem", fontWeight: 600 }}>
            Current Image
          </h3>
          
          <div className="image-preview-container" style={{ width: "100%", minHeight: "340px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {img.image ? (
              <img 
                src={assetUrl(img.image)} 
                alt="Top section" 
                className="preview-img"
                style={{ maxHeight: "360px", width: "100%", objectFit: "contain" }}
              />
            ) : (
              <HeroArtwork />
            )}
          </div>

          <div className="image-actions" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "24px" }}>
            <FileInput onFile={img.pick} />
            {img.image && (
              <Button tone="ghost" icon="trash" onClick={img.clear}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "44px" }}>
        <Button tone="teal" onClick={save}>Save Changes</Button>
      </div>
    </DottedCard>
  );
}