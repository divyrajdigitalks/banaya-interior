import { HeroSection } from "@/components/interiors/hero-section";
import { AboutSection } from "@/components/interiors/about-section";
import { WhyChooseSection } from "@/components/interiors/why-choose";
import { FeaturedProjectsSection } from "@/components/interiors/featured-projects";
import { CostGuideSection } from "@/components/interiors/cost-guide";
import { DesignProcessSection } from "@/components/interiors/design-process";
import { ServicesSection } from "@/components/interiors/services-section";
import { ProjectsSection } from "@/components/interiors/projects-section";
import { GallerySection } from "@/components/interiors/gallery-section";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
// import { CalculatorSection } from "@/components/calculator-section";
import { DoorTransition } from "@/components/door-transition";

export default function InteriorsPage() {
  return (
    <main className="scroll-smooth">
      <DoorTransition />
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <WhyChooseSection />
      <section id="projects">
        <FeaturedProjectsSection />
      </section>
      <section id="cost-calculator">
        <CostGuideSection />
      </section>
      <section id="process">
        <DesignProcessSection />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      {/* <div className="hidden">
        <CalculatorSection />
      </div> */}
      <ProjectsSection />
      <GallerySection />
      <TrustSection />
      <Footer />
    </main>
  );
}
