"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export default function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div className="space-y-12 pb-12">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-[10px] tracking-[0.4em] text-gold uppercase font-black">Management Section</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-charcoal tracking-tight">
            {title} <span className="italic font-light text-gold">{subtitle}</span>
          </h1>
        </div>
        
        <Link href="/admin">
          <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-charcoal border-b border-charcoal/20 pb-1 hover:text-gold hover:border-gold transition-all">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </Link>
      </header>

      {/* ── Placeholder Content ── */}
      <div className="min-h-[60vh] border-2 border-dashed border-charcoal/10 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center bg-white/50 backdrop-blur-sm">
        <div className="w-24 h-24 rounded-full bg-gold/5 flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" />
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-3xl font-serif italic text-gold font-black">{title[0]}</span>
          </div>
        </div>
        <h2 className="text-2xl font-serif font-black text-charcoal mb-4 tracking-tight">Construction in Progress</h2>
        <p className="text-charcoal/40 text-sm font-light italic max-w-md leading-relaxed">
          The {title} management system is currently being refined to meet our heritage standards. Check back soon for full functionality.
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-32 h-1.5 bg-warm-cream rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                className="w-1/2 h-full bg-gold/30"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
