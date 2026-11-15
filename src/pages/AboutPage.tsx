import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import About from "@/sections/About";
import Partners from "@/sections/Partners";
import Process from "@/sections/Process";

export default function AboutPage() {
  return <main className="home-page">
    <Navbar forceActive="about"/>
    <About/>
    <Process/>
    <Partners/>
    <Footer/>
  </main>;
}
