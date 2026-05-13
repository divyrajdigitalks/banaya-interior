"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Ticket, Check, X, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/ui/back-button";
import { useStore } from "@/context/StoreContext";
import { buildImageUrl } from "@/lib/api";
import { couponService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { type CartItem } from "@/lib/api/services/cart.service";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const { toast } = useToast();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    try {
      const response = await couponService.validateCoupon(couponCode, subtotal);
      if (response.success) {
        setDiscount(response.data.discount);
        setAppliedCoupon(response.data);
        toast({
          title: "Coupon Applied",
          description: `Coupon "${response.data.code}" applied successfully!`,
        });
      } else {
        toast({
          title: "Coupon Error",
          description: response.error || "Invalid coupon code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Coupon Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutItems([...cart]);
    setCheckoutTotal(total);
    setCheckoutDiscount(discount);
    setShowConfirm(true);
  };

  const handleConfirmCheckout = async () => {
    if (checkoutItems.length === 0) return;
    setShowConfirm(false);
    setIsCheckingOut(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await clearCart();
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponCode("");
      setShowSuccess(true);
      toast({
        title: "Purchase Successful!",
        description: `${checkoutItems.length} item${checkoutItems.length > 1 ? 's' : ''} purchased successfully!`,
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to complete purchase",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdf9f3]">
      <Header variant="light" />
      
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* ── Left: Cart Items ── */}
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <BackButton className="mb-4" />
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
                        className="group relative flex flex-col sm:flex-row items-start gap-6 bg-white p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500"
                      >
                        {/* Image */}
                        <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-[#fdf9f3] shrink-0">
                          <Image
                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : buildImageUrl(item.product.image)) : ""}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-4 w-full">
                          {/* Category & Subcategory */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-gold tracking-tight uppercase px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                              {typeof item.product?.category === 'object' ? (item.product.category as any).name : (item.product?.category || "Decor")}
                            </span>
                            {item.product?.subcategoryId && (
                              <>
                                <span className="text-primary/20">•</span>
                                <span className="text-[10px] font-bold text-primary/50 tracking-tight uppercase px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                                  {typeof item.product?.subcategoryId === 'object' ? (item.product.subcategoryId as any).name : "Product"}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Product Name */}
                          <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-primary leading-tight">{item.product?.name}</h3>
                            {item.product?.description && (
                              <p className="text-sm text-primary/40 line-clamp-2">{item.product.description}</p>
                            )}
                          </div>

                          {/* Price & Quantity Section */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Unit Price</p>
                              <p className="text-xl font-black text-primary">₹{(item.product?.price || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Total</p>
                              <p className="text-xl font-black text-gold">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-4 bg-[#fdf9f3] rounded-full p-2 border border-primary/5">
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-primary/40 hover:text-primary transition-all shadow-sm"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-sm font-black w-6 text-center text-primary">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-primary/40 hover:text-primary transition-all shadow-sm"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.product?._id)}
                              className="p-3 text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
                            >
                              <Trash2 size={20} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
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
                      {discount > 0 && appliedCoupon && (
                        <div className="space-y-2 p-4 bg-gold/15 border border-gold/30 rounded-2xl">
                          <div className="flex justify-between text-sm text-gold">
                            <span className="font-bold flex items-center gap-2">
                              <Ticket size={14} /> {appliedCoupon.code}
                            </span>
                            <span className="font-bold">
                              {appliedCoupon.discountType === 'percentage' 
                                ? `${appliedCoupon.discountAmount}% OFF` 
                                : `₹${appliedCoupon.discountAmount}`}
                            </span>
                          </div>
                          <div className="text-[10px] text-gold/60 font-medium">
                            Discount: -₹{discount.toLocaleString()}
                          </div>
                          {appliedCoupon.minPurchase > 0 && (
                            <div className="text-[10px] text-gold/40 font-medium">
                              Min. Purchase: ₹{appliedCoupon.minPurchase.toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="h-px bg-white/10 w-full" />
                      <div className="flex justify-between items-end">
                        <span className="text-white/50 text-xs font-bold tracking-tight">Total Investment</span>
                        <span className="text-3xl font-black text-gold">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Coupon Input Section */}
                    <div className="space-y-4 pt-4 relative z-10">
                      {!appliedCoupon ? (
                        <div className="relative group">
                          <input 
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter Promo Code"
                            className="w-full h-14 pl-6 pr-24 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold placeholder:text-white/20 focus:bg-white/10 focus:border-gold/50 transition-all outline-none"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            disabled={isApplying || !couponCode}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-gold text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white disabled:opacity-50 disabled:hover:bg-gold transition-all"
                          >
                            {isApplying ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-gold/10 border border-gold/20 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-primary">
                              <Check size={16} strokeWidth={3} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gold">{appliedCoupon.code}</p>
                              <p className="text-[8px] text-white/40 font-bold">Coupon Applied Successfully</p>
                            </div>
                          </div>
                          <button 
                            onClick={removeCoupon}
                            className="p-2 text-white/20 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut || cart.length === 0}
                      className="group w-full py-6 bg-gold text-primary text-xs font-black tracking-tight rounded-2xl hover:bg-white transition-all duration-500 shadow-2xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span className="relative z-10">Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Secure Checkout</span>
                          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </>
                      )}
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
      
      {/* ── Confirm Checkout Modal ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg w-full space-y-6 shadow-2xl"
            >
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <ShoppingCart size={28} />
                </div>
                <h3 className="text-2xl font-black text-primary">Confirm Your Order</h3>
                <p className="text-sm text-primary/60">
                  You are about to purchase {checkoutItems.length} item{checkoutItems.length > 1 ? 's' : ''}. Please confirm to complete checkout and clear your cart.
                </p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={handleConfirmCheckout}
                  className="w-full py-4 bg-gold text-primary text-xs font-black tracking-tight rounded-2xl hover:bg-gold/90 transition-all"
                >
                  Confirm Purchase
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 bg-white border border-primary/10 text-primary text-xs font-black rounded-2xl hover:bg-primary/5 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full space-y-6 shadow-2xl"
            >
              {/* Success Icon */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 size={48} className="text-gold" strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-primary">Purchase Successful!</h3>
                <p className="text-primary/50 text-sm">Your order has been confirmed</p>
              </div>

              {/* Order Details */}
              <div className="space-y-4 p-6 bg-[#fdf9f3] rounded-2xl border border-primary/5">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/60 font-medium">Items Purchased</span>
                  <span className="font-black text-primary">{checkoutItems.length} Product{checkoutItems.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/60 font-medium">Total Amount</span>
                  <span className="font-black text-gold">₹{checkoutTotal.toLocaleString()}</span>
                </div>
                {checkoutDiscount > 0 && (
                  <div className="flex justify-between text-sm border-t border-primary/10 pt-3">
                    <span className="text-primary/60 font-medium flex items-center gap-2">
                      <Ticket size={14} /> Savings
                    </span>
                    <span className="font-black text-green-600">₹{checkoutDiscount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Product List */}
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Purchased Items:</p>
                {checkoutItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-primary/5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{item.product?.name}</p>
                      <p className="text-[10px] text-primary/40">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-gold whitespace-nowrap ml-2">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Link href="/shop" className="flex-1">
                  <button className="w-full py-4 bg-primary/5 border border-primary/10 text-primary text-xs font-black rounded-2xl hover:bg-primary/10 transition-all">
                    Continue Shopping
                  </button>
                </Link>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 py-4 bg-gold text-primary text-xs font-black rounded-2xl hover:bg-gold/90 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </main>
  );
}
