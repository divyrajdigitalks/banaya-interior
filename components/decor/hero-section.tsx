"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroService, type DecorHeroData } from "@/lib/api/services/hero.service";

export function DecorHeroSection() {
  const [data, setData] = useState<DecorHeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const response = await heroService.getDecorHero();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to load decor hero data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen bg-background overflow-hidden">
      {/* 🎥 LOCAL BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Loading Overlay: Starts solid black and fades to 50% opacity */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-black z-20" 
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <source src="/loop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative h-full flex items-center justify-center">
        {/* Removed HERITAGE background text */}

        {/* LEFT TEXT - ROYAL STYLE */}
        <div className="absolute left-8 md:left-20 top-[20%] md:top-[25%] max-w-[380px] z-30">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-sm text-gold font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold" /> {data?.topLabel || "Est. Since 2020"}
            </p>
            <h1 className="font-serif text-5xl md:text-8xl text-white font-black leading-[0.9] tracking-tighter mb-8">
              {data?.headingLine1 || "Banaya"} <br />
              <span className=" font-light text-gold">{data?.headingLine2 || "Decor"}</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed mb-10">
              {data?.description || "Masterfully handcrafted wooden serving treasures designed for the most distinguished dining experiences."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={data?.cta1Link || "/shop"}>
                <button className="group flex items-center justify-between gap-4 px-8 py-3.5 bg-gold text-primary text-sm font-bold rounded-full hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20">
                  {data?.cta1Text || "Shop Collection"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href={data?.cta2Link || "/decor"}>
                <button className="group flex items-center justify-between gap-4 px-8 py-3.5 border border-white/30 text-white text-sm font-bold rounded-full hover:bg-white hover:text-primary transition-all duration-500">
                  {data?.cta2Text || "View Lookbook"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* RIGHT TEXT - PREMIUM QUALITY */}
        <div className="absolute right-8 md:right-20 bottom-[15%] md:bottom-[20%] max-w-[400px] text-right z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-sm text-gold font-bold mb-4">{data?.rightHeading || "Uncompromising quality and detail"}</p>
            <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed mb-8">
              "{data?.rightQuote || "Elevate every culinary ritual with our signature heritage-fit tray collection."}"
            </p>
            <div className="ml-auto w-16 h-px bg-gold mb-8" />
            <div className="space-y-3">
              {(data?.features || ["100% Sustainable Acacia Wood", "Heritage Artisan Craftsmanship", "Food-Safe Royal Finish", "Modular Interlock Design"]).map((text, i) => (
                <p key={i} className="text-sm text-white/70 font-bold">
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL GUIDE */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4">
        <span className="text-xs text-white/50 font-bold tracking-widest">Explore the Ritual</span>
        <div className="w-px h-16 bg-linear-to-b from-gold to-transparent animate-pulse" />
      </div>
    </section>
  );
}