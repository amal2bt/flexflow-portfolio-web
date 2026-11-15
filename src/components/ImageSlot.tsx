import { useEffect, useState } from "react";

export default function ImageSlot({ src, alt, label, className = "" }: { src?: string; alt: string; label?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  if (src && !failed) {
    return <img className={`slot-img ${className}`} src={src} alt={alt} onError={() => setFailed(true)} />;
  }
  return <div className={`slot-placeholder ${className}`} role="img" aria-label={alt}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/></svg>
    {label && <small>{label}</small>}
  </div>;
}
