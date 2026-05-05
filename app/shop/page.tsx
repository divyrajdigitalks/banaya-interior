"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  ChevronDown, 
  SlidersHorizontal, 
  Search, 
  X, 
  Grid, 
  List, 
  Sparkles,
  ChevronRight,
  User,
  Heart,
  ShoppingBag,
  Filter,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURED_PRODUCTS, CATEGORIES } from "@/lib/constants";
import { ProductCard } from "@/components/product/product-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  
  // Advanced filters state
  const [selectedFilters, setSelectedFilters] = useState({
    Type: [] as string[],
    Colour: [] as string[],
    Materials: [] as string[],
    PriceRange: "All"
  });

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(category || "All");
    
    const query = searchParams.get("q");
    setSearchQuery(query || "");
  }, [searchParams]);

  const toggleFilter = (group: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[group] as string[];
      if (current.includes(value)) {
        return { ...prev, [group]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [group]: [...current, value] };
      }
    });
  };

  const filteredProducts = FEATURED_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedFilters.Type.length === 0 || selectedFilters.Type.includes(p.category); // Simple mapping for now
    
    return matchesCategory && matchesSearch && matchesType;
  });

  const updateCategory = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <Header variant="light" />

      {/* ── Breadcrumbs & Banner ── */}
      <section className="pt-40">
        {/* Breadcrumbs - Moved inside container for alignment */}
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-primary/30 mb-8">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{selectedCategory}</span>
          </div>
        </div>

        {/* Category Banner - FULL WIDTH */}
        <div className="relative w-full h-[450px] overflow-hidden mb-12 group">
          <Image 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80" 
            alt="Category Banner"
            fill
            className="object-cover transition-transform duration-[3s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center">
            <div className="container mx-auto px-4 md:px-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <span className="text-xs text-gold font-bold tracking-[0.3em]">The Collection</span>
                <h1 className="text-6xl md:text-8xl font-serif font-black text-white leading-none">
                  {selectedCategory === "All" ? "Decor" : selectedCategory}
                </h1>
                <p className="text-white/70 text-lg md:text-xl font-light max-w-xl leading-relaxed">
                  Handpicked masterpieces designed to bring <br />
                  heritage and warmth into your home.
                </p>
                
                <div className="pt-4">
                  <button className="bg-[#020e23] text-white text-xs font-black tracking-[0.2em] px-12 py-5 rounded-full hover:bg-gold transition-all shadow-2xl uppercase">
                    Shop Collection
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <section className="container mx-auto px-4 md:px-8 pb-24">
        <div className="flex gap-12 items-start">
          {/* Sidebar Filters - Fixed Sticky */}
          <aside className="w-72 hidden lg:block shrink-0 sticky top-[180px] h-[calc(100vh-200px)] overflow-y-auto pr-6 scrollbar-hide">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/5">
              <h2 className="text-xs font-black tracking-[0.2em] text-primary">
                Refine Sanctuary
              </h2>
              <button className="text-[10px] text-gold font-bold hover:text-primary transition-colors">Reset</button>
            </div>

            <div className="space-y-12">
              {/* Price Filter */}
              <div className="space-y-6">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Price <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="px-2 pt-4 pb-2">
                  <div className="h-1 w-full bg-slate-200 rounded-full relative">
                    <div className="absolute h-full w-full bg-[#4F3D31] rounded-full" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-[#4F3D31] rounded-full border-2 border-white shadow-md cursor-pointer" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-[#4F3D31] rounded-full border-2 border-white shadow-md cursor-pointer" />
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-[10px] font-bold text-primary/60">₹0</span>
                    <span className="text-[10px] font-bold text-primary/60">₹10,000+</span>
                  </div>
                </div>
              </div>

              {/* Occasion Filter */}
              <div className="space-y-6">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Occasion <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-4">
                  {["Birthday (18)", "Anniversary (12)", "Housewarming (14)", "Festive (20)"].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-primary/20 rounded flex items-center justify-center transition-colors group-hover:border-gold">
                        <Check className="w-3 h-3 text-gold scale-0 transition-transform group-hover:scale-0" />
                      </div>
                      <span className="text-xs text-primary/60 group-hover:text-primary transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recipient Filter */}
              <div className="space-y-6">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Recipient <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-4">
                  {["For Her (18)", "For Him (14)", "For Couple (12)", "Corporate (10)"].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-primary/20 rounded flex items-center justify-center transition-colors group-hover:border-gold">
                        <Check className="w-3 h-3 text-gold scale-0 transition-transform group-hover:scale-0" />
                      </div>
                      <span className="text-xs text-primary/60 group-hover:text-primary transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-6">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Color <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="flex flex-wrap gap-3">
                  {["bg-black", "bg-[#F5E6D3]", "bg-[#C41E3A]", "bg-[#E5E4E2]", "bg-gradient-to-r from-green-800 to-amber-900"].map((color, i) => (
                    <button key={i} className={`w-6 h-6 rounded-full border border-primary/10 ${color} shadow-sm hover:scale-110 transition-transform`} />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Container */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary text-white rounded-lg">
                  <Filter className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-primary/60">Showing {filteredProducts.length} masterpieces</p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-primary/40 uppercase tracking-widest">Sort:</span>
                  <button className="flex items-center gap-3 text-xs font-bold text-primary bg-white border border-primary/5 rounded-xl px-5 py-2.5 hover:border-gold transition-all">
                    {sortBy} <ChevronDown className="h-3 w-3 text-gold" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-primary/40 uppercase tracking-widest">View:</span>
                  <div className="flex items-center p-1 bg-white border border-primary/5 rounded-xl shadow-sm">
                    <button className="p-2 bg-primary text-white rounded-lg shadow-lg"><Grid className="h-4 w-4" /></button>
                    <button className="p-2 text-primary/30 hover:text-primary transition-colors"><List className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    originalPrice={product.price * 1.2}
                  />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-10 w-10 text-primary/10" />
                </div>
                <h3 className="text-2xl font-serif font-black text-primary mb-3">No Masterpieces Found</h3>
                <p className="text-primary/40 text-sm font-light italic mb-10 max-w-xs mx-auto">Try adjusting your filters or search terms to find your sanctuary.</p>
                <button 
                  onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
                  className="px-10 py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gold transition-all shadow-xl shadow-primary/10"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredProducts.length > 0 && (
              <div className="mt-24 flex flex-col items-center gap-8">
                <div className="w-full max-w-xs h-1 bg-primary/5 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gold rounded-full" />
                </div>
                <button className="px-12 py-5 bg-white border-2 border-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-primary hover:text-white transition-all duration-700 shadow-xl shadow-primary/5">
                  Reveal More Pieces
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="bg-white/50 border-t border-primary/5 py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {[
              { title: "Premium quality", desc: "Finest quality wood", icon: "✨" },
              { title: "Sustainably made", desc: "Eco friendly materials", icon: "🌿" },
              { title: "Secure payments", desc: "100% secure checkout", icon: "🔒" },
              { title: "Easy returns", desc: "Free 15 days returns", icon: "🔄" },
              { title: "Pan India delivery", desc: "Safe & fast delivery", icon: "🚚" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-primary/5 flex items-center justify-center text-2xl shadow-xl group-hover:bg-gold group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">{item.title}</h4>
                  <p className="text-[10px] text-primary/40 italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Marketplace...</div>}>
      <ShopContent />
    </Suspense>
  );
}
