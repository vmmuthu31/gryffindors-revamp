import HeroSection from "@/components/HeroSection";
import VisionMission from "@/components/VisionMission";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <VisionMission />
      <StatsSection />
      <ServicesSection />
      <TeamSection />
      <TestimonialsSection />
    </main>
  );
}
