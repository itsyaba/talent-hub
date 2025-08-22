import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import JobOffersSection from "@/components/JobOffersSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <JobOffersSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}
