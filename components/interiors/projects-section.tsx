"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Niseko Dining House",
    location: "Hokkaido, Japan",
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80",
    description: "A harmonious blend of traditional Japanese aesthetics and modern luxury, featuring bespoke walnut furniture."
  },
  {
    id: 2,
    title: "Urban Loft Studio",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    description: "Industrial chic meets royal comfort in this expansive open-plan sanctuary overlooking the Arabian Sea."
  },
  {
    id: 3,
    title: "Coastal Retreat",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    description: "Airy, light-filled spaces designed for ultimate relaxation, with hand-carved teak accents."
  },
  {
    id: 4,
    title: "Mountain Villa",
    location: "Shimla, India",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    description: "Cozy grandeur in the Himalayas, where reclaimed wood and local stone create a majestic retreat."
  },
];

export function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text: Context & Branding */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-lg uppercase  text-gold font-bold block">
                Portfolio of distinction
              </span>
              <h2 className="font-serif text-5xl md:text-6xl text-primary font-black leading-tight">
                Living <br />
                <span className="italic font-light text-gold">Masterpieces.</span>
              </h2>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-primary/50 text-lg font-light leading-relaxed max-w-sm"
            >
              Each project is a unique dialogue between architecture and soul, meticulously crafted to reflect the essence of its inhabitants.
            </motion.p>

            {/* Navigation Controls */}
            <div className="flex items-center gap-6 pt-8">
              <button
                onClick={prevSlide}
                className="group w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-xl"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="h-[1px] w-12 bg-primary/10" />
              <button
                onClick={nextSlide}
                className="group w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-xl"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Center: Hero Image with Ken Burns & Transitions */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl group">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentProject.image}
                    alt={currentProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Location Tag */}
              <motion.div 
                key={`location-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
              >
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  {currentProject.location}
                </span>
              </motion.div>
            </div>

            {/* Decorative background text */}
            <div className="absolute -top-12 -right-12 text-[12vw] font-serif font-black text-primary/[0.03] pointer-events-none select-none -z-10 italic">
              Legacy
            </div>
          </div>

          {/* Right: Project Details */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-serif font-light text-gold italic">
                  0{currentIndex + 1}
                </span>
                <div className="h-[1px] flex-grow bg-gold/30" />
                <span className="text-xs font-semibold text-primary/20">
                  0{projects.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="font-serif text-3xl text-primary font-black leading-tight">
                    {currentProject.title}
                  </h3>
                  <p className="text-primary/60 text-base font-light leading-relaxed">
                    {currentProject.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <button className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-gold transition-colors pt-4">
                View Full Case Study
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
