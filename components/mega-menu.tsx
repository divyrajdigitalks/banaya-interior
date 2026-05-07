"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  Wine, 
  Lamp, 
  Home, 
  Box, 
  Gift, 
  Pencil,
  ChevronDown,
  ArrowRight,
  X,
  Layers
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { categoryService, type Category, type Subcategory } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

const defaultIcons = [Coffee, Wine, Lamp, Home, Box, Gift, Pencil, Layers];

export function MegaMenu() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [categoriesData, subcategoriesData] = await Promise.all([
        categoryService.getCategoryList(true),
        categoryService.getSubcategoryList(true),
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="w-full bg-[#fdf9f3] border-b border-primary/5">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-center gap-2 md:gap-8 overflow-x-auto no-scrollbar py-4">
          {categories.map((cat, index) => {
            const IconComponent = defaultIcons[index % defaultIcons.length];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(activeTab === cat.id ? null : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap group ${
                  activeTab === cat.id ? "bg-primary text-white" : "text-primary/60 hover:text-primary"
                }`}
              >
                <IconComponent size={16} strokeWidth={1.5} className={activeTab === cat.id ? "text-white" : "group-hover:text-gold"} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{cat.name}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeTab === cat.id ? "rotate-180" : ""}`} />
              </button>
            );
          })}
        </nav>
      </div>

      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 bg-[#fdf9f3]/98 backdrop-blur-2xl z-[60] border-b border-primary/10 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-4xl mx-auto">
                {categories.filter(cat => cat.id === activeTab).map((cat, index) => {
                  const IconComponent = defaultIcons[index % defaultIcons.length];
                  const catSubcategories = subcategories.filter(sub => sub.categoryId === cat.id);
                  
                  return (
                    <div 
                      key={cat.id} 
                      className="grid grid-cols-1 md:grid-cols-2 gap-16 animate-in fade-in slide-in-from-top-4 duration-500"
                    >
                      <div className="space-y-8">
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {catSubcategories.length > 0 ? (
                            catSubcategories.map((sub) => (
                              <li key={sub.id}>
                                <Link 
                                  href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                  onClick={() => setActiveTab(null)}
                                  className="text-sm text-primary/60 hover:text-gold transition-colors duration-300 flex items-center gap-2 group/item"
                                >
                                  <div className="w-1.5 h-px bg-gold scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left" />
                                  {sub.name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className="col-span-2">
                              <Link 
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                onClick={() => setActiveTab(null)}
                                className="text-sm text-primary/60 hover:text-gold transition-colors duration-300 flex items-center gap-2 group/item"
                              >
                                <div className="w-1.5 h-px bg-gold scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left" />
                                View All Products
                              </Link>
                            </li>
                          )}
                        </ul>

                        <div className="pt-8">
                          <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} onClick={() => setActiveTab(null)}>
                            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-gold transition-all group">
                              Explore All {cat.name} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                          </Link>
                        </div>
                      </div>

                      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
                        <Image
                          src={buildImageUrl(cat.image) || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                        <div className="absolute bottom-8 left-8">
                          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Featured Collection</p>
                          <p className="text-white text-xl font-serif font-black tracking-tight">{cat.name} Essentials</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-primary/5 flex justify-center">
                <button 
                  onClick={() => setActiveTab(null)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 hover:text-primary transition-all flex items-center gap-2"
                >
                  <X size={14} /> Close Menu
                </button>
              </div>
            </div>
            {/* Click outside to close */}
            <div className="fixed inset-0 -z-10" onClick={() => setActiveTab(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
