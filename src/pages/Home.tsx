import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import About from "@/sections/About";
import Challenges from "@/sections/Challenges";
import Contact from "@/sections/Contact";
import Hero from "@/sections/Hero";
import Partners from "@/sections/Partners";
import Process from "@/sections/Process";
import Services from "@/sections/Services";
import Solution from "@/sections/Solution";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  }, []);
  return <main className="home-page">
    <Navbar/>
    <Hero/>
    <About/><Challenges/><Solution/><Services/><Process/><Partners/><Contact/><Footer/>
  </main>;
}
