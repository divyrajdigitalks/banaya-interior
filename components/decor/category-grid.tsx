"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categoryService, type Category } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await categoryService.getCategoryList(true);
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-[#fdf9f3]">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-20 space-y-4">
            <span className="text-gold font-black text-[10px] uppercase tracking-[0.4em]">
              Curated Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-primary">
              Shop by <span className="font-bold text-gold">Category</span>
            </h2>
          </div>
          <div className="flex items-center justify-center py-24">
            <p className="text-charcoal/40">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-[#fdf9f3]">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Heading */}
        <div className="text-center mb-20 space-y-4">
          <span className="text-gold font-black text-[10px] uppercase tracking-[0.4em]">
            Curated Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-primary">
            Shop by <span className="font-bold text-gold">Category</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <Image
                  src={buildImageUrl(cat.image) || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-[10px] font-black tracking-widest leading-tight uppercase">
                    {cat.name}
                  </h3>
                  <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="mt-2 overflow-hidden h-0 group-hover:h-8 transition-all duration-500">
                    <button className="bg-gold text-primary text-[8px] font-black tracking-widest px-3 py-1.5 rounded-lg w-full uppercase">
                      Shop Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  );
}
