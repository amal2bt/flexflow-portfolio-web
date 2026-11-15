import Button from "@/components/Button";
import Icon from "@/components/Icon";
import SectionTitle from "@/components/SectionTitle";
import { apiPost } from "@/api";
import { iconKey, useSite } from "@/context/SiteContext";
import { CONTACT_FIELDS } from "@/data/siteData";
import type { FormEvent } from "react";
import "@/styles/contact.css";

export default function Contact({ withMap = false }: { withMap?: boolean }) {
  const site = useSite();
  const contacts = site.contact ?? [];
  const items: Array<[string, string, string]> = CONTACT_FIELDS.map((field) => {
    const match = contacts.find((c) => field.icons.includes(iconKey(c.icon)));
    return [match?.icon ?? field.icon, match?.label || field.label, match?.value || field.value] as [string, string, string];
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (name: string) => (f.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement)?.value ?? "";
    
    apiPost("/contact", { name: val("name"), email: val("email"), subject: val("subject"), body: val("message") })
      .then(() => {
        alert("Thank you. Your message has been sent.");
        f.reset(); // Clears all input fields after successful submission
      })
      .catch(() => alert("Thank you. Your message is ready to send."));
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionTitle subtitle="Get in touch with our team for project inquiries, consultations, or support.">Contact</SectionTitle>
        <div className="contact-grid">
          {/* Info cards with right border accent */}
          <div className="contact-info">
            {items.map(([icon, title, copy]) => (
              <div className="contact-item reveal stagger from-left" key={title}>
                <span><Icon name={icon}/></span>
                <div>
                  <b>{title}</b>
                  <small>{copy}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Form with left border accent and stable inputs */}
          <form className="contact-form reveal from-right" onSubmit={submit}>
            <div className="form-row">
              <input aria-label="Your Name" name="name" placeholder="Your Name" required />
              <input type="email" aria-label="Your Email" name="email" placeholder="Your Email" required />
            </div>
            <input aria-label="Subject" name="subject" placeholder="Subject" required />
            <textarea aria-label="Message" name="message" placeholder="Message" required />
            <Button arrow={false}>Send Message</Button>
          </form>
        </div>

        {withMap && (
          <div className="contact-map" style={{ marginTop: "32px" }}>
            <iframe
              title="FlexFlow location — Freetown, Sierra Leone"
              src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s8.490966,-13.282680!6i17"
              width="100%"
              height="360"
              style={{ border: 0, borderRadius: "10px", display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  );
}