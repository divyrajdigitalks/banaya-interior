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
  Check,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { productService, categoryService, filterService, type Product, type Category, type Subcategory, type FilterOptionsByGroup } from "@/lib/api";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsByGroup>({
    Type: ["Trays", "Platters", "Boards", "Coasters", "Organisers", "Bar Accessories"],
    Colour: ["Light Wood", "Dark Wood", "Natural Wood"],
    Discount: ["10% and above", "20% and above", "30% and above", "40% and above", "50% and above"],
    Materials: ["Teak Wood", "Mango Wood", "Wood + Glass"],
    Shape: ["Round", "Rectangle", "Square", "Oval", "Abstract"],
    UsePurpose: ["Coffee Serving", "Snack Serving", "Bar / Drinks", "Hosting / Party", "Gifting", "Everyday Use"],
    Occasions: ["House Party", "Festive", "Gifting", "Daily Use", "Wedding / Trousseau"],
  });
  const [loading, setLoading] = useState(true);

  // Advanced filters state
  const [selectedFilters, setSelectedFilters] = useState({
    Type: [] as string[],
    Colour: [] as string[],
    Discount: [] as string[],
    Materials: [] as string[],
    Shape: [] as string[],
    UsePurpose: [] as string[],
    Occasions: [] as string[],
    PriceMin: 250,
    PriceMax: 10000,
  });

  useEffect(() => {
    const loadData = async () => {
      const [productsData, categoriesData, subcategoriesData, dynamicFilterOptions] = await Promise.all([
        productService.getProductList(true),
        categoryService.getCategoryList(true),
        categoryService.getSubcategoryList(true),
        filterService.getFilterOptionsByGroup(true).catch(() => null),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      if (dynamicFilterOptions && Object.keys(dynamicFilterOptions).length > 0) {
        setFilterOptions(prev => ({ ...prev, ...dynamicFilterOptions }));
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    setSelectedCategory(category || "All");
    setSelectedSubcategory(subcategory || null);
    
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

  const resetFilters = () => {
    setSelectedFilters({
      Type: [],
      Colour: [],
      Discount: [],
      Materials: [],
      Shape: [],
      UsePurpose: [],
      Occasions: [],
      PriceMin: 250,
      PriceMax: 10000,
    });
  };

  const getDiscountValue = (discountStr: string): number => {
    const match = discountStr.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  };

  const filteredProducts = products.filter((p) => {
    const category = categories.find(c => c.id === p.categoryId);
    const categoryName = category?.name || "";
    const subcategory = subcategories.find(s => s.id === p.subcategoryId);
    const subcategoryName = subcategory?.name || "";
    
    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || subcategoryName === selectedSubcategory;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcategoryName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedFilters.Type.length === 0 || selectedFilters.Type.includes(p.type || "");
    
    // Colour filter
    const matchesColour = selectedFilters.Colour.length === 0 || selectedFilters.Colour.includes(p.colour || "");
    
    // Materials filter
    const matchesMaterials = selectedFilters.Materials.length === 0 || selectedFilters.Materials.includes(p.materials || "");
    
    // Shape filter
    const matchesShape = selectedFilters.Shape.length === 0 || selectedFilters.Shape.includes(p.shape || "");
    
    // Use/Purpose filter
    const matchesUsePurpose = selectedFilters.UsePurpose.length === 0 || selectedFilters.UsePurpose.includes(p.usePurpose || "");
    
    // Occasions filter
    const matchesOccasions = selectedFilters.Occasions.length === 0 || selectedFilters.Occasions.includes(p.occasions || "");
    
    // Discount filter
    const matchesDiscount = selectedFilters.Discount.length === 0 || 
      selectedFilters.Discount.some(discountStr => {
        const minDiscount = getDiscountValue(discountStr);
        return (p.discount || 0) >= minDiscount;
      });
    
    // Price filter
    const matchesPrice = p.price >= selectedFilters.PriceMin && p.price <= selectedFilters.PriceMax;
    
    return matchesCategory && matchesSubcategory && matchesSearch && 
           matchesType && matchesColour && matchesMaterials && 
           matchesShape && matchesUsePurpose && matchesOccasions && 
           matchesDiscount && matchesPrice;
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
                  <button className="bg-[#020e23] text-white text-xs font-black tracking-[0.2em] px-12 py-5 rounded-xl hover:bg-gold transition-all shadow-2xl uppercase">
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
              <h2 className="text-sm font-black ">
                Refine Sanctuary
              </h2>
              <button 
                onClick={resetFilters}
                className="text-[10px] text-gold font-bold hover:text-primary transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-8">
              {/* Type Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Type <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.Type.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("Type", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.Type.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.Type.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.Type.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colour Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Colour <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.Colour.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("Colour", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.Colour.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.Colour.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.Colour.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Discount <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.Discount.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("Discount", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.Discount.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.Discount.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.Discount.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Materials <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.Materials.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("Materials", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.Materials.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.Materials.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.Materials.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shape Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Shape <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.Shape.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("Shape", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.Shape.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.Shape.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.Shape.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Price <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-primary/40">₹</span>
                      <input 
                        type="number" 
                        min="250"
                        value={selectedFilters.PriceMin}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, PriceMin: Math.max(250, Number(e.target.value) || 250) }))}
                        className="w-full bg-white border border-primary/5 rounded-lg py-2 pl-6 pr-2 text-xs font-bold outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-primary/40">₹</span>
                      <input 
                        type="number" 
                        value={selectedFilters.PriceMax}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, PriceMax: Number(e.target.value) || 10000 }))}
                        className="w-full bg-white border border-primary/5 rounded-lg py-2 pl-6 pr-2 text-xs font-bold outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-primary/40 font-medium">
                    Min: ₹250
                  </div>
                </div>
              </div>

              {/* Use/Purpose Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Use / Purpose <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.UsePurpose.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("UsePurpose", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.UsePurpose.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.UsePurpose.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.UsePurpose.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasions Filter */}
              <div className="space-y-4">
                <button className="flex items-center justify-between w-full text-xs font-black text-primary uppercase tracking-widest">
                  Occasions <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                <div className="grid grid-cols-1 gap-2.5">
                  {filterOptions.Occasions.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter("Occasions", opt)}
                    >
                      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedFilters.Occasions.includes(opt) 
                          ? "bg-primary border-primary shadow-lg shadow-primary/10" 
                          : "border-primary/10 group-hover:border-gold"
                      }`}>
                        <Check className={`w-3 h-3 text-white transition-transform duration-300 ${
                          selectedFilters.Occasions.includes(opt) 
                            ? "scale-100" 
                            : "scale-0"
                        }`} />
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        selectedFilters.Occasions.includes(opt) 
                          ? "text-primary font-bold" 
                          : "text-primary/50 group-hover:text-primary"
                      }`}>{opt}</span>
                    </label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
     {/* ── CTA SECTION ── */}
      <section className="py-24 bg-[#020e23] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80" 
            alt="CTA Background" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight">
              Ready to Start Your Dream Project?
            </h2>
            <p className="text-white/70 text-lg font-light tracking-wide">
              Book your free consultation with our experts today.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-calculator", { detail: { type: "homes" } }))}
              className="bg-[#C9A962] text-primary font-black uppercase tracking-[0.2em] text-[10px] px-12 py-5 rounded-lg hover:bg-white transition-all shadow-2xl flex items-center gap-4 mx-auto group"
            >
              BOOK FREE CONSULTATION <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
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
