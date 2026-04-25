import  {DecorHeroSection}  from "@/components/decor/hero-section";
import { FeaturesSection } from "@/components/decor/features-section";
import { ProductsSection } from "@/components/decor/products-section";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
import { CalculatorSection } from "@/components/calculator-section";

export default function DecorPage() {
  return (
    <>
      <DecorHeroSection />
      <FeaturesSection />
      <CalculatorSection />
      <ProductsSection />
      <TrustSection />
      <Footer />
    </>
  );
}
