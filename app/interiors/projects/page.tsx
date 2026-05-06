"use client";

import { FeaturedProjectsSection } from "@/components/interiors/featured-projects";
import { ProjectsSection } from "@/components/interiors/projects-section";
import { GallerySection } from "@/components/interiors/gallery-section";
import { TrustSection } from "@/components/trust-section";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function InteriorsProjectsPage() {
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
              <span className="text-gold font-bold text-xs tracking-[0.3em] uppercase">Portfolio</span>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-primary leading-tight tracking-tighter">
                Masterpieces <br /> In <span className="text-gold">Design.</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary/60 text-xl font-light leading-relaxed"
            >
              Explore our curated collection of luxury residential and commercial projects. Each project is a testament to our commitment to architectural excellence and design precision.
            </motion.p>
          </div>
        </div>
      </section>

      <FeaturedProjectsSection />
      
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-black text-primary tracking-tight">
                Every project is a <br /> <span className="text-gold">Legacy</span> in the making.
              </h2>
              <p className="text-primary/50 text-lg font-light leading-relaxed">
                From minimalist urban apartments to sprawling heritage villas, we bring the same level of meticulous detail and artistic vision to every project we undertake.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-8 bg-warm-cream/30 rounded-[2rem] border border-primary/5 min-w-[160px]">
                <p className="text-4xl font-serif font-black text-primary">50+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold mt-2">Projects Done</p>
              </div>
              <div className="text-center p-8 bg-warm-cream/30 rounded-[2rem] border border-primary/5 min-w-[160px]">
                <p className="text-4xl font-serif font-black text-primary">12+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold mt-2">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectsSection />
      <GallerySection />
      <TrustSection />
      <Footer />
    </div>
  );
}
