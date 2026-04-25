"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-[100vh] overflow-hidden bg-charcoal">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80')`,
          }}
        />
      </div>
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-[8px] tracking-[0.4em] text-gold uppercase font-bold">
              Banaya Premium Interiors
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-3"
          >
            <p className="text-[8px] tracking-[0.2em] text-white/50 uppercase font-bold">
              Architectural Excellence & Heritage Design
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[0.9] font-black tracking-tighter">
              Spaces that <br />
              <span className="italic font-light text-gold">Speak Softly.</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/60 text-base font-light mt-6 max-w-md leading-relaxed"
          >
            Crafting timeless residential and commercial environments where every corner reflects a royal legacy and modern sophistication.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-5 mt-10"
          >
            <Link href="/collections">
              <button className="px-8 py-4 bg-gold text-charcoal font-black uppercase tracking-[0.2em] text-[9px] rounded-full hover:bg-white transition-all duration-700 shadow-xl hover:scale-105 active:scale-95">
                Explore Collections
              </button>
            </Link>
            <button className="group flex items-center gap-3 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:text-gold transition-all duration-500">
              View Portfolio
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform text-gold" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
