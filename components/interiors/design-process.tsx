"use client";

import { motion } from "framer-motion";
import {
  Search,
  PenTool,
  Hammer,
  PackageCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import Image from "next/image";

const PROCESS = [
  {
    icon: Search,
    step: "01",
    title: "Consultation",
    desc: "Understanding your needs & lifestyle",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design & Planning",
    desc: "Concept, 3D designs & planning",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Execution",
    desc: "Quality execution with precision",
  },
  {
    icon: PackageCheck,
    step: "04",
    title: "Handover",
    desc: "Timely handover with perfection",
  },
  {
    icon: Heart,
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
];

export function DesignProcessSection() {
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
              {PROCESS.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-white border border-primary/10 flex items-center justify-center text-primary/60 group-hover:text-gold group-hover:border-gold/40 transition-all duration-300 shadow-sm">
                      <item.icon size={22} strokeWidth={1.8} />
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
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-white border border-primary/10 shadow-xl overflow-hidden">
              
              <Quote className="absolute -top-6 -right-6 text-gold/10 w-32 h-32 -rotate-12" />

              <div className="relative z-10 space-y-10">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-semibold text-gold uppercase tracking-[0.25em]">
                    Testimonials
                  </h2>

                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full border border-primary/10 flex items-center justify-center text-primary/50 hover:bg-gray-50 hover:text-primary transition">
                      <ChevronLeft size={16} />
                    </button>

                    <button className="w-9 h-9 rounded-full border border-primary/10 flex items-center justify-center text-primary/50 hover:bg-gray-50 hover:text-primary transition">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-lg md:text-xl font-serif text-primary/90 leading-relaxed font-normal">
                    "{TESTIMONIALS[0].text}"
                  </p>

                  <div className="flex items-center gap-4 pt-5 border-t border-primary/10">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-md">
                      <Image
                        src={TESTIMONIALS[0].image}
                        alt={TESTIMONIALS[0].name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                        {TESTIMONIALS[0].name}
                      </h4>

                      <p className="text-[11px] text-gold font-semibold uppercase tracking-wide mt-1">
                        {TESTIMONIALS[0].location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <div className="w-6 h-[2px] bg-gold rounded-full" />
                  <div className="w-3 h-[2px] bg-primary/20 rounded-full" />
                  <div className="w-3 h-[2px] bg-primary/20 rounded-full" />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}