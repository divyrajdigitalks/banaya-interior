"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DoorTransition } from "@/components/door-transition";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/product/product-card";

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <main className="min-h-screen bg-background">
      <DoorTransition />
      <Header variant="light" />
      
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h1 className="font-serif text-5xl md:text-7xl text-primary font-black leading-tight">
                Your <span className="italic font-light text-gold">Wishlist.</span>
              </h1>
              <p className="text-primary/50 text-lg font-light max-w-lg leading-relaxed">
                Pieces you've curated for your future home. {wishlist.length} {wishlist.length === 1 ? 'treasure' : 'treasures'} saved.
              </p>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto border border-gold/20"
              >
                <Heart size={40} strokeWidth={1} />
              </motion.div>
              <p className="text-primary/40 font-light italic">Your wishlist is currently empty.</p>
              <Link href="/shop" className="inline-block">
                <button className="group relative px-12 py-6 bg-primary text-white text-xs font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700">
                  <span className="relative z-10 flex items-center gap-4 tracking-widest uppercase">
                    Discover Collection <ArrowRight size={14} />
                  </span>
                  <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard 
                      id={item.product._id}
                      name={item.product.name}
                      price={item.product.price}
                      image={item.product.image}
                      category={item.product.category?.name || "Decor"}
                      rating={item.product.rating || 4.5}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

