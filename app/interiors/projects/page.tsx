import { FeaturedProjectsSection } from "@/components/interiors/featured-projects";
import { GallerySection } from "@/components/interiors/gallery-section";
import { TrustSection } from "@/components/trust-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ProjectsPage() {
  return (
    <main className="bg-[#faf7f2]">
      <Header />
      
      <section className="pt-40 pb-20 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="max-w-3xl space-y-4">
            <span className="text-gold font-semibold text-[11px] uppercase tracking-[0.25em]">
              Our Full Portfolio
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-primary tracking-tight">
              All Interior <br />
              <span className="text-gold font-bold italic">Masterpieces</span>
            </h1>
            <p className="text-primary/60 max-w-lg text-lg">
              Explore our complete collection of bespoke residential and commercial spaces.
            </p>
          </div>
        </div>
      </section>

      <FeaturedProjectsSection />
      
      <GallerySection />
      <TrustSection />
      <Footer />
    </main>
  );
}
