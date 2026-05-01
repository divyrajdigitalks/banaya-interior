"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, Wallet, ShieldCheck, Headphones, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: User,
    title: "Personalized Designs",
    desc: "Designed around your lifestyle & needs",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    desc: "No hidden costs, complete clarity",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    desc: "High-quality materials & craftsmanship",
  },
  {
    icon: Headphones,
    title: "End-to-End Support",
    desc: "From design to installation",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    desc: "On-time project completion",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-12">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-2xl font-serif font-black text-primary uppercase tracking-wider"
            >
              Why Choose Banaya Interiors?
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {FEATURES.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#f8f5f0] flex items-center justify-center text-gold border border-gold/10 shadow-sm">
                    <feature.icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{feature.title}</h4>
                    <p className="text-[10px] text-primary/40 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-[400px] aspect-[4/3] relative rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41fa33a8?w=800&q=80"
              alt="Interiors Showcase"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
