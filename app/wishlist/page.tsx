"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DoorTransition } from "@/components/door-transition";

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-background">
      <DoorTransition />
      <Header variant="light" />
      
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto border border-gold/20"
          >
            <Heart size={40} strokeWidth={1} />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-5xl md:text-6xl text-primary font-black leading-tight">
              Your <span className="italic font-light text-gold">Sanctuary.</span>
            </h1>
            <p className="text-primary/50 text-lg font-light max-w-lg mx-auto leading-relaxed">
              Pieces you've curated for your future home. Start exploring our collection to add your first royal treasure.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/shop">
              <button className="group relative px-12 py-6 bg-primary text-white text-xs font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700">
                <span className="relative z-10 flex items-center gap-4 tracking-widest uppercase">
                  Explore Shop <ShoppingBag size={14} />
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>
            </Link>
            
            <Link href="/decor" className="text-xs font-black uppercase tracking-widest text-primary hover:text-gold transition-colors flex items-center gap-3">
              View Decor <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
