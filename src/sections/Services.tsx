import Icon from "@/components/Icon";
import SectionTitle from "@/components/SectionTitle";
import { useSite } from "@/context/SiteContext";
import { services } from "@/data/siteData";
import { goService } from "@/lib/navigation";
import type { CSSProperties } from "react";
import "@/styles/services.css";

export default function Services() {
  const site = useSite();
  const list = site.services?.length ? site.services : services;
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <SectionTitle subtitle="Empowering businesses through innovative, sustainable digital solutions designed to enhance efficiency, accuracy, and growth.">
          Services We Provide
        </SectionTitle>
        <div className="services-grid">
          {list.map((s, i) => (
            <button
              className={`service-card reveal stagger ${i % 2 ? "from-right" : "from-left"}`}
              key={s.slug}
              onClick={() => goService(s.slug)}
            >
              <span className="service-icon" style={{ "--icon-color": s.color } as CSSProperties}>
                <Icon name={s.icon}/>
              </span>
              <span>
                <b>{s.title}</b>
                <small>{s.short}</small>
              </span>

            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
