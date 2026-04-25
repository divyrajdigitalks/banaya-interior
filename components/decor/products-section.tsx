"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "d1",
    name: "Royal Serving Platter",
    category: "Decor",
    price: 2499,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    tag: "Artisan",
  },
  {
    id: "d2",
    name: "Heritage Wooden Bowl Set",
    category: "Decor",
    price: 1899,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
    tag: "Handcrafted",
  },
  {
    id: "d3",
    name: "Elite Cheese Board",
    category: "Decor",
    price: 1299,
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=800&q=80",
    tag: "New",
  },
  {
    id: "d4",
    name: "Traditional Spice Box",
    category: "Decor",
    price: 999,
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80",
    tag: "Classic",
  },
  {
    id: "d5",
    name: "Majestic Serving Tray",
    category: "Decor",
    price: 1799,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  },
  {
    id: "d6",
    name: "Signature Salad Bowl",
    category: "Decor",
    price: 2199,
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
  },
];

export function ProductsSection() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.5em] text-gold font-black uppercase block mb-4"
          >
            Artisanal Decor
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-charcoal font-black leading-tight"
          >
            Handcrafted with <span className="italic font-light text-gold">Soul.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-charcoal/50 max-w-xl mx-auto mt-8 text-lg font-light leading-relaxed"
          >
            Discover objects that transcend utility, each carved by master artisans to bring warmth and heritage into your home.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((product, index) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-32">
          <Link href="/shop?category=Decor">
            <button className="group inline-flex items-center gap-6 px-12 py-6 bg-charcoal text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gold transition-all duration-700 shadow-2xl hover:shadow-gold/20">
              Explore All Decor
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
