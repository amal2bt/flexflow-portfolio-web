import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Challenges from "@/sections/Challenges";
import Solution from "@/sections/Solution";

export default function ChallengesPage() {
  return <main className="home-page">
    <Navbar forceActive="challenges"/>
    <Challenges/>
    <Solution/>
    <Footer/>
  </main>;
}
