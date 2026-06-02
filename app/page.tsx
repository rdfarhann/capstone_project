import Header from "@/components/shared/header";
import HeroSection from "@/components/shared/HeroSection";
import AboutSection from "@/components/shared/AboutSection";
import FeaturesSection from "@/components/shared/FeaturesSection";
import StatsSection from "@/components/shared/StatsSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}