"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ShoppingBag, 
  ChevronRight, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  User,
  Search,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURED_PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedImageSize] = useState("Medium (16 x 10 in)");

  useEffect(() => {
    const foundProduct = FEATURED_PRODUCTS.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif font-black text-primary">Masterpiece Not Found</h1>
          <Button onClick={() => router.push("/shop")} variant="outline" className="rounded-full px-8">
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  const images = [product.image, product.hoverImage || product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      <Header />

      <div className="container mx-auto px-4 md:px-8 py-12 pt-40">
        {/* ── Breadcrumbs ── */}
        <nav className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-primary/30 hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} className="text-primary/20" />
          <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-primary/30 hover:text-gold transition-colors">Serveware</Link>
          <ChevronRight size={12} className="text-primary/20" />
          <Link href="/shop?category=Serving Trays" className="text-[10px] font-bold uppercase tracking-widest text-primary/30 hover:text-gold transition-colors">Serving Trays</Link>
          <ChevronRight size={12} className="text-primary/20" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Image Gallery Section ── */}
          <div className="lg:col-span-7">
            <div className="relative group rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#e87d3e] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg">
                  Bestseller
                </span>
              </div>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 text-primary hover:bg-gold hover:text-white transition-all shadow-xl"
              >
                <Heart size={20} className={isWishlisted ? "fill-primary" : ""} />
              </button>

              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white text-primary transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white text-primary transition-all">
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold text-primary shadow-sm cursor-pointer hover:bg-white transition-all">
                  <Search size={14} /> Click to zoom
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-3 mt-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-primary shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* ── Product Tabs ── */}
            <div className="mt-12">
              <div className="flex border-b border-primary/10">
                {["Description", "Specifications", "Care Instructions", "Shipping & Returns"].map((tab) => (
                  <button 
                    key={tab} 
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                      tab === "Description" ? "border-primary text-primary" : "border-transparent text-primary/40 hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-8 space-y-4">
                <p className="text-primary/70 text-sm leading-relaxed">
                  Serve in style with our {product.name}, handcrafted from premium Sheesham wood. Perfect for serving snacks, tea, breakfast in bed or even for organizing your essentials with elegance.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-8 border-b border-primary/5">
                  {["Elegant natural wood finish", "Sturdy handles for easy grip", "Multipurpose – serve, organize or display", "Food safe & easy to clean"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-primary/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" /> {feat}
                    </li>
                  ))}
                </ul>

                {/* Bulk Purchase Link */}
                <div className="pt-4">
                  <p className="text-xs font-bold text-primary/60">
                    Want to buy this in bulk? <Link href="#" className="text-gold border-b border-gold pb-0.5 hover:text-primary hover:border-primary transition-all">Click here</Link>
                  </p>
                </div>

                {/* BEST OFFERS SECTION */}
                <div className="mt-12 p-8 border-2 border-dashed border-primary/10 rounded-2xl bg-white space-y-8">
                  <h3 className="text-sm font-black text-[#e87d3e] uppercase tracking-[0.2em]">Best Offers For You!</h3>
                  
                  <div className="space-y-6">
                    <div className="pb-6 border-b border-primary/5">
                      <p className="text-sm font-black text-primary mb-2">Get 5% off sitewide <span className="font-light text-primary/60">No minimum spend</span></p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-primary/40 uppercase">Use Code:</span>
                        <div className="px-4 py-1.5 border border-dashed border-primary/30 rounded bg-[#f8f5f0] text-xs font-black tracking-widest text-primary">
                          MAKEHOMESPECIAL
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-black text-primary mb-2">Get ₹150 off on your first order <span className="font-light text-primary/60">Min. purchase of ₹1500</span></p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-primary/40 uppercase">Use Code:</span>
                        <div className="px-4 py-1.5 border border-dashed border-primary/30 rounded bg-[#f8f5f0] text-xs font-black tracking-widest text-primary">
                          NESTTRY
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COMBO SECTION - People Also Shopped For */}
                <div className="mt-16 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-primary/40 uppercase tracking-[0.3em]">People Also Shopped For</h3>
                  </div>
                  
                  <div className="p-8 bg-white border border-primary/5 rounded-3xl shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 grid grid-cols-3 gap-6 items-center">
                        <div className="space-y-3 text-center">
                          <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/5">
                            <Image src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80" alt="Item 1" fill className="object-cover" />
                          </div>
                          <p className="text-[9px] font-bold text-primary/60 leading-tight">Wooden Tray With Handles</p>
                          <p className="text-[10px] font-black text-primary">₹1,390 <span className="text-[8px] text-primary/20 line-through">₹2,150</span></p>
                        </div>
                        <div className="text-2xl text-primary/20 font-light">+</div>
                        <div className="space-y-3 text-center">
                          <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/5">
                            <Image src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400&q=80" alt="Item 2" fill className="object-cover" />
                          </div>
                          <p className="text-[9px] font-bold text-primary/60 leading-tight">Snack Platter With Bowls</p>
                          <p className="text-[10px] font-black text-primary">₹1,550 <span className="text-[8px] text-primary/20 line-through">₹2,340</span></p>
                        </div>
                        <div className="text-2xl text-primary/20 font-light">+</div>
                        <div className="space-y-3 text-center">
                          <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/5">
                            <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" alt="Item 3" fill className="object-cover" />
                          </div>
                          <p className="text-[9px] font-bold text-primary/60 leading-tight">Acacia Wood Cake Stand</p>
                          <p className="text-[10px] font-black text-primary">₹1,550 <span className="text-[8px] text-primary/20 line-through">₹2,340</span></p>
                        </div>
                      </div>

                      <div className="w-px h-24 bg-primary/5 hidden md:block" />

                      <div className="w-full md:w-56 space-y-4 text-center">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Total Price</p>
                          <p className="text-xl font-black text-primary">₹4,490</p>
                        </div>
                        <button className="w-full py-4 bg-[#4F3D31] hover:bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-primary/5">
                          Add All 3 To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Info Section ── */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-serif font-black text-primary tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-xs font-bold text-primary/40">128 reviews</span>
              </div>
              
              <div className="flex items-center gap-4 pt-2">
                <span className="text-3xl font-black text-primary">₹{product.price.toLocaleString()}</span>
                <span className="text-xl text-primary/30 line-through">₹1,299</span>
                <span className="bg-gold/10 text-gold text-[10px] font-black px-2 py-1 rounded">15% OFF</span>
              </div>
              <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest italic">Inclusive of all taxes</p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-4 gap-4 py-6 border-y border-primary/5">
              {[
                { icon: Sparkles, text: "Premium Sheesham Wood" },
                { icon: User, text: "Handcrafted with Care" },
                { icon: ShieldCheck, text: "Food Safe Finish" },
                { icon: Truck, text: "Long Lasting Durability" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#f8f5f0] flex items-center justify-center text-primary/60">
                    <item.icon size={18} />
                  </div>
                  <p className="text-[8px] font-bold text-primary/40 leading-tight uppercase tracking-wider">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Selection Options */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Size</p>
                <div className="flex flex-wrap gap-2">
                  {["Small (12 x 8 in)", "Medium (16 x 10 in)", "Large (18 x 12 in)"].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedImageSize(size)}
                      className={`px-5 py-2.5 rounded-lg text-[10px] font-bold transition-all border ${
                        selectedSize === size 
                          ? "bg-white border-primary text-primary shadow-sm" 
                          : "border-primary/5 text-primary/40 hover:border-primary/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Personalisation (Optional)</p>
                </div>
                <p className="text-[9px] text-primary/40 italic">Add engraving, name or logo to make it special.</p>
                <button className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-lg text-[10px] font-bold text-primary/60 hover:border-primary transition-all">
                  <Plus size={14} /> ADD PERSONALISATION
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <div className="flex items-center bg-[#f8f5f0] rounded-xl px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-primary/40 hover:text-primary transition-colors"><Minus size={16} /></button>
                  <span className="w-10 text-center font-black text-primary">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-primary/40 hover:text-primary transition-colors"><Plus size={16} /></button>
                </div>
                <Button className="flex-1 bg-primary hover:bg-gold text-white font-black uppercase tracking-[0.2em] text-[10px] py-7 rounded-xl transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3">
                  <ShoppingBag size={18} /> Add to Cart
                </Button>
              </div>

              <Button variant="outline" className="w-full py-7 rounded-xl border-primary/5 bg-[#f8f5f0] text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all">
                Buy Now
              </Button>

              <button className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-bold text-[#25D366] hover:opacity-80 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.064-4.516 10.066-10.066.002-5.548-4.512-10.064-10.066-10.064-5.548 0-10.064 4.516-10.066 10.066-.001 1.93.546 3.538 1.492 5.165l-.999 3.648 3.774-.991zm11.218-7.261c-.301-.15-1.78-.879-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.488-.891-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.463.13-.612.134-.133.301-.35.451-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525c-.075-.15-.675-1.628-.925-2.228-.243-.599-.488-.517-.675-.527l-.575-.01c-.2 0-.525.075-.8.35-.275.275-1.05 1.026-1.05 2.503 0 1.476 1.075 2.903 1.225 3.103.15.2 2.115 3.23 5.124 4.535.715.311 1.274.497 1.708.636.719.139 1.372.119 1.888.054.575-.072 1.78-.726 2.03-1.427.25-.7.25-1.3.175-1.427-.075-.125-.275-.2-.575-.35z"/></svg>
                Order on WhatsApp
              </button>
            </div>

            {/* Trust Info */}
            <div className="bg-white rounded-2xl p-8 space-y-6 shadow-sm border border-primary/5">
              {[
                { icon: Truck, title: "Estimated Delivery", desc: "3-5 business days" },
                { icon: Sparkles, title: "Free Shipping", desc: "On orders above ₹1499" },
                { icon: RotateCcw, title: "7 Days Return", desc: "Easy returns & exchanges" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-[#f8f5f0] flex items-center justify-center text-primary/60 group-hover:bg-primary group-hover:text-white transition-all">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{item.title}</h4>
                    <p className="text-[10px] text-primary/40 font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Why Choose Us */}
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Why Choose Banaya Decor?</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Check, title: "Premium Quality" },
                  { icon: Check, title: "Sustainably Made" },
                  { icon: Check, title: "Secure Payments" },
                  { icon: Check, title: "100% Authentic" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                      <item.icon size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary/60">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        <section className="mt-24 pt-24 border-t border-primary/5">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif font-black text-primary uppercase tracking-tight">You may also like</h2>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-primary transition-colors border-b-2 border-gold pb-1">View Collection</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.slice(0, 4).map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
