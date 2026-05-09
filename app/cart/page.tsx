"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useStore } from "@/context/StoreContext";
import { buildImageUrl } from "@/lib/api";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#fdf9f3]">
      <Header variant="light" />
      
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* ── Left: Cart Items ── */}
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <h1 className="font-serif text-5xl md:text-6xl text-primary font-black leading-tight">
                  Your <span className="italic font-light text-gold">Treasures.</span>
                </h1>
                <p className="text-primary/50 text-sm tracking-tight font-bold">
                  {cart.length} Pieces in your sanctuary
                </p>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative flex flex-col sm:flex-row items-center gap-8 bg-white p-6 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500"
                      >
                        {/* Image */}
                        <div className="relative w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-[#fdf9f3] shrink-0">
                          <Image
                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : buildImageUrl(item.product.image)) : ""}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-4 text-center sm:text-left">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gold tracking-tight">
                              {typeof item.product?.category === 'object' ? (item.product.category as any).name : (item.product?.category || "Decor")}
                            </span>
                            <h3 className="text-xl font-bold text-primary">{item.product?.name}</h3>
                          </div>
                          
                          <div className="flex items-center justify-center sm:justify-start gap-6">
                            <div className="flex items-center gap-4 bg-[#fdf9f3] rounded-full p-1 border border-primary/5">
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-primary/40 hover:text-primary transition-all shadow-sm"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-primary/40 hover:text-primary transition-all shadow-sm"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <span className="text-lg font-black text-primary">
                              ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product?._id)}
                          className="sm:absolute top-6 right-6 p-4 text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
                        >
                          <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 space-y-8 bg-white rounded-[3rem] border border-dashed border-primary/10">
                      <div className="w-20 h-20 bg-[#fdf9f3] rounded-full flex items-center justify-center mx-auto text-primary/10">
                        <ShoppingBag size={40} strokeWidth={1} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-primary">Your cart is empty</h3>
                        <p className="text-primary/40 text-sm max-w-xs mx-auto">
                          It seems you haven't discovered your first treasure yet.
                        </p>
                      </div>
                      <Link href="/shop" className="inline-block">
                        <button className="px-10 py-5 bg-primary text-white text-xs font-bold tracking-tight rounded-full hover:bg-gold transition-all shadow-xl shadow-primary/10">
                          Start Exploring
                        </button>
                      </Link>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {cart.length > 0 && (
                <Link href="/shop" className="inline-flex items-center gap-3 text-xs font-bold tracking-tight text-primary/40 hover:text-gold transition-colors">
                  <ArrowLeft size={14} /> Continue Collecting
                </Link>
              )}
            </div>

            {/* ── Right: Order Summary ── */}
            {cart.length > 0 && (
              <div className="lg:w-[400px] shrink-0">
                <div className="sticky top-48 space-y-8">
                  <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/20 space-y-10 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    
                    <h2 className="text-2xl font-serif font-black tracking-tight relative z-10">
                      Order <span className="italic font-light text-gold/80">Summary</span>
                    </h2>

                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50 font-medium">Subtotal</span>
                        <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50 font-medium">Royal Delivery</span>
                        <span className="font-bold">₹{shipping.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-white/10 w-full" />
                      <div className="flex justify-between items-end">
                        <span className="text-white/50 text-xs font-bold tracking-tight">Total Investment</span>
                        <span className="text-3xl font-black text-gold">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <button className="group w-full py-6 bg-gold text-primary text-xs font-black tracking-tight rounded-2xl hover:bg-white transition-all duration-500 shadow-2xl relative overflow-hidden">
                      <span className="relative z-10">Secure Checkout</span>
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>

                    <div className="pt-4 flex items-center justify-center gap-6 opacity-30">
                      <div className="w-10 h-6 bg-white rounded-md" />
                      <div className="w-10 h-6 bg-white rounded-md" />
                      <div className="w-10 h-6 bg-white rounded-md" />
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-3xl border border-primary/5 text-center space-y-2">
                      <p className="text-xs font-black text-primary tracking-tight">Safe Delivery</p>
                      <p className="text-[9px] text-primary/40 leading-relaxed">Insured premium shipping across India</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-primary/5 text-center space-y-2">
                      <p className="text-xs font-black text-primary tracking-tight">Authentic</p>
                      <p className="text-[9px] text-primary/40 leading-relaxed">Handcrafted by master artisans</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
