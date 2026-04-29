import { HeroSection } from "@/components/interiors/hero-section";
import { AboutSection } from "@/components/interiors/about-section";
import { ServicesSection } from "@/components/interiors/services-section";
import { ProjectsSection } from "@/components/interiors/projects-section";
import { GallerySection } from "@/components/interiors/gallery-section";
import { CategoriesSection } from "@/components/interiors/categories-section";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
import { CalculatorSection } from "@/components/calculator-section";
import { DoorTransition } from "@/components/door-transition";

export default function InteriorsPage() {
  return (
    <>
      <DoorTransition />
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <ServicesSection />
      <div className="hidden">
        <CalculatorSection />
      </div>
      <ProjectsSection />
      <GallerySection />
      <TrustSection />
      <Footer />
    </>
  );
}
