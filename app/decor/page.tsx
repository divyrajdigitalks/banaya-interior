import  {DecorHeroSection}  from "@/components/decor/hero-section";
import { FeaturesSection } from "@/components/decor/features-section";
import { ProductsSection } from "@/components/decor/products-section";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
import { DoorTransition } from "@/components/door-transition";
import { CategoryGrid } from "@/components/decor/category-grid";

export default function DecorPage() {
  return (
    <>
      <DoorTransition />
      <DecorHeroSection />
      <CategoryGrid />
      <FeaturesSection />
      <ProductsSection />
      <TrustSection />
      <Footer />
    </>
  );
}
