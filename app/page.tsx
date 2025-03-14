import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import VisionMission from "@/components/VisionMission";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <VisionMission />
      <StatsSection />
      <Footer />
    </main>
  );
}
