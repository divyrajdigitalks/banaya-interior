"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Hammer, PackageCheck, Heart, ChevronLeft, ChevronRight, Quote } from "lucide-react";
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
];

export function DesignProcessSection() {
  return (
    <section className="py-24 bg-[#fdf9f3]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Design Process */}
          <div className="lg:col-span-8 space-y-16">
            <h2 className="text-2xl font-serif font-black text-primary uppercase tracking-wider">
              Our Design Process
            </h2>

            <div className="relative">
              {/* Connector Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/10 -translate-y-1/2 hidden lg:block" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                {PROCESS.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 rounded-full bg-white border border-primary/5 flex items-center justify-center text-primary/40 group-hover:text-gold group-hover:border-gold transition-all duration-500 shadow-sm group-hover:shadow-xl mb-6 bg-white">
                      <item.icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-gold/40 uppercase tracking-widest">{item.step}</span>
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[10px] text-primary/40 font-medium leading-relaxed max-w-[120px] mx-auto">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="lg:col-span-4 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest">
                What Our Clients Say
              </h2>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 hover:bg-white transition-all shadow-sm">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 hover:bg-white transition-all shadow-sm">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-primary/5 relative">
              <Quote className="absolute top-8 right-8 text-gold/10" size={48} />
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden">
                  <Image
                    src={TESTIMONIALS[0].image}
                    alt={TESTIMONIALS[0].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-primary/70 leading-relaxed font-light italic">
                    "{TESTIMONIALS[0].text}"
                  </p>
                  <div>
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">
                      — {TESTIMONIALS[0].name}
                    </h4>
                    <p className="text-[10px] text-primary/40 font-bold">{TESTIMONIALS[0].location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 mt-8 justify-center">
                <div className="w-4 h-1 rounded-full bg-primary" />
                <div className="w-1 h-1 rounded-full bg-primary/20" />
                <div className="w-1 h-1 rounded-full bg-primary/20" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
