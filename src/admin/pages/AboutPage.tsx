import { useRef } from "react";
import { apiForm, assetUrl, useApi } from "../../api";
import { Brand, DottedCard } from "../components/Shell";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { FileInput } from "../components/FileInput";
import { Icon } from "../components/Icon";
import { collectFields, useAction, useImage } from "../lib/helpers";

function NetworkArtwork({ vision = false }: { vision?: boolean }) {
  return (
    <div className={`network-art ${vision ? "network-art--vision" : ""}`} style={{ width: "100%", height: "100%", minHeight: "360px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="network-lines" />
      <div className="network-orb">
        {vision ? (
          <>
            <strong>Redefining How<br />Businesses Operate.</strong>
            <span>Innovative. Intelligent.<br />Customizable.</span>
            <b>Built for Growth.</b>
          </>
        ) : (
          <Brand large />
        )}
      </div>
      {vision && (
        <div className="vision-points">
          <span><Icon name="chart" />Empower Businesses</span>
          <span><Icon name="gear" />Transform Operations</span>
          <span><Icon name="top" />Enable Sustainable Growth</span>
          <span><Icon name="partners" />Build Lasting Partnerships</span>
        </div>
      )}
    </div>
  );
}

export function AboutPage({ notify }: { notify: () => void }) {
  const { data: about, reload: reloadAbout } = useApi<{ heading?: string; description?: string; catchphrase?: string; paragraph_2?: string; paragraph_3?: string; image?: string }>("/about-section", {});
  const { data: vision, reload: reloadVision } = useApi<{ vision_text?: string; vision_text_2?: string; vision_text_3?: string; image?: string; points?: Array<{ point: string }> }>("/vision-section", {});
  
  const aboutCard = useRef<HTMLDivElement>(null);
  const visionCard = useRef<HTMLDivElement>(null);
  const aboutImg = useImage(about?.image);
  const visionImg = useImage(vision?.image);
  const { error, run } = useAction(notify);

  // Combine paragraph fields into single string separated by newlines for display in textarea
  const fullAboutDescription = [about?.description, about?.paragraph_2, about?.paragraph_3]
    .filter(Boolean)
    .join("\n\n");

  const fullVisionText = [vision?.vision_text, vision?.vision_text_2, vision?.vision_text_3]
    .filter(Boolean)
    .join("\n\n");

  const saveAbout = () => {
    const f = collectFields(aboutCard.current);
    const rawDescription = f.Description ?? "";
    
    const form = new FormData();
    form.set("heading", f.Heading ?? "");
    // Keep the raw multiline text exactly as typed (newlines intact) so the
    // client can render one paragraph per line. The legacy paragraph_2/3
    // columns are cleared so previously stored lines never duplicate.
    form.set("description", rawDescription);
    form.set("paragraph_2", "");
    form.set("paragraph_3", "");
    form.set("catchphrase", f.Catchphrase ?? "");

    if (aboutImg.fileRef.current) form.set("image", aboutImg.fileRef.current);
    if (aboutImg.remove) form.set("remove_image", "1");

    run(apiForm("/about-section", form, "POST"), reloadAbout);
  };

  const saveVision = () => {
    const f = collectFields(visionCard.current);
    const rawVisionText = f["Vision Text"] ?? "";

    const form = new FormData();
    // Keep the raw multiline text exactly as typed (newlines intact) so the
    // client can render one paragraph per line. The legacy vision_text_2/3
    // columns are cleared so previously stored lines never duplicate.
    form.set("vision_text", rawVisionText);
    form.set("vision_text_2", "");
    form.set("vision_text_3", "");
    form.set("points[0]", f["Point 1"] ?? "");
    form.set("points[1]", f["Point 2"] ?? "");
    form.set("points[2]", f["Point 3"] ?? "");

    if (visionImg.fileRef.current) form.set("image", visionImg.fileRef.current);
    if (visionImg.remove) form.set("remove_image", "1");

    run(apiForm("/vision-section", form, "POST"), reloadVision);
  };

  return (
    <div className="stack">
      {error && <div className="banner banner--error">{error}</div>}
      
      {/* About Section */}
      <DottedCard title="About Section" style={{ backgroundColor: "#ffffff", padding: "30px" }}>
        <div className="two-column" style={{ gap: "40px", alignItems: "start" }}>
          <div ref={aboutCard} className="stack" style={{ gap: "16px" }}>
            <Field label="Heading" value={about?.heading ?? ""} placeholder="Who Are We?" />
            <Field 
              label="Description" 
              area 
              value={fullAboutDescription} 
              placeholder={"At FlexFlow, we are dedicated to helping businesses modernize...\nWe combine local insight with international expertise...\nOur mission goes beyond developing software..."}
            />
            <Field label="Catchphrase" value={about?.catchphrase ?? ""} placeholder="Smart Technology. Real Impact." />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <h3 className="media-label" style={{ textAlign: "center", marginBottom: "12px", width: "100%" }}>Image</h3>
            
            <div style={{ width: "100%", minHeight: "380px", maxHeight: "480px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "16px" }}>
              {aboutImg.image ? (
                <img 
                  src={assetUrl(aboutImg.image)} 
                  alt="About section" 
                  style={{ width: "100%", height: "100%", maxHeight: "460px", objectFit: "contain", borderRadius: "8px" }} 
                />
              ) : (
                <NetworkArtwork />
              )}
            </div>

            <div className="image-actions" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <FileInput onFile={aboutImg.pick} />
                {aboutImg.image && <Button tone="ghost" icon="trash" onClick={aboutImg.clear}>Remove</Button>}
              </div>
              <Button tone="teal" onClick={saveAbout}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DottedCard>

      {/* Vision Section */}
      <DottedCard title="Vision Section" style={{ backgroundColor: "#ffffff", padding: "30px" }}>
        <div className="two-column" style={{ gap: "40px", alignItems: "start" }}>
          <div ref={visionCard} className="stack" style={{ gap: "16px" }}>
            <Field 
              label="Vision Text" 
              area 
              value={fullVisionText} 
              placeholder={"At FlexFlow, we envision a future where businesses...\nOur mission is to deliver world-class digital solutions...\nEvery solution we develop is designed to be secure..."}
            />
            <Field label="Point 1" value={vision?.points?.[0]?.point ?? ""} placeholder="Providing Technology That Understands Your Business." />
            <Field label="Point 2" value={vision?.points?.[1]?.point ?? ""} placeholder="Delivering Dedicated Local Support, Every Day." />
            <Field label="Point 3" value={vision?.points?.[2]?.point ?? ""} placeholder="Building Solutions That Evolve As Your Business Grows." />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <h3 className="media-label" style={{ textAlign: "center", marginBottom: "12px", width: "100%" }}>Vision Image</h3>
            
            <div style={{ width: "100%", minHeight: "380px", maxHeight: "480px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "16px" }}>
              {visionImg.image ? (
                <img 
                  src={assetUrl(visionImg.image)} 
                  alt="Vision section" 
                  style={{ width: "100%", height: "100%", maxHeight: "460px", objectFit: "contain", borderRadius: "8px" }} 
                />
              ) : (
                <NetworkArtwork vision />
              )}
            </div>

            <div className="image-actions" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <FileInput onFile={visionImg.pick} />
                {visionImg.image && <Button tone="ghost" icon="trash" onClick={visionImg.clear}>Remove</Button>}
              </div>
              <Button tone="teal" onClick={saveVision}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DottedCard>
    </div>
  );
}