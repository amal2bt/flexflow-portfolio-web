import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <button type="button" className={`scroll-to-top ${show ? "show" : ""}`} aria-label="Scroll back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>;
}
