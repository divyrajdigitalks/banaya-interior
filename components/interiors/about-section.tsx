"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { 
      icon: Sparkles, 
      title: "Artisanal Mastery", 
      desc: "Hand-finished by master craftsmen with generations of experience.",
      text: "20+ Bespoke Interiors Delivered" 
    },
    { 
      icon: ShieldCheck, 
      title: "Legacy Quality", 
      desc: "Uncompromising standards with a 25-year structural guarantee.",
      text: "Turnkey Solutions" 
    },
    { 
      icon: Truck, 
      title: "White Glove", 
      desc: "Complimentary premium delivery and professional installation.",
      text: "Franchise Design Experts" 
    },
  ];

  return (
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-warm-cream/30 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          {/* Left: Dynamic Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 pt-12"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
                    alt="Interior Detail"
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                </div>
                <div className="bg-gold p-8 rounded-[2rem] text-white space-y-2 shadow-xl">
                  <span className="text-4xl font-serif font-black">20+</span>
                  <p className="text-xs font-semibold opacity-80">
                    Bespoke Sanctuaries <br />Crafted
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                    alt="Luxury Dining"
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                </div>
                <div className="relative aspect-square rounded-full overflow-hidden border-8 border-background shadow-2xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80"
                    alt="Artisan Detail"
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:rotate-12 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            </div>

            {/* Background text decoration */}
            <div className="absolute -bottom-10 -left-10 text-[10vw] font-serif font-black text-primary/[0.02] pointer-events-none select-none -z-10">
              EST. 2024
            </div>
          </div>

          {/* Right: Content & Features */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-lg uppercase font-serif font-bold block"
              >
                Our philosophy and approach
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-5xl md:text-6xl text-primary font-black leading-tight"
              >
                Design with <span className="italic font-light text-gold">Purpose.</span> <br />
                Executed with Precision.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-primary/50 text-lg font-light leading-relaxed max-w-xl"
              >
                Banaya Interiors transforms spaces into legacies. We don&apos;t just design rooms; we curate experiences that resonate with your heritage and aspirations.
              </motion.p>
            </div>

            {/* Premium Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex gap-8 items-start cursor-default"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-warm-cream flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-gold/20">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-primary mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-primary/40 text-sm leading-relaxed max-w-sm">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-8">
              <button className="group relative px-12 py-6 bg-primary text-white text-xs font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700">
                <span className="relative z-10 flex items-center gap-4 tracking-widest uppercase">
                  Explore Our Legacy <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
