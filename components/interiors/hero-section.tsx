"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

import { heroService, type InteriorHeroData } from "@/lib/api/services/hero.service";
import { buildImageUrl } from "@/lib/api";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [heroData, setHeroData] = useState<InteriorHeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const response = await heroService.getInteriorHero();
      if (response.success) {
        setHeroData(response.data);
      }
    } catch (error) {
      console.error("Failed to load interior hero data", error);
    } finally {
      setLoading(false);
    }
  };

  const openCalculator = () => {
    window.dispatchEvent(new CustomEvent("open-calculator", { detail: { type: "homes" } }));
  };

  const hero = heroData || {
    backgroundImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    topLabel: "The Royal Interior Experience",
    headingLine1: "Spaces that",
    headingLine2: "Speak Softly.",
    description: "Crafting timeless residential and commercial environments where every corner reflects a royal legacy and modern sophistication.",
    cta1Text: "Book Free Consultation",
    cta2Text: "Explore Collections",
    cta2Link: "/collections"
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
            backgroundImage: `url('${hero.backgroundImage.startsWith('http') ? hero.backgroundImage : buildImageUrl(hero.backgroundImage)}')`,
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
                <p className="text-sm text-gold font-semibold tracking-widest uppercase">{hero.topLabel}</p>
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
                  {hero.headingLine1} <br />
                  <span className="font-bold text-gold">{hero.headingLine2}</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-white/80 text-lg font-light mt-8 max-w-xl leading-relaxed drop-shadow-lg"
              >
                {hero.description}
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
                {hero.cta1Text}
              </button>
              <Link href={hero.cta2Link || "/collections"}>
                <button className="px-10 py-5 border border-white/20 text-white font-black text-xs rounded-full hover:bg-white hover:text-primary transition-all duration-700 shadow-xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em]">
                  {hero.cta2Text || "Explore Collections"}
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
            <div className="w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#C9A962] to-[#AF7934] px-5 py-4">
                <p className="text-[9px] font-black tracking-[0.2em] text-primary/50 uppercase mb-0.5">Free Consultation</p>
                <h3 className="text-base font-black text-primary leading-tight">Get Your Cost Estimate</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  {["Quick", "Free", "Accurate"].map((tag) => (
                    <span key={tag} className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="bg-[#1a1208]/90 backdrop-blur-xl px-5 py-5 space-y-3">
                
                {/* Property Type */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gold/60 uppercase tracking-[0.15em]">Property Type</label>
                  <div className="relative">
                    <select className="w-full bg-white/5 border border-white/10 hover:border-gold/40 rounded-lg py-2.5 px-3 text-xs font-bold text-white/80 appearance-none focus:outline-none focus:border-gold/60 transition-all">
                      <option className="bg-[#1a1208]" value="">Select Type</option>
                      <option className="bg-[#1a1208]">1 BHK</option>
                      <option className="bg-[#1a1208]">2 BHK</option>
                      <option className="bg-[#1a1208]">3 BHK</option>
                      <option className="bg-[#1a1208]">4 BHK+</option>
                      <option className="bg-[#1a1208]">Villa</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" size={13} />
                  </div>
                </div>

                {/* Area */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gold/60 uppercase tracking-[0.15em]">Carpet Area</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 1200"
                      className="w-full bg-white/5 border border-white/10 hover:border-gold/40 rounded-lg py-2.5 px-3 pr-10 text-xs font-bold text-white/80 focus:outline-none focus:border-gold/60 transition-all placeholder:text-white/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-gold/40">sqft</span>
                  </div>
                </div>

                {/* Scope */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gold/60 uppercase tracking-[0.15em]">Scope of Work</label>
                  <div className="relative">
                    <select className="w-full bg-white/5 border border-white/10 hover:border-gold/40 rounded-lg py-2.5 px-3 text-xs font-bold text-white/80 appearance-none focus:outline-none focus:border-gold/60 transition-all">
                      <option className="bg-[#1a1208]" value="">Select Scope</option>
                      <option className="bg-[#1a1208]">Full Home</option>
                      <option className="bg-[#1a1208]">Living Room</option>
                      <option className="bg-[#1a1208]">Kitchen Only</option>
                      <option className="bg-[#1a1208]">Wardrobes</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" size={13} />
                  </div>
                </div>

                {/* Style */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gold/60 uppercase tracking-[0.15em]">Interior Style</label>
                  <div className="relative">
                    <select className="w-full bg-white/5 border border-white/10 hover:border-gold/40 rounded-lg py-2.5 px-3 text-xs font-bold text-white/80 appearance-none focus:outline-none focus:border-gold/60 transition-all">
                      <option className="bg-[#1a1208]" value="">Select Style</option>
                      <option className="bg-[#1a1208]">Modern</option>
                      <option className="bg-[#1a1208]">Heritage</option>
                      <option className="bg-[#1a1208]">Minimalist</option>
                      <option className="bg-[#1a1208]">Royal</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" size={13} />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5 my-1" />

                {/* Button */}
                <button
                  onClick={openCalculator}
                  className="w-full bg-gradient-to-r from-[#C9A962] to-[#AF7934] text-primary font-black text-[10px] uppercase tracking-[0.2em] py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-gold/20"
                >
                  Calculate My Estimate
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[9px] text-white/20 font-medium">No spam. 100% free estimate.</p>
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
