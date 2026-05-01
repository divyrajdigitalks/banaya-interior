import { HeroSection } from "@/components/interiors/hero-section";
import { AboutSection } from "@/components/interiors/about-section";
import { WhyChooseSection } from "@/components/interiors/why-choose";
import { FeaturedProjectsSection } from "@/components/interiors/featured-projects";
import { CostGuideSection } from "@/components/interiors/cost-guide";
import { DesignProcessSection } from "@/components/interiors/design-process";
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
      <WhyChooseSection />
      <CategoriesSection />
      <FeaturedProjectsSection />
      <CostGuideSection />
      <DesignProcessSection />
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
