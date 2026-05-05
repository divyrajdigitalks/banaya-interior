"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const FILTERS = ["All", "2 BHK", "3 BHK", "4 BHK", "Villa", "Commercial"];

const PROJECTS = [
  {
    id: 1,
    title: "Modern Minimal Home",
    desc: "3 BHK Apartment | Pune",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    category: "3 BHK",
  },
  {
    id: 2,
    title: "Warm Contemporary Home",
    desc: "2 BHK Apartment | Mumbai",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    category: "2 BHK",
  },
  {
    id: 3,
    title: "Luxury Villa Interiors",
    desc: "4 BHK Villa | Hyderabad",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
    category: "Villa",
  },
  {
    id: 4,
    title: "Elegant Classic Home",
    desc: "3 BHK Apartment | Bangalore",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    category: "3 BHK",
  },
];

export function FeaturedProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section className="py-16 bg-[#faf7f2] relative">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            
            <span className="text-gold font-semibold text-[11px] uppercase tracking-[0.25em]">
              Portfolio
            </span>

            <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary tracking-tight">
              Featured{" "}
              <span className="italic text-gold font-semibold">
                Creations
              </span>
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`relative py-1 text-[12px] font-semibold tracking-wide uppercase transition ${
                    activeFilter === f
                      ? "text-primary"
                      : "text-primary/50 hover:text-primary"
                  }`}
                >
                  {f}

                  {activeFilter === f && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-2 text-[12px] font-semibold tracking-wide uppercase text-primary border-b border-primary/20 pb-1 hover:border-gold transition"
          >
            Explore All
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition"
            />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    
                    <span className="text-gold text-[11px] font-semibold uppercase tracking-wide mb-1">
                      {project.category}
                    </span>

                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.title}
                    </h3>

                    <p className="text-white/80 text-sm font-normal mb-4">
                      {project.desc}
                    </p>

                    <button className="flex items-center gap-2 text-white text-[12px] font-semibold uppercase tracking-wide">
                      View Case Study
                      <div className="w-6 h-[2px] bg-gold group-hover:w-10 transition-all" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-3">
          <button className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <ChevronLeft size={20} />
          </button>

          <button className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}