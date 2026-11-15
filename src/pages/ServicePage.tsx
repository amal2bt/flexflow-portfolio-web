import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import Navbar from "@/components/Navbar";
import { useSite } from "@/context/SiteContext";
import { services, type Service } from "@/data/siteData";
import { goHome, goService } from "@/lib/navigation";
import { useEffect, useState } from "react";

export default function ServicePage({ service }: { service: Service }) {
  const site = useSite();
  const list = site.services?.length ? site.services : services;
  const [selected, setSelected] = useState(service.slug);
  useEffect(() => { setSelected(service.slug); }, [service.slug]);
  return <main className="service-page">
    <Navbar forceActive="services"/>
    <div className="service-titlebar"><div className="container"><h1>{service.title}</h1><p><button onClick={() => goHome()}>Home</button><span>/</span><b>{service.title}</b></p></div></div>
    <div className="service-layout container">
      <aside className="service-sidebar reveal from-left">
        <label htmlFor="service-select">Explore our services</label>
        <select id="service-select" value={selected} onChange={e => { setSelected(e.target.value); goService(e.target.value); }}>{list.map(s => <option value={s.slug} key={s.slug}>{s.title}</option>)}</select>
        <div className="sidebar-menu">{list.map(s => <button className={s.slug === service.slug ? "active" : ""} onClick={() => goService(s.slug)} key={s.slug}>{s.title}</button>)}</div>
        <div className="sidebar-copy"><span></span><h2>{service.sideTitle}</h2><p>{service.sideCopy}</p></div>
      </aside>
      <article className="service-content"><span className="eyebrow"></span><h2>{service.heading}</h2><p className="service-intro">{service.intro}</p>
        <div className="feature-list">
          {service.cards.map((card, i) => (
            <div className="feature-card reveal stagger" key={card.title}>
              <div className="feature-image-container" style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {card.images && card.images.length > 0 ? (
                  card.images.map((imgSrc, imgIdx) => (
                    <div key={imgIdx} className={`feature-image image-${(i % 4) + 1}`}>
                      <img
                        src={imgSrc}
                        alt={`${card.title} screenshot ${imgIdx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
                      />
                    </div>
                  ))
                ) : (
                  <div className={`feature-image image-${(i % 4) + 1}`}>
                    <Icon name={service.icon} size={32}/>
                    <small>IMAGE<br/>PLACEHOLDER</small>
                  </div>
                )}
              </div>
              <div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="service-closing reveal closing-reveal">{service.closing}</p>
      </article>
    </div>
    <Footer/>
  </main>;
}
