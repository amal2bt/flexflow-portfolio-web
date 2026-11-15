import Icon from "@/components/Icon";
import { iconKey, useSite, type ContactRow } from "@/context/SiteContext";
import { CONTACT_FIELDS, services, SOCIAL_LINKS } from "@/data/siteData";
import { goHome, goService, navigateTo } from "@/lib/navigation";
import "@/styles/footer.css";

/** A stored value is treated as a social/custom link when it is a full URL. */
const isExternalLink = (value?: string | null) => /^https?:\/\//i.test(value ?? "");

/** Static seed shown only when the admin has not configured any contact rows. */
const FALLBACK_CONTACTS: ContactRow[] = (() => {
  const rows: ContactRow[] = CONTACT_FIELDS.map((field) => ({ icon: field.icon, label: field.label, value: field.value }));
  const seen = new Set(rows.map((row) => iconKey(row.icon).replace(/^bi-/, "")));
  SOCIAL_LINKS.forEach((link) => {
    if (!seen.has(link.icon)) rows.push({ icon: link.icon, label: link.name, value: link.fallback });
    seen.add(link.icon);
  });
  return rows;
})();

export default function Footer() {
  const site = useSite();
  const list = site.services?.length ? site.services : services;
  const contacts: ContactRow[] = site.contact?.length ? site.contact : FALLBACK_CONTACTS;

  const info = contacts.filter((c) => !isExternalLink(c.value));
  const socials = contacts.filter((c) => isExternalLink(c.value));

  return <footer><div className="footer-inner">
    <div className="footer-brand">
      <h3>FlexFlow</h3>
      {info.map((c, i) => (
        <p key={`${c.label}-${i}`}>
          <Icon name={iconKey(c.icon)} size={14}/> <b>{c.label}:</b> {c.value}
        </p>
      ))}
      {socials.length > 0 && (
        <div className="socials">
          {socials.map((c, i) => (
            <button type="button" key={`${c.label}-${i}`} aria-label={c.label} title={c.label} onClick={() => c.value && window.open(c.value, "_blank", "noopener,noreferrer")}>
              <Icon name={iconKey(c.icon)} size={16}/>
            </button>
          ))}
        </div>
      )}
    </div>
    <div><h4>Useful Links</h4>{[["Home","/"],["About Us","/about"],["Challenges & Solutions","/challenges"],["Services","#services"],["Contact","/contact"]].map(x => <button className="footer-link" key={x[0]} onClick={() => { if(x[1].startsWith("#")) goHome(x[1].substring(1)); else navigateTo(x[1]); }}>{x[0]}</button>)}</div>
    <div><h4>Our Services</h4>{list.map(s => <button className="footer-link" key={s.slug} onClick={() => goService(s.slug)}>{s.title}</button>)}</div>
  </div><div className="copyright">© 2025 FlexFlow. Flexible workflow solutions, built in Sierra Leone.</div></footer>;
}
