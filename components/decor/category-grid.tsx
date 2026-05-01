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
    <section className="py-24 bg-[#fdf9f3]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary/40">Shop by Category</h2>
          <div className="w-24 h-px bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center space-y-4">
                <h3 className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">
                  {cat.name}
                </h3>
                <Link href={cat.href}>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-all">
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
