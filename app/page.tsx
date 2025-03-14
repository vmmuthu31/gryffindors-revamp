import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import VisionMission from "@/components/VisionMission";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <VisionMission />
      <StatsSection />
      <ServicesSection />
      <TestimonialsSection />
      <TeamSection />
      <Footer />
    </main>
  );
}
