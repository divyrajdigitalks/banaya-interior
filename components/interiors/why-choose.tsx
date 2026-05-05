"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Wallet,
  ShieldCheck,
  Headphones,
  Clock,
} from "lucide-react";

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
    <section className="py-18 bg-[#faf7f2] overflow-hidden relative">
      
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full border border-primary" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full border border-primary" />
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-12">
            
            <div className="space-y-3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-gold font-semibold text-[11px] uppercase tracking-[0.25em] block"
              >
                The Banaya Advantage
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-serif font-medium text-primary leading-tight"
              >
                Why Choose <br />
                <span className="text-gold font-semibold">
                  Banaya Interiors?
                </span>
              </motion.h2>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {FEATURES.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex gap-4 group"
                >
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-white flex items-center justify-center text-gold border border-gold/30 shadow-sm group-hover:bg-gold group-hover:text-white transition duration-300">
                    <feature.icon size={20} strokeWidth={1.8} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                      {feature.title}
                    </h4>

                    <p className="text-sm text-primary/70 font-normal leading-relaxed max-w-[240px]">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-[420px] relative"
          >
            
            {/* Frame */}
            <div className="absolute -inset-3 border border-gold/30 rounded-[2rem] translate-x-2 translate-y-2" />

            <div className="relative aspect-[4/5] rounded-[1.8rem] overflow-hidden shadow-xl">
              
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Interiors Showcase"
                fill
                className="object-cover transition-transform duration-[2.5s] hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Quote */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <p className="text-white text-sm font-normal italic leading-relaxed">
                  "Excellence is not an act, but a habit. We design spaces that feel as good as they look."
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}