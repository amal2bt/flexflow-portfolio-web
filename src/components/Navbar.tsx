import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { goHome, navigateTo } from "@/lib/navigation";
import "@/styles/navbar.css";

export default function Navbar({ forceActive }: { forceActive?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(forceActive || "home");
  const links: Array<[string, string, string]> = [
    ["Home", "/", "home"],
    ["About", "/about", "about"],
    ["Challenges & Solutions", "/challenges", "challenges"],
    ["Services", "#services", "services"],
    ["Contact", "/contact", "contact"]
  ];

  useEffect(() => {
    if (forceActive) { setActive(forceActive); return; }
    if (location.pathname === "/about") setActive("about");
    else if (location.pathname === "/challenges") setActive("challenges");
    else if (location.pathname === "/contact") setActive("contact");
    else setActive("home");
  }, [forceActive]);

  return <header className="navbar">
    <div className="nav-inner">
      <Logo/>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu"><span/><span/><span/></button>
      <nav className={open ? "open" : ""}>
        {links.map(([label, href, key]) => {
          const isHash = href.startsWith("#");
          return (
            <button
              className={active === key ? "active" : ""}
              key={label}
              onClick={() => {
                setOpen(false);
                if (isHash) goHome(href.substring(1));
                else navigateTo(href);
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  </header>;
}
