import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import SectionTitle from "@/components/SectionTitle";
import { assetUrl } from "@/api";
import { useSite } from "@/context/SiteContext";
import { IMAGES } from "@/data/siteData";
import "@/styles/about.css";

export default function About() {
  const site = useSite();
  const vision = [
    "At FlexFlow, we envision a future where businesses no longer have to rely on paperwork, repetitive manual processes, disconnected systems, or expensive, inflexible software from overseas. We believe organizations deserve technology that simplifies the way they work by automating everyday tasks, eliminating inefficiencies, and providing complete visibility across their operations, all while being backed by a team that is always within reach and understands their business.",
    "Our mission is to deliver world-class digital solutions with the speed, reliability, and personal support that only a local technology partner can provide. From implementation and staff training to continuous improvements and system upgrades, we work alongside our clients every step of the way, ensuring their technology evolves as their business grows.",
    "Every solution we develop is designed to be secure, scalable, and fully customizable, giving businesses the freedom to adapt their systems to changing needs rather than changing their operations to fit rigid software. By combining local commitment with international standards, we empower organizations to operate with greater transparency, make smarter decisions, reduce operational costs, and build a stronger future through technology.",
  ];

  // Split a stored string into paragraphs at blank lines (two+ line breaks)
  // only. Single line breaks (e.g. textarea auto-wrapping) are collapsed to a
  // space so the text re-wraps naturally to the card width instead of forcing
  // hard breaks that can split words mid-character. Empty chunks are dropped.
  const splitParagraphs = (text?: string | null): string[] =>
    (text ?? "")
      .split(/\n\s*\n/)
      .map((block) => block.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
      .filter(Boolean);

  const aboutFallbacks = [
    "At FlexFlow, we are dedicated to helping businesses modernize the way they operate. We design intelligent digital solutions that replace paperwork, manual processes, and disconnected systems with a secure, connected platform tailored to the unique needs of every organization.",
    "We combine local insight with international expertise to develop practical ERP systems, financial management platforms, HR and biometric solutions, hospitality systems, and custom business software that solve real operational challenges.",
    "Our mission goes beyond developing software. We build the digital foundation that enables businesses to operate more efficiently, make better decisions, and grow with confidence in an increasingly connected world.",
  ];

  const aboutHeading = site.about?.heading ?? "Who Are We?";
  const aboutCatchphrase = (site.about?.catchphrase ?? "Smart Technology. Real Impact.");

  const aboutLines = [
    ...splitParagraphs(site.about?.description),
    ...splitParagraphs(site.about?.paragraph_2),
    ...splitParagraphs(site.about?.paragraph_3),
  ];
  const aboutParagraphs = aboutLines.length ? aboutLines : aboutFallbacks;

  const visionLines = [
    ...splitParagraphs(site.vision?.vision_text),
    ...splitParagraphs(site.vision?.vision_text_2),
    ...splitParagraphs(site.vision?.vision_text_3),
  ];
  const visionParagraphs = visionLines.length ? visionLines : vision;
  const aboutImage = assetUrl(site.about?.image) ?? IMAGES.aboutIcon1;
  const visionImage = assetUrl(site.vision?.image) ?? IMAGES.visionIcon;
  const visionPoints = site.vision?.points?.length ? site.vision.points.map((p) => p.point) : ["Providing Technology That Understands Your Business.", "Delivering Dedicated Local Support, Every Day.", "Building Solutions That Evolve As Your Business Grows."];

  return <section id="about" className="section about-section">
    <div className="container">
      <SectionTitle>About Us</SectionTitle>

      {/* Section 1: Who Are We? */}
      <div className="about-grid reverse-on-mobile">
        <div className="vision-content-box about-box about-card reveal from-left">
          <div className="card-title">
  <span><Icon name="bi-people-fill" size={24}/></span>
  <div>
    <h3>{aboutHeading}</h3>
    <i className="title-bar"/>
  </div>

          </div>

          {aboutParagraphs.map((x, i) => <p className="about-card-text" key={i}>{x}</p>)}

          <div className="card-signoff">
            <span><Icon name="bi-rocket-takeoff" size={24}/></span>
            <div className="signoff-text">
              <b>{aboutCatchphrase}</b>
            </div>
          </div>
        </div>

        <div className="about-image-container reveal from-right">
          <ImageSlot className="about-main-graphic" src={aboutImage} alt="FlexFlow about us graphic" label="aboutus.png Placeholder" />
        </div>
      </div>

      {/* Section 2: Our Vision */}
      <div className="vision-grid reverse-on-mobile">
        <div className="about-image-container reveal from-left">
          <ImageSlot className="about-main-graphic" src={visionImage} alt="Redefining business graphic" label="aboutus2.png Placeholder" />
        </div>

      <div className="vision-content-box vision-box about-box vision-card reveal from-right">

                   <div className="card-title">
  <span><Icon name="bi-eye-fill" size={24}/></span>
  <div>
    <h3>Our Vision
    </h3>
    <i className="title-bar"/>
  </div>
</div>

          {visionParagraphs.map((x, i) => <p className="about-card-text" key={i}>{x}</p>)}

          <div className="check-list">
            {visionPoints.map(x => (
              <div key={x}><Icon name="check" size={20}/><span>{x}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
