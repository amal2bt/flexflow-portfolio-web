import CountUp from "@/components/CountUp";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import SectionTitle from "@/components/SectionTitle";
import { assetUrl } from "@/api";
import { useSite } from "@/context/SiteContext";
import { IMAGES, METRICS, SHOW_METRIC_LABELS } from "@/data/siteData";
import type { CSSProperties } from "react";
import "@/styles/solution.css";

export default function Solution() {
  const site = useSite();
  const benefits: Array<[string, string]> = [
    ["Reduced Operational Costs", "Automation eliminates paper waste, reduces labor hours, and minimizes costly errors across your daily operations."],
    ["High-ROI Efficiency Gains", "Businesses see instant productivity improvements through faster workflows, organized data, and automated reporting."],
    ["Scalable Cloud Solutions", "Lightweight, cloud-based tools allow rapid expansion without infrastructure costs, designed to grow with your business."],
    ["Improved Accuracy & Security", "Real-time tracking, secure digital records, and automated checks reduce fraud, errors, and data loss risks."],
    ["Sustainable, Eco-Friendly Impact", "Smart systems support a green business model by replacing paper-heavy workflows with digital efficiency."],
  ];

  const benefitIcons = ["bi-cash-stack", "bi-bar-chart-line", "bi-cloud-upload", "bi-shield-lock", "bi-recycle"];

  const benefitItems = site.invest?.features?.length
    ? site.invest.features.map((f, i) => ({ icon: f.icon || benefitIcons[i] || "bi-check", title: f.title, copy: f.description ?? "" }))
    : benefits.map(([title, copy], i) => ({ icon: benefitIcons[i] || "bi-check", title, copy }));

  const stats = site.invest?.stats?.length ? site.invest.stats : METRICS;

  const investTitle = site.invest?.section?.title || "This Is Where FlexFlow Comes In";
  const investSubtitle = site.invest?.section?.subtitle || "We replace complexity with intelligent digital solutions that simplify operations, improve visibility, and help your business grow with confidence.";
  const investImage = assetUrl(site.invest?.section?.image) ?? IMAGES.flexflowComesIn;

  return <section className="section solution-section">
    <div className="container">
      <SectionTitle subtitle={investSubtitle}>{investTitle}</SectionTitle>
      <div className="solution-grid">
        <div className="solution-art reveal">
          <div className="stats-card">
            {stats.map((m, i) => <div className="stat" key={m.label} style={{ "--i": i } as CSSProperties}>
              <b><CountUp value={m.value}/></b>
              {SHOW_METRIC_LABELS && <small>{m.label}</small>}
            </div>)}
          </div>
          <div className="team-placeholder"><ImageSlot className="flexflow-image" src={investImage} alt="FlexFlow team working at a laptop" label="Team image" /></div>
          <div className="smart-badge"><b>Smart</b><small>Digital Upgrade</small></div>
        </div>

        <div className="benefit-list">
          {benefitItems.map((item) => (
            <div className="benefit reveal stagger from-right" key={item.title}>
              <span className="benefit-icon">
                <Icon name={item.icon} size={20}/>
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>;
}
