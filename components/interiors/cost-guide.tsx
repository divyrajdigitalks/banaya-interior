"use client";

import { motion } from "framer-motion";
import {
  Sofa,
  Layout,
  Bed,
  Baby,
  Home,
  Building2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const COSTS = [
  { icon: Layout, title: "Modular Kitchen", range: "₹2.5L - ₹5L" },
  { icon: Sofa, title: "Living Room", range: "₹1.5L - ₹3.5L" },
  { icon: Bed, title: "Master Bedroom", range: "₹1.5L - ₹3L" },
  { icon: Baby, title: "Children's Bedroom", range: "₹1L - ₹2.5L" },
  { icon: Home, title: "Full Home (2 BHK)", range: "₹8L - ₹15L" },
  { icon: Building2, title: "Full Home (3 BHK)", range: "₹12L - ₹20L+" },
];

export function CostGuideSection() {
  return (
    <section className="py-24 bg-[#faf7f2] relative overflow-hidden">
      
      {/* Background Accent */}

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-gold font-semibold text-[11px] uppercase tracking-[0.25em]">
            Pricing Guide
          </span>

          <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary tracking-tight">
            Investment for Your{" "}
            <span className="italic text-gold font-semibold">
              Dream Space
            </span>
          </h2>

          <p className="text-sm text-primary/70 font-normal max-w-lg leading-relaxed">
            Transparent pricing models tailored to your lifestyle. These estimates
            help you plan your interior journey with clarity.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-10 items-stretch">
          
          {/* Cost Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COSTS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex flex-col p-6 rounded-2xl bg-white border border-primary/10 hover:border-gold/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#faf7f2] flex items-center justify-center text-primary/60 group-hover:text-gold transition mb-6">
                  <item.icon size={22} strokeWidth={1.8} />
                </div>

                <div className="space-y-1 mt-auto">
                  <h4 className="text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
                    {item.title}
                  </h4>

                  <p className="text-xl font-semibold text-primary group-hover:text-gold transition">
                    {item.range}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Banner */}
          <div className="w-full xl:w-[380px] relative rounded-[2.5rem] overflow-hidden shadow-xl group">
            
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
              alt="Dream Home"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
            />

            <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px] flex flex-col justify-center p-10 text-white">
              <div className="space-y-5">
                
                <h3 className="text-3xl font-serif font-medium leading-tight">
                  Start Your <br />
                  <span className="italic text-gold text-4xl font-semibold">
                    Journey
                  </span>
                </h3>

                <p className="text-sm text-white/80 font-normal leading-relaxed">
                  Every home tells a story. Let us help you design yours with
                  elegance and precision.
                </p>

                <button className="group flex items-center justify-between w-full px-6 py-4 bg-gold text-primary text-[11px] font-semibold tracking-wide uppercase rounded-xl hover:bg-white transition shadow-md">
                  Get Personalised Quote
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-primary/30" />
          <p className="text-[11px] text-primary/50 font-normal uppercase tracking-wide">
            *Indicative ranges. Final cost depends on materials, finishes & site conditions.
          </p>
        </div>

      </div>
    </section>
  );
}