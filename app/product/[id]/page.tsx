"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Sparkles,
  Share2
} from "lucide-react";
import { FEATURED_PRODUCTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const product = FEATURED_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif font-black text-charcoal">Masterpiece Not Found</h1>
          <Button onClick={() => router.push("/shop")} variant="outline" className="rounded-full px-8">
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  const images = [product.image, product.hoverImage || product.image];

  return (
    <div className="min-h-screen bg-warm-cream pt-24">
      <div className="container mx-auto px-6 md:px-12 pb-24">
        {/* ── Breadcrumbs ── */}
        <nav className="flex items-center gap-2 mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => router.push("/shop")} className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors">Shop</button>
          <ChevronRight size={12} className="text-charcoal/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">{product.category}</span>
          <ChevronRight size={12} className="text-charcoal/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* ── Image Gallery ── */}
          <div className="space-y-6">
            <motion.div 
              className="relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-charcoal/5 border border-charcoal/5 group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                priority
              />
              <div className="absolute top-6 left-6">
                <span className="bg-charcoal/80 backdrop-blur-md text-gold text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-gold/20">
                  {product.tag || "Heritage Piece"}
                </span>
              </div>
              <button className="absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:bg-gold hover:text-white transition-all shadow-xl">
                <Share2 size={16} />
              </button>
            </motion.div>
            
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    selectedImage === idx ? "border-gold shadow-lg scale-105" : "border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-px bg-gold" />
                <span className="text-[10px] tracking-[0.4em] text-gold uppercase font-black">{product.category}</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-serif font-black text-charcoal tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <p className="text-3xl font-black text-charcoal tracking-tighter">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                  <Star size={10} className="fill-gold text-gold" />
                  <span className="text-[10px] font-black text-gold">4.9 (48 Reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-charcoal/60 text-base font-light leading-relaxed max-w-xl italic">
              Experience the pinnacle of heritage craftsmanship. Each piece is meticulously hand-finished by master artisans using centuries-old techniques, ensuring a legacy that lasts for generations.
            </p>

            <div className="space-y-8">
              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-widest font-black text-charcoal/40">Quantity</span>
                <div className="flex items-center bg-white border border-charcoal/5 rounded-full p-1 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-warm-cream rounded-full transition-colors text-charcoal/40 hover:text-charcoal"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-charcoal">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-warm-cream rounded-full transition-colors text-charcoal/40 hover:text-charcoal"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-charcoal hover:bg-gold text-white font-black uppercase tracking-[0.2em] text-[10px] py-8 rounded-2xl transition-all duration-500 shadow-2xl shadow-charcoal/10 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <ShoppingBag size={18} />
                    Add to Sanctuary
                  </span>
                  <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>
                
                <Button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  variant="outline" 
                  className={`px-8 py-8 rounded-2xl border-charcoal/10 transition-all duration-500 group ${isWishlisted ? 'bg-gold/10 border-gold' : 'hover:bg-warm-cream'}`}
                >
                  <Heart size={18} className={isWishlisted ? "fill-gold text-gold" : "group-hover:text-gold transition-colors"} />
                </Button>
              </div>
            </div>

            {/* ── Features ── */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-charcoal/5">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-charcoal/5 flex items-center justify-center shadow-lg group hover:bg-gold transition-all duration-500">
                  <Truck size={20} className="text-gold group-hover:text-white transition-colors" />
                </div>
                <p className="text-[9px] uppercase tracking-widest font-black text-charcoal/40 leading-tight">Royal<br/>Shipping</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-charcoal/5 flex items-center justify-center shadow-lg group hover:bg-gold transition-all duration-500">
                  <ShieldCheck size={20} className="text-gold group-hover:text-white transition-colors" />
                </div>
                <p className="text-[9px] uppercase tracking-widest font-black text-charcoal/40 leading-tight">2 Year<br/>Warranty</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-charcoal/5 flex items-center justify-center shadow-lg group hover:bg-gold transition-all duration-500">
                  <RotateCcw size={20} className="text-gold group-hover:text-white transition-colors" />
                </div>
                <p className="text-[9px] uppercase tracking-widest font-black text-charcoal/40 leading-tight">Easy<br/>Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-32">
          <div className="flex items-center justify-center gap-12 mb-12 border-b border-charcoal/5">
            {["details", "craftsmanship", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] uppercase tracking-[0.3em] font-black pb-6 transition-all relative ${
                  activeTab === tab ? "text-gold" : "text-charcoal/30 hover:text-charcoal"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="product-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                )}
              </button>
            ))}
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {activeTab === "details" && (
                  <>
                    <p className="text-charcoal/60 text-lg font-light leading-relaxed">
                      Our {product.name} is a testament to timeless design. Meticulously engineered for both comfort and aesthetic grandeur, it features solid teak wood construction, premium upholstery fabrics, and hand-carved detailing that reflects India's rich artistic heritage.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left mt-8">
                      <div className="p-6 bg-white rounded-2xl border border-charcoal/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-2">Dimensions</p>
                        <p className="text-sm font-bold text-charcoal">72" W x 34" D x 30" H</p>
                      </div>
                      <div className="p-6 bg-white rounded-2xl border border-charcoal/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-2">Materials</p>
                        <p className="text-sm font-bold text-charcoal">Solid Teak, Velvet, Brass</p>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "craftsmanship" && (
                  <div className="space-y-8">
                    <Sparkles className="mx-auto text-gold h-8 w-8" />
                    <p className="text-charcoal/60 text-lg font-light leading-relaxed">
                      Every Banaya piece tells a story. From the selection of premium woods to the final hand-polishing with natural oils, our artisans spend over 120 hours on each {product.name}. We combine traditional joinery methods with modern ergonomics to create pieces that are truly functional art.
                    </p>
                  </div>
                )}
                {activeTab === "shipping" && (
                  <p className="text-charcoal/60 text-lg font-light leading-relaxed">
                    We offer complimentary white-glove delivery across major metropolitan areas. Our specialized heritage transport team ensures your piece arrives in pristine condition. Delivery typically takes 2-3 weeks as each order is inspected and prepared for travel.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
