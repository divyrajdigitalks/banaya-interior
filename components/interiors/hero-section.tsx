"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const openCalculator = () => {
    window.dispatchEvent(new CustomEvent("open-calculator", { detail: { type: "homes" } }));
  };

  return (
    <section className="relative min-h-screen lg:h-screen overflow-hidden bg-primary py-20 lg:py-0">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80')`,
          }}
        />
      </div>
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-primary via-transparent to-transparent opacity-90" />

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center w-full">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              {/* Top Label */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="h-px w-8 bg-gold" />
                <p className="text-sm text-gold font-semibold tracking-widest uppercase">The Royal Interior Experience</p>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
              >
                <p className="text-sm text-white/70 font-medium tracking-wide">
                  Architectural Excellence & Heritage Design
                </p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] font-black tracking-tight drop-shadow-2xl">
                  Spaces that <br />
                  <span className="font-bold text-gold">Speak Softly.</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-white/80 text-lg font-light mt-8 max-w-xl leading-relaxed drop-shadow-lg"
              >
                Crafting timeless residential and commercial environments where every corner reflects a royal legacy and modern sophistication.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-5"
            >
              <button 
                onClick={openCalculator}
                className="px-10 py-5 bg-gold text-primary font-black text-xs rounded-full hover:bg-white transition-all duration-700 shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em]"
              >
                Book Free Consultation
              </button>
              <Link href="/collections">
                <button className="px-10 py-5 border border-white/20 text-white font-black text-xs rounded-full hover:bg-white hover:text-primary transition-all duration-700 shadow-xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em]">
                  Explore Collections
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Estimate Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="lg:col-span-4"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl w-[360px] mx-auto">
              {/* Card Header */}
              <div className="bg-[#C9A962] px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-primary tracking-wide">Get Cost Estimate</h3>
                  <p className="text-[10px] text-primary/60 font-medium mt-0.5">Free • Takes 30 seconds</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowRight size={14} className="text-primary" />
                </div>
              </div>

              {/* Card Body */}
              <div className="bg-white/95 backdrop-blur-md px-5 py-4 space-y-3">
                {/* Grid: 1 col */}
                <div className="space-y-8">
                  {/* Property Type */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Property Type</label>
                    <div className="relative">
                      <select className="w-full bg-[#fdf9f3] border border-gold/20 rounded-lg py-1.5 px-3 text-[11px] font-bold text-primary appearance-none focus:outline-none focus:border-gold transition-colors">
                        <option>Select Type</option>
                        <option>1 BHK</option>
                        <option>2 BHK</option>
                        <option>3 BHK</option>
                        <option>4 BHK+</option>
                        <option>Villa</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={12} />
                    </div>
                  </div>

                  {/* Area */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Area</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 1200"
                        className="w-full bg-[#fdf9f3] border border-gold/20 rounded-lg py-1.5 px-3 text-[11px] font-bold text-primary focus:outline-none focus:border-gold transition-colors placeholder:text-primary/20"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/30">sqft</span>
                    </div>
                  </div>

                  {/* Scope */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Scope</label>
                    <div className="relative">
                      <select className="w-full bg-[#fdf9f3] border border-gold/20 rounded-lg py-1.5 px-3 text-[11px] font-bold text-primary appearance-none focus:outline-none focus:border-gold transition-colors">
                        <option>Select Scope</option>
                        <option>Full Home</option>
                        <option>Living Room</option>
                        <option>Kitchen Only</option>
                        <option>Wardrobes</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={12} />
                    </div>
                  </div>

                  {/* Style */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Style</label>
                    <div className="relative">
                      <select className="w-full bg-[#fdf9f3] border border-gold/20 rounded-lg py-1.5 px-3 text-[11px] font-bold text-primary appearance-none focus:outline-none focus:border-gold transition-colors">
                        <option>Select Style</option>
                        <option>Modern</option>
                        <option>Heritage</option>
                        <option>Minimalist</option>
                        <option>Royal</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={12} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={openCalculator}
                  className="w-full bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] py-2.5 rounded-lg hover:bg-[#C9A962] hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  Calculate My Estimate
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
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
        <p className="text-xs text-white/40 font-semibold mb-4">
          Scroll to explore
        </p>
        <div className="w-px h-16 bg-linear-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
