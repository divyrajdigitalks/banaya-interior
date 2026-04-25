"use client";

import { motion } from "framer-motion";
import { Phone, ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import Image from "next/image";

export function FeaturesSection() {
  return (
    <section className="relative py-32 bg-[#fdfcfb] overflow-hidden">
      {/* Large Background Text Decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="font-serif text-[25vw] text-charcoal tracking-[0.1em] uppercase whitespace-nowrap"
        >
          CRAFTSMANSHIP
        </motion.h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Product Showcase with Floating Elements */}
          <div className="relative group">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square max-w-lg mx-auto rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"
                alt="Wooden serving plate"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/20 to-transparent" />
            </motion.div>

            {/* Floating Badges */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-charcoal/5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal">Artisanal</p>
                <p className="text-xs text-charcoal/40 font-light">Hand-carved</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-charcoal/5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal">Food Safe</p>
                <p className="text-xs text-charcoal/40 font-light">Natural Finish</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Content & CTA */}
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.5em] text-gold font-black uppercase block"
              >
                The Art of Living
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-5xl md:text-7xl text-charcoal font-black leading-tight"
              >
                Handcrafted <br />
                <span className="italic font-light text-gold">Soulful</span> Pieces.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-charcoal/50 text-lg font-light leading-relaxed max-w-xl"
              >
                Discover objects that transcend utility, each carved by master artisans to bring warmth and heritage into your home. 100% natural, scratch-proof, and designed to last generations.
              </motion.p>
            </div>

            {/* Quick Features Grid */}
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Material", value: "Premium Teak" },
                { label: "Finish", value: "Organic Oil" },
                { label: "Durability", value: "Lifetime" },
                { label: "Safe", value: "100% Food Safe" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 border-l-2 border-gold/20 pl-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold">{item.label}</p>
                  <p className="text-charcoal text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <button className="group relative px-12 py-6 bg-charcoal text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700">
                <span className="relative z-10 flex items-center gap-4">
                  Acquire Piece <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-warm-cream flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Bespoke Inquiry</p>
                  <p className="text-charcoal font-black tracking-widest">+91 88558 17434</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
