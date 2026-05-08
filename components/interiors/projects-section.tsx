"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projectService, type Project } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

export function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await projectService.getProjectList(true);
        setProjects(data.length > 0 ? data : [
          {
            id: "1",
            name: "Niseko Dining House",
            location: "Hokkaido, Japan",
            image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80",
            description: "A harmonious blend of traditional Japanese aesthetics and modern luxury, featuring bespoke walnut furniture."
          },
          {
            id: "2",
            name: "Urban Loft Studio",
            location: "Mumbai, India",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
            description: "Industrial chic meets royal comfort in this expansive open-plan sanctuary overlooking the Arabian Sea."
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const nextSlide = () => {
    if (projects.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    if (projects.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (loading || projects.length === 0) {
    return null;
  }

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
              <span className="text-lg text-gold font-bold block">
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
              className=" text-lg font-light leading-relaxed max-w-sm"
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
                    src={buildImageUrl(currentProject.image) || currentProject.image}
                    alt={currentProject.name}
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
                    {currentProject.name}
                  </h3>
                  <p className="text-primary/60 text-base font-light leading-relaxed">
                    {currentProject.description}
                  </p>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
