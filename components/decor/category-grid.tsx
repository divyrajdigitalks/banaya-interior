"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Serveware",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    href: "/shop?category=Serveware",
  },
  {
    name: "Bar Essentials",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
    href: "/shop?category=Bar Essentials",
  },
  {
    name: "Lighting",
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=800&q=80",
    href: "/shop?category=Lighting",
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80",
    href: "/shop?category=Home Decor",
  },
  {
    name: "Organisers",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    href: "/shop?category=Organisers",
  },
  {
    name: "Gifting",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    href: "/shop?category=Gifting",
  },
  {
    name: "Customisation",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    href: "/shop?category=Customisation",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-32  bg-[#fdf9f3] relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 border border-primary rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-primary rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <span className="text-gold font-black text-[10px] uppercase tracking-[0.4em]">Curated Collections</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-primary tracking-tight">
              Shop by <span className="italic font-medium text-gold">Category</span>
            </h2>
          </motion.div>
          <div className="w-20 h-[1px] bg-gold/30 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#fdfaf5] border border-primary/5 hover:border-gold/20 transition-all duration-700 hover:shadow-2xl hover:shadow-gold/10"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <h3 className="text-white text-lg font-serif tracking-wide leading-tight group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <Link href={cat.href} className="block">
                    <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-gold hover:border-gold hover:text-primary transition-all duration-500 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100">
                      View All
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
