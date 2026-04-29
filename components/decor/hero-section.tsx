"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DecorHeroSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ✅ FIXED & ORDERED ITEMS
  const items = [
    {
      src: "/momos.png",
      range: [0.1, 0.20],
      rotate: -5,
      className: "bottom-[46%] right-[20%] w-[16%] h-[26%]",
    },
    {
      src: "/momos2.png",
      range: [0.20, 0.25],
      rotate: -2,
      className: "bottom-[40%] right-[22%] w-[22%] h-[26%]",
    },
    {
      src: "/sushi.png",
      range: [0.25, 0.30],
      rotate: 16,
      className: "top-[30%] left-[18%] w-[26%] h-[30%]",
    },
    {
      src: "/rolls.png",
      range: [0.30, 0.35],
      rotate: 6,
      className: "top-[16%] left-[36%] w-[38%] h-[32%]",
    },
    {
      src: "/mit.png",
      range: [0.35, 0.40],
      rotate: -10,
      className: "top-[16%] left-[28%] w-[24%] h-[38%]",
    },
    {
      src: "/mit1.png",
      range: [0.40, 0.45],
      rotate: -10,
      className: "top-[21%] left-[33%] w-[21%] h-[38%]",
    },
    {
      src: "/noodles.png",
      range: [0.45, 0.50], 
      rotate: -10,
      className: "bottom-[28%] left-[32%] w-[38%] h-[30%]",
    },
      {
      src: "/lamon.png",
      range: [0.50, 0.55], 
      rotate: -8,
      className: "bottom-[38%] left-[40%] w-[8%] h-[7%]",
    },
  ];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-warm-cream overflow-visible">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* BACKGROUND DECORATIVE TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
          <span className="font-serif italic text-[25vw] font-black text-charcoal tracking-tighter">HERITAGE</span>
        </div>

        {/* LEFT TEXT - ROYAL STYLE */}
        <div className="absolute left-12 top-24 max-w-[320px] z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[8px] uppercase tracking-[0.4em] text-gold font-black mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-gold" /> Since 2020
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-charcoal font-black leading-[0.9] tracking-tighter mb-5">
              Banaya <br />
              <span className="italic font-light text-gold">Décor</span>
            </h1>
            <p className="text-charcoal/50 text-sm font-light leading-relaxed mb-6">
              Masterfully handcrafted wooden <br />
              serving treasures designed for <br />
              the most distinguished dining <br />
              experiences.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link href="/shop?category=Decor">
                <button className="group w-full flex items-center justify-between gap-3 px-6 py-4 bg-charcoal text-white text-sm font-semibold rounded-full hover:bg-gold transition-all duration-700 shadow-xl hover:shadow-gold/20">
                  Shop Collection
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href="/collections?type=Decor">
                <button className="group w-full flex items-center justify-between gap-3 px-6 py-4 border border-charcoal/10 text-charcoal text-sm font-semibold rounded-full hover:bg-charcoal hover:text-white transition-all duration-700">
                  View Lookbook
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* RIGHT TEXT - PREMIUM QUALITY */}
        <div className="absolute right-12 bottom-16 max-w-[350px] text-right z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-[8px] uppercase tracking-[0.4em] text-gold font-black mb-3">Uncompromising Quality</p>
            <p className="text-charcoal/60 text-base font-light leading-relaxed mb-6 italic">
              "Elevate every culinary ritual with our signature <br />
              heritage-fit tray collection."
            </p>
            <div className="ml-auto w-12 h-[1.5px] bg-gold mb-6" />
            <div className="space-y-2">
              {[
                "100% Sustainable Acacia Wood",
                "Heritage Artisan Craftsmanship",
                "Food-Safe Royal Finish",
                "Modular Interlock Design"
              ].map((text, i) => (
                <p key={i} className="text-[8px] uppercase tracking-[0.2em] text-charcoal/40 font-bold">
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 🪵 TRAY - ANIMATED */}
        <motion.div 
          className="relative w-full max-w-[1000px] aspect-4/3 z-20"
          style={{
            scale: useTransform(scrollYProgress, [0, 0.1], [1, 1.1]),
            rotateX: useTransform(scrollYProgress, [0, 0.1], [0, 5]),
          }}
        >
          <Image
            src="/Dish.png"
            alt="tray"
            fill
            priority
            className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.15)]"
          />

          {/* 🍜 ITEMS */}
          {items.map((item, index) => (
            <AnimatedItem
              key={index}
              src={item.src}
              progress={scrollYProgress}
              range={item.range}
              rotate={item.rotate}
              className={item.className}
              zIndex={index + 20}
            />
          ))}
        </motion.div>
      </div>

      {/* SCROLL GUIDE */}
      <div className="absolute top-[90vh] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
        <span className="text-[9px] uppercase tracking-[0.5em] text-charcoal/20 font-bold">Experience the Ritual</span>
        <div className="w-px h-24 bg-linear-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

// 🍜 ITEM COMPONENT
function AnimatedItem({
  src,
  progress,
  range,
  rotate,
  className,
  zIndex,
}: {
  src: string;
  progress: import("framer-motion").MotionValue<number>;
  range: [number, number];
  rotate: number;
  className: string;
  zIndex: number;
}) {
  const opacity = useTransform(progress, (v: number) => {
    if (v < range[0]) return 0;
    if (v >= range[1]) return 1;
    return (v - range[0]) / (range[1] - range[0]);
  });

  const scale = useTransform(progress, (v: number) => {
    if (v < range[0]) return 0.85;
    if (v >= range[1]) return 1;
    const t = (v - range[0]) / (range[1] - range[0]);
    return 0.85 + t * 0.15;
  });

  const y = useTransform(progress, (v: number) => {
    if (v < range[0]) return 40;
    if (v >= range[1]) return 0;
    const t = (v - range[0]) / (range[1] - range[0]);
    return 40 - t * 40;
  });

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
        rotate: `${rotate}deg`,
        zIndex,
        willChange: "transform, opacity",
      }}
      className={`absolute ${className}`}
    >
      <Image
        src={src}
        alt="food"
        fill
        className="object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
}
