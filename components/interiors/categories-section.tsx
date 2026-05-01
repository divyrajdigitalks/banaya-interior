"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "residential",
    title: "Residential Interiors",
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
    description: "Personal sanctuaries designed for modern living."
  },
  {
    id: "commercial",
    title: "Commercial Spaces",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    description: "Inspiring environments for productivity and growth."
  },
  {
    id: "hospitality",
    title: "Hospitality Design",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    description: "Crafting memorable experiences for every guest."
  },
  {
    id: "luxury",
    title: "Luxury Interiors",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    description: "Uncompromising elegance for the discerning few."
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg uppercase font-serif   font-bold block mb-4"
            >
              Curated experiences and spaces
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-5xl md:text-6xl text-primary leading-tight font-black"
            >
              Spaces that tell <br />
              <span className="italic font-light text-gold">your story.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary/50 max-w-sm text-lg font-light leading-relaxed mb-2"
          >
            From minimalist residential havens to grand commercial masterpieces.
          </motion.p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group relative h-[500px] overflow-hidden rounded-[2.5rem] cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <span className="text-xs font-semibold text-gold">
                    0{index + 1}
                  </span>
                  <h3 className="text-4xl font-serif font-black text-white leading-none">
                    {category.title}
                  </h3>
                  <p className="text-white/60 text-lg font-light max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {category.description}
                  </p>
                  <div className="pt-4 flex items-center gap-4 text-white text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    Explore collection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Decorative border on hover */}
              <div className="absolute inset-4 border border-white/0 group-hover:border-white/20 rounded-[1.5rem] transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
