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

  const filteredProjects = activeFilter === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <section className="py-24 bg-[#fdf9f3]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-serif font-black text-primary uppercase tracking-wider mb-8">
              Featured Projects
            </h2>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f 
                      ? "bg-primary text-white shadow-lg" 
                      : "bg-white text-primary/40 hover:bg-white hover:text-primary border border-primary/5"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Link href="/projects" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-gold transition-colors">
            View All Projects <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative group">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group/card"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover/card:shadow-xl transition-all duration-500">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-primary group-hover/card:text-gold transition-colors">{project.title}</h3>
                    <p className="text-[10px] text-primary/40 font-medium uppercase tracking-widest">{project.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <button className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all -ml-4">
            <ChevronLeft size={20} />
          </button>
          <button className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-primary/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all -mr-4">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
