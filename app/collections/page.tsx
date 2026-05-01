"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { Footer } from "@/components/footer";

export default function CollectionsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-primary">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000"
            alt="Collections Hero"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/40 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-6 md:px-12">
          <div className="mb-5">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) router.back();
                else router.push("/");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold text-white hover:border-gold/40 hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="h-px w-5 bg-gold" />
              <p className="text-xs text-gold font-semibold">
                The royal anthology
              </p>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white leading-tight tracking-tighter"
            >
              Curated <br />
              <span className="text-gold italic font-light">Sanctuaries</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-white/60 text-sm font-light max-w-lg leading-relaxed"
            >
              Explore our meticulously crafted collections, where each piece is a testament to heritage, artistry, and the pursuit of living excellence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Philosophy Section ── */}
      <section className="bg-white py-16 border-b border-primary/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-4xl font-serif font-black text-primary leading-tight mb-6">
                Designed for the <span className="text-gold italic font-light">Discerning Eye</span>, built for generations.
              </h2>
              <p className="text-primary/60 text-base font-light leading-relaxed max-w-2xl">
                Our collections are not merely furniture; they are curated experiences. We blend ancient woodworking techniques with contemporary silhouettes to create spaces that resonate with soul and sophistication.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-6">
              {[
                { icon: Sparkles, title: "Artisanal Mastery", desc: "Hand-finished by master craftsmen" },
                { icon: ShieldCheck, title: "Legacy Quality", desc: "25-year structural guarantee" },
                { icon: Truck, title: "White Glove", desc: "Complimentary premium delivery" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-primary">{item.title}</h4>
                    <p className="text-[10px] text-primary/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Collections Showcase ── */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="space-y-24 md:space-y-32">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${i % 2 !== 0 ? "lg:[&>*:first-child]:order-last" : ""}`}
              >
                {/* Image Section */}
                <div className="lg:col-span-7 relative aspect-16/10 rounded-2xl overflow-hidden shadow-xl group">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-1000" />
                  
                  {/* Floating Year/Index */}
                  <div className="absolute bottom-6 left-6 text-white/20 font-serif italic text-6xl select-none group-hover:text-gold/20 transition-colors duration-1000">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gold">Collection {String(i + 1).padStart(2, "0")}</span>
                      <div className="h-px flex-1 bg-gold/10" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-charcoal leading-tight tracking-tighter">
                      {cat.name.split(' ')[0]} <br />
                      <span className="text-gold italic font-light">{cat.name.split(' ')[1] || 'Living'}</span>
                    </h2>
                  </div>

                  <p className="text-charcoal/60 text-base font-light leading-relaxed">
                    A collection that redefines the boundaries of {cat.name.toLowerCase()} design. Crafted from sustainably sourced heritage woods and finished with our signature organic oils.
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-charcoal/5">
                    <div>
                      <p className="text-xl font-serif font-black text-charcoal">{cat.count}+</p>
                      <p className="text-[7px] uppercase tracking-widest text-charcoal/40 font-bold">Unique Pieces</p>
                    </div>
                    <div>
                      <p className="text-xl font-serif font-black text-charcoal">Legacy</p>
                      <p className="text-[7px] uppercase tracking-widest text-charcoal/40 font-bold">Design Language</p>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-4 group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                        <ArrowRight className="h-3.5 w-3.5 text-gold group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-charcoal group-hover:text-gold transition-colors">
                      Enquire for {cat.name}
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bespoke Invitation ── */}
      <section className="relative py-24 bg-charcoal text-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[8px] uppercase tracking-[0.6em] text-gold font-black mb-6">The Bespoke Ritual</p>
              <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 leading-tight tracking-tighter">
                Nothing fits? <br />
                <span className="text-gold italic font-light">We'll craft it.</span>
              </h2>
              <p className="text-white/40 text-base font-light mb-10 max-w-xl mx-auto leading-relaxed">
                For those who seek the truly unique, our master artisans offer a bespoke service to bring your specific vision to life.
              </p>
              
              <Link href="/contact">
                <button className="group relative px-10 py-4 bg-gold text-charcoal font-semibold text-sm rounded-full hover:bg-white transition-all duration-700 overflow-hidden shadow-lg">
                  <span className="relative z-10">Commission a Masterpiece</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Watermark */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.01] pointer-events-none select-none">
          <span className="text-[20vw] font-serif italic font-black leading-none tracking-tighter">ROYAL</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
