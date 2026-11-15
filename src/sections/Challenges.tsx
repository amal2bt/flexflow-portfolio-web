import Icon from "@/components/Icon";
import SectionTitle from "@/components/SectionTitle";
import { useSite } from "@/context/SiteContext";
import { challenges } from "@/data/siteData";
import { navigateTo } from "@/lib/navigation";
import "@/styles/challenges.css";
import { useState } from "react";

export default function Challenges() {
  const site = useSite();
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen(v => v.includes(i) ? v.filter(n => n !== i) : [...v, i]);
  const list: Array<[string, string]> = site.challenges?.length
    ? site.challenges.map((c) => [c.title, c.description ?? ""] as [string, string])
    : challenges.map(([t, c]) => [t, c] as [string, string]);
  return <section id="challenges" className="section challenges-section">
    <div className="container">
      <SectionTitle subtitle="Common Operational Challenges We Solve">Business Challenges</SectionTitle>
      <div className="challenge-layout">
        <div className="challenge-grid">
          {list.map(([title, copy], i) => {
            const isOpen = open.includes(i);
            return <div className="challenge-slot reveal stagger" key={title}>
              <div className={`challenge-styled-box challenge ${isOpen ? "expanded" : "collapsed"}`}>
                <button type="button" className="challenge-toggle" aria-expanded={isOpen} aria-controls={`challenge-panel-${i}`} onClick={() => toggle(i)}>
                  <span>{title}</span>
                  <i aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></i>
                </button>
                <div id={`challenge-panel-${i}`} className="challenge-copy" role="region" aria-hidden={!isOpen}><div><p>{copy}</p></div></div>
              </div>
            </div>;
          })}
        </div>
        <aside className="challenge-aside reveal from-right">
          <div className="aside-icon"><Icon name="chat" size={32}/></div>
          <h3>Facing These<br/>Challenges?</h3>
          <p>FlexFlow helps businesses eliminate inefficiencies with digital, automated, and scalable smart systems. Talk to us to find the right solution for your workflow.</p>
       <button className="ctm" onClick={() => navigateTo("/contact")}>Contact Us</button>
        </aside>
      </div>
    </div>
  </section>;
}
