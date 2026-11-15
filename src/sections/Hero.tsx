import Button from "@/components/Button";
import ImageSlot from "@/components/ImageSlot";
import { assetUrl } from "@/api";
import { useSite } from "@/context/SiteContext";
import { IMAGES } from "@/data/siteData";
import { goHome } from "@/lib/navigation";
import "@/styles/hero.css";

export default function Hero() {
  const site = useSite();
  const defaultTitle = "Stop Managing Paper. START Managing Your Business.";
  const heroTitle = site.top?.title ?? defaultTitle;
  const heroSubtitle = site.top?.subtitle ?? "Modernize your operations with secure, scalable ERP and automation solutions that save time, reduce costs, and give you complete visibility across your organization.";
  const heroImage = assetUrl(site.top?.image) ?? IMAGES.hero;
  return <section id="home" className="hero">
    <div className="orbit orbit-1"/><div className="orbit orbit-2"/><div className="hero-shape"/>
    <div className="hero-inner">
      <div className="hero-copy reveal">
        {heroTitle === defaultTitle ? (
          <h1>Stop Managing Paper.<br className="desktop-break"/> START Managing Your<br className="desktop-break"/> Business.</h1>
        ) : (
          <h1>{heroTitle}</h1>
        )}
        <p>{heroSubtitle}</p>
        <Button onClick={() => goHome("services")}>View Our Work</Button>
      </div>
      <div className="hero-art reveal from-right">
        <div className="hero-slot hero-main"><ImageSlot src={heroImage} alt="FlexFlow team with laptop dashboard" label="Hero image" /></div>
      </div>
    </div>
  </section>;
}
