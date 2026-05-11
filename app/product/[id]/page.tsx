"use client";

import React, { useState, useEffect } from "react";
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
  Check,
  Camera,
  FileText,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productService, type Product } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

import { useStore } from "@/context/StoreContext";
import { useUser } from "@/context/UserContext";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [manualRelated, setManualRelated] = useState<Product[]>([]);
  const [autoRelated, setAutoRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedImageSize] = useState("Medium (16 x 10 in)");
  const [activeTab, setActiveTab] = useState("Description");
  
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        setLoading(true);
        try {
          const foundProduct = await productService.getProduct(id);
          
          if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.sizes?.length > 0) {
              setSelectedImageSize(foundProduct.sizes[0]);
            }
            
            // Get related products from API
            const related = await productService.getRelatedProducts(id);
            setManualRelated(related.manual);
            setAutoRelated(related.automatic);
          }
        } catch (error) {
          console.error("Failed to load product details", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id]);

  const handleAddAllToCart = async () => {
    if (manualRelated.length === 0) return;
    setIsAdding(true);
    for (const item of manualRelated) {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: (item as any).category?.name || "Decor"
      }, 1);
    }
    setIsAdding(false);
  };


  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category?.name || "Decor"
    }, quantity);
    setIsAdding(false);
  };

  const toggleWishlist = async () => {
    if (!product) return;
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category?.name || "Decor"
      });
    }
  };

  
  // Personalisation State
  const [isPersonaliseOpen, setIsPersonaliseOpen] = useState(false);
  const [personalisation, setPersonalisation] = useState({
    name: "",
    description: "",
    image: null as string | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalisation(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
        <div className="text-center space-y-6">
          <p className="text-charcoal/40">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f3]">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif font-black text-primary">Masterpiece Not Found</h1>
          <Button onClick={() => router.push("/shop")} variant="outline" className="rounded-full px-8">
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  const images = [product.image, ...(product.subImages || [])].slice(0, 5);

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
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all shadow-xl ${
                  isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-primary hover:bg-gold hover:text-white"
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-white" : ""} />
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
              <div className="flex border-b border-primary/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {["Description", "Specifications", "Care Instructions", "Shipping & Returns"].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                      activeTab === tab ? "border-primary text-primary" : "border-transparent text-primary/40 hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-8 min-h-[200px]">
                <AnimatePresence mode="wait">
                  {activeTab === "Description" && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <p className="text-primary/70 text-sm leading-relaxed">
                        {product.description || `Serve in style with our ${product.name}, handcrafted from premium Sheesham wood. Perfect for serving snacks, tea, breakfast in bed or even for organizing your essentials with elegance.`}
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 border-b border-primary/5">
                        {(product.features || ["Elegant natural wood finish", "Sturdy handles for easy grip", "Multipurpose – serve, organize or display", "Food safe & easy to clean"]).map((feat: string) => (
                          <li key={feat} className="flex items-center gap-3 text-xs text-primary/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold" /> {feat}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === "Specifications" && (
                    <motion.div
                      key="specifications"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 gap-2">
                        {(product.specifications || [
                          { label: "Material", value: "Premium Sheesham Wood" },
                          { label: "Finish", value: "Food Safe Natural Oil" },
                          { label: "Origin", value: "Handcrafted in India" }
                        ]).map((spec: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between py-3 border-b border-primary/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{spec.label}</span>
                            <span className="text-xs font-bold text-primary">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Care Instructions" && (
                    <motion.div
                      key="care"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-primary/70 text-sm leading-relaxed">
                        {product.careInstructions || "Wipe with a soft damp cloth. Do not soak in water. Use mild soap if necessary and dry immediately. Apply food-grade oil occasionally to maintain the wood's natural luster."}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === "Shipping & Returns" && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-primary/70 text-sm leading-relaxed">
                        {product.shippingReturns || "Free shipping on all orders above ₹1499. Orders are usually dispatched within 24-48 hours. We offer a 7-day easy return policy for unused products in their original packaging."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bulk Purchase Link */}
                <div className="pt-8 border-t border-primary/5 mt-8">
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
                {/* People Also Shopped For - Manual Selections Only */}
                {manualRelated.length > 0 && (
                  <div className="mt-16 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-primary/40 uppercase tracking-[0.3em]">People Also Shopped For</h3>
                    </div>
                    
                    <div className="p-8 bg-white border border-primary/5 rounded-3xl shadow-sm">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 flex items-center justify-center md:justify-start gap-4 overflow-x-auto scrollbar-hide">
  {manualRelated.map((item, idx) => (
    <React.Fragment key={item.id}>
      <div className="min-w-[110px] max-w-[110px] space-y-3 text-center group flex-shrink-0">
        <Link href={`/product/${item.id || item._id}`}>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/5">
            <Image
              src={
                item.image.startsWith("http")
                  ? item.image
                  : buildImageUrl(item.image)
              }
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        <p className="text-[9px] font-bold text-primary/60 leading-tight line-clamp-1">
          {item.name}
        </p>

        <p className="text-[10px] font-black text-primary">
          ₹{item.price.toLocaleString()}
        </p>
      </div>

      {idx < manualRelated.length - 1 && (
        <div className="text-2xl text-primary/20 font-light flex-shrink-0">
          +
        </div>
      )}
    </React.Fragment>
  ))}
</div>

                        <div className="w-px h-24 bg-primary/5 hidden md:block" />

                        <div className="w-full md:w-56 space-y-4 text-center">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Bundle Price</p>
                            <p className="text-xl font-black text-primary">
                              ₹{manualRelated.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                            </p>
                          </div>
                          <button 
                            onClick={handleAddAllToCart}
                            disabled={isAdding}
                            className="w-full py-4 bg-[#4F3D31] hover:bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-primary/5 disabled:opacity-50"
                          >
                            {isAdding ? "Adding..." : `Add All ${manualRelated.length} To Cart`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                  {(product.sizes || ["Small (12 x 8 in)", "Medium (16 x 10 in)", "Large (18 x 12 in)"]).map((size: string) => (
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
                <button 
                  onClick={() => setIsPersonaliseOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-lg text-[10px] font-bold text-primary/60 hover:border-primary transition-all"
                >
                  <Plus size={14} /> ADD PERSONALISATION
                </button>
              </div>

              {/* Personalisation Dialog */}
              <Dialog open={isPersonaliseOpen} onOpenChange={setIsPersonaliseOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-black text-primary">
                      Add <span className="text-gold">Personalisation</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-6">
                    {/* Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Upload Reference Image</Label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="personalisation-image"
                        />
                        <label
                          htmlFor="personalisation-image"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/10 rounded-2xl cursor-pointer hover:border-gold/30 hover:bg-gold/5 transition-all group overflow-hidden"
                        >
                          {personalisation.image ? (
                            <div className="relative w-full h-full">
                              <Image 
                                src={personalisation.image} 
                                alt="Preview" 
                                fill 
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <Camera className="text-primary/20 group-hover:text-gold transition-colors mb-2" size={32} />
                              <span className="text-[10px] font-bold text-primary/40 uppercase">Click to upload image</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Name / Title</Label>
                      <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                        <Input 
                          placeholder="Enter name for engraving..."
                          value={personalisation.name}
                          onChange={(e) => setPersonalisation({ ...personalisation, name: e.target.value })}
                          className="pl-12 h-14 bg-[#f8f5f0] border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-gold/20"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Instructions</Label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 text-primary/20" size={16} />
                        <Textarea 
                          placeholder="Any specific instructions for the personalisation?"
                          value={personalisation.description}
                          onChange={(e) => setPersonalisation({ ...personalisation, description: e.target.value })}
                          className="pl-12 pt-4 min-h-[100px] bg-[#f8f5f0] border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-gold/20 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPersonaliseOpen(false)}
                      className="flex-1 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log("Personalisation saved:", personalisation);
                        setIsPersonaliseOpen(false);
                      }}
                      className="flex-1 h-14 bg-primary hover:bg-gold text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Save Details
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex gap-4 pt-4">
                <div className="flex items-center bg-[#f8f5f0] rounded-xl px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-primary/40 hover:text-primary transition-colors"><Minus size={16} /></button>
                  <span className="w-10 text-center font-black text-primary">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-primary/40 hover:text-primary transition-colors"><Plus size={16} /></button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-primary hover:bg-gold text-white font-black uppercase tracking-[0.2em] text-[10px] py-7 rounded-xl transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isAdding ? <Check size={18} /> : <ShoppingBag size={18} />}
                  {isAdding ? "Added to Cart" : "Add to Cart"}
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
            <h2 className="text-3xl font-serif font-black text-primary uppercase tracking-tight">
              You may also like
            </h2>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-primary transition-colors border-b-2 border-gold pb-1">View Collection</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {autoRelated.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                category={p.category?.name || "Decor"}
                price={p.price}
                image={p.image}
                rating={p.rating || 4.5}
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
