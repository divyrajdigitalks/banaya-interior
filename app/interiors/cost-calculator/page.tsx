"use client";

import { CostGuideSection } from "@/components/interiors/cost-guide";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { ServicesSection } from "@/components/interiors/services-section";

export default function InteriorsCalculatorPage() {
  return (
    <div className="pt-10">
      <section className="bg-[#fdf9f3] py-24 border-b border-primary/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-gold font-bold text-xs tracking-[0.3em] uppercase">Estimator</span>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-primary leading-tight tracking-tighter">
                Plan Your <br /> <span className="text-gold">Investment.</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary/60 text-xl font-light leading-relaxed"
            >
              Get a precise cost estimate for your interior journey. Our transparent pricing model helps you make informed decisions for your dream sanctuary.
            </motion.p>
          </div>
        </div>
      </section>

      <CostGuideSection />
      
      <section id="services">
        <ServicesSection />
      </section>

      <section className="py-24 bg-warm-cream/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">01</div>
              <h3 className="text-xl font-bold text-primary">Select Scope</h3>
              <p className="text-primary/50 text-sm leading-relaxed">Choose the areas you want to design, from individual rooms to full-home solutions.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">02</div>
              <h3 className="text-xl font-bold text-primary">Quality Level</h3>
              <p className="text-primary/50 text-sm leading-relaxed">Select from our curated material packages, from essential luxury to premium heritage finishes.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">03</div>
              <h3 className="text-xl font-bold text-primary">Instant Quote</h3>
              <p className="text-primary/50 text-sm leading-relaxed">Receive a detailed cost breakdown instantly, tailored to your specific requirements and area.</p>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />
      <Footer />
    </div>
  );
}
