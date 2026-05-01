"use client";

import { motion } from "framer-motion";
import { Sofa, Layout, Bed, Baby, Home, Building2, ArrowRight } from "lucide-react";
import Image from "next/image";

const COSTS = [
  {
    icon: Layout,
    title: "Modular Kitchen",
    range: "₹2.5L - ₹5L",
  },
  {
    icon: Sofa,
    title: "Living Room",
    range: "₹1.5L - ₹3.5L",
  },
  {
    icon: Bed,
    title: "Master Bedroom",
    range: "₹1.5L - ₹3L",
  },
  {
    icon: Baby,
    title: "Children's Bedroom",
    range: "₹1L - ₹2.5L",
  },
  {
    icon: Home,
    title: "Full Home (2 BHK)",
    range: "₹8L - ₹15L",
  },
  {
    icon: Building2,
    title: "Full Home (3 BHK)",
    range: "₹12L - ₹20L+",
  },
];

export function CostGuideSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-black text-primary uppercase tracking-wider mb-2">
            Interior Cost Guide
          </h2>
          <p className="text-xs text-primary/40 font-medium">Estimated range for different spaces</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {COSTS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#f8f5f0] border border-primary/5 hover:border-gold transition-all group"
              >
                <item.icon size={28} className="text-primary/20 group-hover:text-gold transition-colors mb-4" />
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{item.title}</h4>
                <p className="text-xs font-black text-gold">{item.range}</p>
              </motion.div>
            ))}
          </div>

          <div className="w-full lg:w-[350px] relative rounded-[2rem] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
              alt="Dream Home"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] flex flex-col justify-center p-10 text-white">
              <h3 className="text-2xl font-serif font-black leading-tight mb-4">
                Dream Home <br />in Your Budget
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed mb-8">
                Let us help you build a space you'll love coming home to.
              </p>
              <button className="flex items-center justify-between w-full px-6 py-4 bg-gold text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl">
                Get Detailed Quote <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-[9px] text-primary/30 font-medium italic">
          *The above ranges are indicative & may vary based on materials, design & requirements.
        </p>
      </div>
    </section>
  );
}
