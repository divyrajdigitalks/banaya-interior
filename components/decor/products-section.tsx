"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productService, type Product } from "@/lib/api";

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getProductList(true);
      setProducts(data.slice(0, 6));
      setLoading(false);
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-gold/40" />
              <span className="text-xs text-gold font-semibold">Artisanal decor items</span>
              <div className="h-px w-8 bg-gold/40" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-5xl md:text-7xl text-primary font-black leading-tight"
            >
              Handcrafted with <span className="font-bold text-gold">soul.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-primary/50 mt-8 text-lg font-light leading-relaxed"
            >
              Discover objects that transcend utility, each carved by master artisans to bring warmth and heritage into your home.
            </motion.p>
          </div>

          <div className="flex items-center justify-center py-24">
            <p className="text-charcoal/40">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* BACKGROUND DECORATIVE TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
        <span className="font-serif italic text-[20vw] font-black text-primary tracking-tighter">COLLECTION</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-gold/40" />
            <span className="text-xs text-gold font-semibold">Artisanal decor items</span>
            <div className="h-px w-8 bg-gold/40" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-primary font-black leading-tight"
          >
            Handcrafted with <span className="font-bold text-gold">soul.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary/50 mt-8 text-lg font-light leading-relaxed"
          >
            Discover objects that transcend utility, each carved by master artisans to bring warmth and heritage into your home.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              category={product.categoryId}
              price={product.price}
              image={product.image}
              tag={product.tags?.[0]}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-32">
          <Link href="/shop">
            <button className="group relative inline-flex items-center gap-6 px-12 py-6 bg-primary text-white text-xs font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700">
              <span className="relative z-10 flex items-center gap-4 tracking-widest uppercase">
                Explore all decor <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-700" />
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
