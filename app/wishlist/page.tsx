"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DoorTransition } from "@/components/door-transition";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/product/product-card";
import { BackButton } from "@/components/ui/back-button";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist } = useStore();

  return (
    <main className="min-h-screen bg-background">
      <DoorTransition />
      <Header variant="light" />
      
      <div className="container mx-auto px-6 pt-52 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <BackButton className="mb-4" />
              <h1 className="font-serif text-5xl md:text-7xl text-primary font-black leading-tight">
                Your <span className="italic font-light text-gold">Wishlist.</span>
              </h1>
              <p className="text-primary/70 text-lg font-light max-w-lg leading-relaxed">
                Pieces you've curated for your future home. {wishlist.length} {wishlist.length === 1 ? 'treasure' : 'treasures'} saved.
              </p>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-24 space-y-8 bg-white rounded-[3rem] border border-dashed border-primary/10">
              <div className="w-20 h-20 bg-[#fdf9f3] rounded-full flex items-center justify-center mx-auto text-primary/30">
                <Heart size={40} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Your wishlist is empty</h3>
                <p className="text-primary/60 text-sm max-w-xs mx-auto">
                  Pieces you've curated for your future home will appear here.
                </p>
              </div>
              <Link href="/shop" className="inline-block">
                <button className="px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gold transition-all shadow-xl shadow-primary/10">
                  Start Exploring
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

