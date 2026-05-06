"use client";

import { AboutSection } from "@/components/interiors/about-section";
import { WhyChooseSection } from "@/components/interiors/why-choose";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function InteriorsAboutPage() {
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
              <span className="text-gold font-bold text-xs tracking-[0.3em] uppercase">Our Legacy</span>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-primary leading-tight tracking-tighter">
                Crafting <span className="text-gold">Stories</span> <br /> Through Spaces.
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary/60 text-xl font-light leading-relaxed"
            >
              Banaya Interiors is a premier design studio dedicated to creating environments that resonate with heritage, elegance, and modern sophistication. We believe every space has a story to tell.
            </motion.p>
          </div>
        </div>
      </section>
      
      <div className="py-20">
        <AboutSection />
      </div>

      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-serif font-black leading-tight">
                Our Mission & <br /> <span className="text-gold">Philosophy</span>
              </h2>
              <p className="text-white/70 text-lg font-light leading-relaxed">
                To redefine luxury living by blending traditional craftsmanship with contemporary innovation. We strive to deliver turnkey solutions that exceed expectations and stand the test of time.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-black text-gold">100%</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Client Satisfaction</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-black text-gold">25Y</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Quality Guarantee</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80" 
                alt="Banaya Philosophy" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <WhyChooseSection />
      <TrustSection />
      <Footer />
    </div>
  );
}
