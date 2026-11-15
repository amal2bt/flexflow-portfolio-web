import PageLoader from "@/components/PageLoader";
import ScrollTop from "@/components/ScrollTop";
import { SiteProvider } from "@/context/SiteProvider";
import { useSite } from "@/context/SiteContext";
import { services } from "@/data/siteData";
import AboutPage from "@/pages/AboutPage";
import ChallengesPage from "@/pages/ChallengesPage";
import ContactPage from "@/pages/ContactPage";
import Home from "@/pages/Home";
import ServicePage from "@/pages/ServicePage";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SiteRoutes() {
  const site = useSite();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 500);

    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("visible");
        observer.unobserve(el);
        window.setTimeout(() => el.classList.add("revealed"), 2200);
      }
    }), { threshold: .2 });

    const observe = () => document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mo.disconnect();
    };
  }, [location.pathname]);

  const allServices = site.services?.length ? site.services : services;

  const slug = location.pathname.split("/services/")[1];
  const service = allServices.find(s => s.slug === slug);

  const renderContent = () => {
    if (service) return <ServicePage service={service}/>;
    if (location.pathname === "/about") return <AboutPage/>;
    if (location.pathname === "/challenges") return <ChallengesPage/>;
    if (location.pathname === "/contact") return <ContactPage/>;
    return <Home/>;
  };

  return <>
    <PageLoader loading={loading} />
    {renderContent()}
    <ScrollTop/>
  </>;
}

export default function Portfolio() {
  return <SiteProvider>
    <SiteRoutes/>
  </SiteProvider>;
}
