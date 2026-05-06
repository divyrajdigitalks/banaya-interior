"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PenTool,
  Hammer,
  PackageCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Quote,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";

const ICONS: Record<string, LucideIcon> = {
  Search,
  PenTool,
  Hammer,
  PackageCheck,
  Heart,
};

const PROCESS = [
  {
    iconId: "Search",
    step: "01",
    title: "Consultation",
    desc: "Understanding your needs & lifestyle",
  },
  {
    iconId: "PenTool",
    step: "02",
    title: "Design & Planning",
    desc: "Concept, 3D designs & planning",
  },
  {
    iconId: "Hammer",
    step: "03",
    title: "Execution",
    desc: "Quality execution with precision",
  },
  {
    iconId: "PackageCheck",
    step: "04",
    title: "Handover",
    desc: "Timely handover with perfection",
  },
  {
    iconId: "Heart",
    step: "05",
    title: "After Sales Service",
    desc: "We're with you, always",
  },
];

const TESTIMONIALS = [
  {
    name: "Neha & Rohit Sharma",
    location: "Bangalore",
    text: "Banaya Interiors transformed our house into a dream home. The team was professional, creative and delivered beyond our expectations.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Vikram Malhotra",
    location: "Mumbai",
    text: "The attention to detail and the quality of finish is exceptional. They truly understood my vision for a modern minimalist apartment.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Ananya Iyer",
    location: "Pune",
    text: "From concept to completion, the process was seamless. Their ability to blend functionality with luxury is what sets them apart.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

export function DesignProcessSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 bg-[#faf7f2] relative">
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Design Process */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-3">
              <span className="text-[11px] text-gold font-semibold uppercase tracking-[0.25em]">
                Our Method
              </span>

              <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary tracking-tight">
                Crafting Your{" "}
                <span className="italic text-gold font-semibold">
                  Masterpiece
                </span>
              </h2>
            </div>

            <div className="space-y-10">
              {PROCESS.map((item, idx) => {
                const Icon = ICONS[item.iconId] || Search;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-white border border-primary/10 flex items-center justify-center text-primary/60 group-hover:text-gold group-hover:border-gold/40 transition-all duration-300 shadow-sm">
                        <Icon size={22} strokeWidth={1.8} />
                      </div>

                      {idx !== PROCESS.length - 1 && (
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-gradient-to-b from-gold/30 to-transparent" />
                      )}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-gold/70 tracking-widest uppercase">
                          {item.step}
                        </span>

                        <h4 className="text-base font-semibold text-primary group-hover:text-gold transition-colors">
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-sm text-primary/70 font-normal leading-relaxed max-w-md">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-white border border-primary/10 shadow-xl overflow-hidden min-h-[480px] flex flex-col">
              
              <Quote className="absolute -top-6 -right-6 text-gold/10 w-32 h-32 -rotate-12" />

              <div className="relative z-10 space-y-10 flex-1 flex flex-col">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-semibold text-gold uppercase tracking-[0.25em]">
                    Testimonials
                  </h2>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevTestimonial}
                      className="w-9 h-9 rounded-full border border-primary/10 flex items-center justify-center text-primary/50 hover:bg-gray-50 hover:text-primary transition"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button 
                      onClick={nextTestimonial}
                      className="w-9 h-9 rounded-full border border-primary/10 flex items-center justify-center text-primary/50 hover:bg-gray-50 hover:text-primary transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <p className="text-lg md:text-xl font-serif text-primary/90 leading-relaxed font-normal italic">
                        "{current.text}"
                      </p>

                      <div className="flex items-center gap-4 pt-8 border-t border-primary/10">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-md shrink-0">
                          <Image
                            src={current.image}
                            alt={current.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                            {current.name}
                          </h4>

                          <p className="text-[11px] text-gold font-semibold uppercase tracking-wide mt-1">
                            {current.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex gap-2 justify-center pt-8">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-[2px] transition-all duration-500 rounded-full ${
                        currentIndex === idx ? "w-6 bg-gold" : "w-3 bg-primary/20"
                      }`}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}