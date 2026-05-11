"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { interiorService, type InteriorProject, type InteriorCategory } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

export function FeaturedProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<InteriorProject[]>([]);
  const [categories, setCategories] = useState<InteriorCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        interiorService.getProjects(),
        interiorService.getCategories()
      ]);
      
      if (projectsRes.success) {
        setProjects(projectsRes.data);
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const FILTERS = ["All", ...categories.map(c => c.name)];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => {
          const catName = typeof p.category === 'object' ? p.category.name : '';
          return catName === activeFilter;
        });

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-[#faf7f2]">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

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
              Interior{" "}
              <span className="text-gold font-bold">
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
            href="/interiors/projects"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  
                  <Image
                    src={project.image ? (project.image.startsWith('http') ? project.image : buildImageUrl(project.image)) : ""}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    
                    <span className="text-gold text-[11px] font-semibold uppercase tracking-wide mb-1">
                      {typeof project.category === 'object' ? project.category.name : ""}
                    </span>

                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.name}
                    </h3>

                    <p className="text-white/80 text-sm font-normal mb-4">
                      {project.location}
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