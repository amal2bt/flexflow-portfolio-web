import ImageSlot from "@/components/ImageSlot";
import SectionTitle from "@/components/SectionTitle";
import { assetUrl } from "@/api";
import { useSite } from "@/context/SiteContext";
import { IMAGES, processSteps } from "@/data/siteData";
import { navigateTo } from "@/lib/navigation";
import "@/styles/process.css";

export default function Process() {
  const site = useSite();
  const steps: Array<[string, string]> = site.process?.steps?.length
    ? site.process.steps.map((s) => [s.title, s.description ?? ""] as [string, string])
    : processSteps.map(([t, c]) => [t, c] as [string, string]);
  const defaultProcTitle = "Our Proven Development Process";
  const procTitle = site.process?.section?.title ?? defaultProcTitle;
  const procLead = site.process?.section?.text1 ?? "Every FlexFlow project follows a structured, collaborative process built on transparency, innovation, and precision.";
  const procCopy = site.process?.section?.text2 ?? "From early planning to long-term maintenance, we combine design thinking, AI-driven insights, and agile development to ensure every solution we build is efficient, scalable, and sustainable.";
  const procImage = assetUrl(site.process?.section?.image) ?? IMAGES.processDiagram;

  return <section className="section process-section">
    <div className="container">
      <SectionTitle subtitle="How We Deliver Excellence">Our Process</SectionTitle>
      <div className="process-grid">
        <div className="process-intro reveal">
          {procTitle === defaultProcTitle ? <h3>Our Proven<br/>Development Process</h3> : <h3>{procTitle}</h3>}
          <b>{procLead}</b>
          <p>{procCopy}</p>

          {/* UPDATED BUTTON ROW */}
         <div className="button-row">
            <button className="ctm" onClick={() => navigateTo("/contact")}>
              Start Your Project
            </button>
            <button className="ctm outline" onClick={() => navigateTo("/about")}>
              Learn More
            </button>
          </div>
          <div className="process-diagram-wrapper">
            <ImageSlot className="process-diagram-img" src={procImage} alt="FlexFlow development process graphic" label="process.png Placeholder" />
          </div>
        </div>

        {/* Timeline Steps (01 to 06) */}
        <div className="timeline reveal">
          {steps.map(([title, copy], i) => (
            <div className="timeline-step stagger" key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>;
}
