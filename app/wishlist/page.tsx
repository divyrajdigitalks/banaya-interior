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
      
      <div className="container mx-auto px-6 pt-38 pb-32">
        <div className="mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-8 rounded-[3rem] border border-charcoal/10 bg-white/90 p-8 shadow-2xl shadow-charcoal/5">
            <div className="space-y-4 max-w-2xl">
              <BackButton className="mb-2" />
              <h1 className="font-serif text-4xl md:text-5xl text-primary font-black leading-tight">
                Your <span className="font-light text-gold">Wishlist.</span>
              </h1>
              <p className="text-sm text-primary/70">
                Curate the pieces you love and keep them ready for your next design chapter.
              </p>
            </div>
            <div className="rounded-3xl border border-charcoal/10 bg-[#fff8e5] px-6 py-5 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Saved Items</p>
              <p className="mt-3 text-3xl font-black text-primary">{wishlist.length}</p>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-24 space-y-8 bg-white rounded-[3rem] border border-dashed border-primary/10 shadow-xl shadow-charcoal/10">
              <div className="w-24 h-24 bg-[#fdf9f3] rounded-full flex items-center justify-center mx-auto text-primary/30 shadow-inner">
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
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-[2.5rem] border border-charcoal/10 bg-white shadow-sm"
                  >
                    <ProductCard 
                      id={item.product._id}
                      name={item.product.name}
                      price={item.product.price}
                      image={item.product.image}
                      category={item.product.category?.name || "Decor"}
                      rating={((item.product as any).rating as number) || 4.5}
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

