"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronDown, SlidersHorizontal, Search, X, Grid, List, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURED_PRODUCTS, CATEGORIES } from "@/lib/constants";
import { ProductCard } from "@/components/product/product-card";
import { Footer } from "@/components/footer";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(category || "All");
    
    const query = searchParams.get("q");
    setSearchQuery(query || "");
  }, [searchParams]);

  const filteredProducts = FEATURED_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* ── Compact Page Header ── */}
      <section className="bg-white pt-20 pb-8 border-b border-charcoal/5 relative overflow-hidden">
        <div className="absolute top-6 left-6 z-20">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) router.back();
              else router.push("/decor");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/80 backdrop-blur px-4 py-2 text-sm font-semibold text-charcoal hover:border-gold/30 hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-3 bg-gold/40" />
              <Sparkles className="h-2 w-2 text-gold" />
              <div className="h-px w-3 bg-gold/40" />
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-black mb-3">The Royal Marketplace</p>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-charcoal mb-4 tracking-tighter leading-tight">
              Curated <span className="italic font-light text-gold">Masterpieces</span>
            </h1>
            <p className="text-charcoal/70 max-w-md mx-auto text-base font-light leading-relaxed">
              Explore our complete collection of heritage-inspired furniture and decor.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <span className="text-[15vw] font-serif italic font-black text-charcoal">SHOP</span>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 py-4">
            {/* Category Filter */}
            <div className="flex items-center gap-6 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-hide">
              {["All", ...CATEGORIES.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[8px] uppercase tracking-[0.2em] whitespace-nowrap font-bold transition-all duration-500 relative py-1.5 ${
                    selectedCategory === cat ? "text-gold" : "text-charcoal/30 hover:text-charcoal"
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <motion.div 
                      layoutId="active-shop-cat" 
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 lg:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-charcoal/20 group-focus-within:text-gold transition-colors" />
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-warm-cream/30 border border-charcoal/5 rounded-full pl-9 pr-4 py-2.5 text-[9px] uppercase tracking-widest font-bold focus:ring-2 focus:ring-gold/5 focus:border-gold/20 transition-all placeholder:text-charcoal/20 outline-none"
                />
              </div>
              
              {/* Refine Button */}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white bg-charcoal px-5 py-2.5 rounded-full hover:bg-gold transition-all duration-500 shadow-md group"
              >
                <SlidersHorizontal className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500" /> 
                <span className="hidden sm:inline">Refine</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Section ── */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          {/* Results Metadata */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[7px] uppercase tracking-[0.2em] font-black text-gold">The Collection</span>
                <div className="h-px w-5 bg-gold/20" />
              </div>
              <h2 className="text-2xl md:text-2xl font-serif font-black text-charcoal tracking-tight">
                {selectedCategory === "All" ? "Full Sanctuary" : selectedCategory}
                <span className="text-gold/20 ml-2 font-serif italic text-3xl">{filteredProducts.length}</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-full p-0.5 border border-charcoal/5">
                <button className="p-1.5 rounded-full bg-charcoal text-white shadow-sm transition-all">
                  <Grid className="h-2.5 w-2.5" />
                </button>
                <button className="p-1.5 rounded-full text-charcoal/30 hover:text-charcoal transition-all">
                  <List className="h-2.5 w-2.5" />
                </button>
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 text-[7px] font-black uppercase tracking-widest text-charcoal py-2 px-4 bg-white border border-charcoal/5 rounded-full hover:border-gold/30 transition-all">
                  Sort: {sortBy} <ChevronDown className="h-2.5 w-2.5 text-gold" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-cream border border-charcoal/5">
                <Search className="h-5 w-5 text-charcoal/10" />
              </div>
              <h3 className="text-xl font-serif font-black text-charcoal mb-3">Masterpiece Not Found</h3>
              <p className="text-charcoal/40 text-sm font-light italic mb-8 max-w-xs mx-auto">Try another search or category?</p>
              <button 
                onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
                className="group flex items-center gap-2 mx-auto text-[8px] font-black uppercase tracking-[0.2em] text-gold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-all duration-500"
              >
                Reset All Filters <X className="h-2.5 w-2.5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          )}

          {/* Load More Section */}
          {filteredProducts.length > 0 && (
            <div className="mt-20 text-center space-y-6">
              <div className="max-w-[180px] mx-auto space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[6px] uppercase tracking-widest font-black text-charcoal/20">Showing {filteredProducts.length}</span>
                  <span className="text-[6px] uppercase tracking-widest font-black text-charcoal/20">Of 120</span>
                </div>
                <div className="w-full h-px bg-charcoal/5 relative rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "33%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gold" 
                  />
                </div>
              </div>
              
              <button className="group relative px-8 py-3.5 border border-charcoal/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-charcoal hover:text-white transition-all duration-500 overflow-hidden shadow-md">
                <span className="relative z-10">Unveil More Pieces</span>
                <div className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
          <p className="font-serif italic text-2xl text-charcoal/40 animate-pulse tracking-widest">Preparing the Sanctuary...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
