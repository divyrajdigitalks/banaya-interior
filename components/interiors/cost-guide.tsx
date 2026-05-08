"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sofa,
  Layout,
  Bed,
  Baby,
  Home,
  Building2,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { costGuideService, type CostGuideItem } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

const ICONS: Record<string, LucideIcon> = {
  Layout,
  Sofa,
  Bed,
  Baby,
  Home,
  Building2,
};

const DEFAULT_COSTS = [
  { id: "1", iconId: "Layout", title: "Modular Kitchen", range: "₹2.5L - ₹5L", isActive: true, sortOrder: 0, createdAt: "", updatedAt: "" },
  { id: "2", iconId: "Sofa", title: "Living Room", range: "₹1.5L - ₹3.5L", isActive: true, sortOrder: 1, createdAt: "", updatedAt: "" },
  { id: "3", iconId: "Bed", title: "Master Bedroom", range: "₹1.5L - ₹3L", isActive: true, sortOrder: 2, createdAt: "", updatedAt: "" },
  { id: "4", iconId: "Baby", title: "Children's Bedroom", range: "₹1L - ₹2.5L", isActive: true, sortOrder: 3, createdAt: "", updatedAt: "" },
  { id: "5", iconId: "Home", title: "Full Home (2 BHK)", range: "₹8L - ₹15L", isActive: true, sortOrder: 4, createdAt: "", updatedAt: "" },
  { id: "6", iconId: "Building2", title: "Full Home (3 BHK)", range: "₹12L - ₹20L+", isActive: true, sortOrder: 5, createdAt: "", updatedAt: "" },
];

export function CostGuideSection() {
  const [costGuideItems, setCostGuideItems] = useState<CostGuideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCostGuideItems = async () => {
      try {
        const data = await costGuideService.getCostGuideList();
        setCostGuideItems(data.length > 0 ? data : DEFAULT_COSTS);
      } catch (error) {
        console.error('Error loading cost guide items:', error);
        setCostGuideItems(DEFAULT_COSTS);
      } finally {
        setLoading(false);
      }
    };

    loadCostGuideItems();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#faf7f2] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="flex items-center justify-center h-64">
            <p className="text-primary/40">Loading cost guide...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#faf7f2] relative overflow-hidden">
      
      {/* Background Accent */}

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-gold font-semibold text-[11px] uppercase tracking-[0.25em]">
            Pricing Guide
          </span>

          <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary tracking-tight">
            Investment for Your{" "}
            <span className="text-gold font-bold">
              Dream Space
            </span>
          </h2>

          <p className="text-sm text-primary/70 font-normal max-w-lg leading-relaxed">
            Transparent pricing models tailored to your lifestyle. These estimates
            help you plan your interior journey with clarity.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-10 items-stretch">
          
          {/* Cost Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {costGuideItems.map((item, idx) => {
              const Icon = ICONS[item.iconId] || Layout;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex flex-col p-6 rounded-2xl bg-white border border-primary/10 hover:border-gold/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Custom Image or Icon */}
                  {item.image ? (
                    <div className="w-11 h-11 rounded-xl overflow-hidden mb-6 relative">
                      <Image
                        src={buildImageUrl(item.image) || item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#faf7f2] flex items-center justify-center text-primary/60 group-hover:text-gold transition mb-6">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                  )}

                  <div className="space-y-1 mt-auto">
                    <h4 className="text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
                      {item.title}
                    </h4>

                    <p className="text-xl font-semibold text-primary group-hover:text-gold transition">
                      {item.range}
                    </p>

                    {item.description && (
                      <p className="text-xs text-primary/50 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Banner */}
          <div className="w-full xl:w-[380px] relative rounded-[2.5rem] overflow-hidden shadow-xl group">
            
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
              alt="Dream Home"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
            />

            <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px] flex flex-col justify-center p-10 text-white">
              <div className="space-y-5">
                
                <h3 className="text-3xl font-serif font-medium leading-tight">
                  Start Your <br />
                  <span className="text-gold text-4xl font-bold">
                    Journey
                  </span>
                </h3>

                <p className="text-sm text-white/80 font-normal leading-relaxed">
                  Every home tells a story. Let us help you design yours with
                  elegance and precision.
                </p>

                <button className="group flex items-center justify-between w-full px-6 py-4 bg-gold text-primary text-[11px] font-semibold tracking-wide uppercase rounded-xl hover:bg-white transition shadow-md">
                  Get Personalised Quote
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-primary/30" />
          <p className="text-[11px] text-primary/50 font-normal uppercase tracking-wide">
            *Indicative ranges. Final cost depends on materials, finishes & site conditions.
          </p>
        </div>

      </div>
    </section>
  );
}