import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Contact from "@/sections/Contact";

export default function ContactPage() {
  return <main className="home-page">
    <Navbar forceActive="contact"/>
    <Contact withMap/>
    <Footer/>
  </main>;
}
