"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Ticket, Check, X, Loader2, CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/ui/back-button";
import { useStore } from "@/context/StoreContext";
import { buildImageUrl, orderService } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { couponService } from "@/lib/api";
import { toast } from "sonner";
import { type CartItem } from "@/lib/api/services/cart.service";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const { user } = useUser();

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

  // Address and COD State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.name || "",
        phone: (user as any).mobile || (user as any).phone || ""
      }));
    }
  }, [user]);

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
        toast.success(`Coupon "${response.data.code}" applied successfully!`);
      } else {
        toast.error(response.error || "This coupon is not valid.");
      }
    } catch (error: any) {
      console.error("Coupon Error:", error);
      const errorMsg = error.response?.data?.error || "Failed to apply coupon. It might be expired or invalid.";
      toast.error(errorMsg);
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
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }
    setCheckoutItems([...cart]);
    setCheckoutTotal(total);
    setCheckoutDiscount(discount);
    setShowCheckoutModal(true);
  };

  const executeCheckout = async () => {
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error("Please fill all shipping details");
      return;
    }

    setIsCheckingOut(true);

    try {
      if (paymentMethod === 'COD') {
        const response = await orderService.createOrder({
          shippingAddress,
          totalAmount: total,
          // Add other necessary fields if required by your backend
        });

        if (response.success) {
          await clearCart();
          setDiscount(0);
          setAppliedCoupon(null);
          setCouponCode('');
          setShowCheckoutModal(false);
          setShowSuccess(true);
          toast.success('Order placed successfully (COD)!');
        } else {
          throw new Error(response.error || 'Failed to place order');
        }
      } else {
        // Razorpay Payment Flow
        const razorpayData = await orderService.createRazorpayOrder(total);
        if (!razorpayData.success) throw new Error('Failed to create payment order');

        const rzpOrder = razorpayData.data;

        const loadScript = () =>
          new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });

        const loaded = await loadScript();
        if (!loaded) throw new Error('Razorpay SDK failed to load');

        const options = {
          key: rzpOrder.key,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'Banaya Interiors',
          description: `Order for ${cart.length} item(s)`,
          order_id: rzpOrder.id,
          prefill: {
            name: shippingAddress.name,
            email: user?.email || '',
            contact: shippingAddress.phone,
          },
          theme: { color: '#d4af37' },
          handler: async (response: any) => {
            try {
              const verifyRes = await orderService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                totalAmount: total,
                couponCode: appliedCoupon?.code || undefined,
                discountAmount: discount || 0,
                shippingAddress: shippingAddress
              });

              if (verifyRes.success) {
                await clearCart();
                setDiscount(0);
                setAppliedCoupon(null);
                setCouponCode('');
                setShowCheckoutModal(false);
                setShowSuccess(true);
                toast.success('Payment successful! Order placed.');
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (err: any) {
              toast.error(err?.response?.data?.error || 'Payment verification failed');
            } finally {
              setIsCheckingOut(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsCheckingOut(false);
              toast.error('Payment cancelled');
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast.error(error.message || 'Failed to process checkout');
      setIsCheckingOut(false);
    }
  };


  return (
    <main className="min-h-screen bg-[#fdf9f3]">
      <Header variant="light" />
      
      <div className="container mx-auto px-4 sm:px-6 pt-40 pb-32">
        <div className="mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* ── Left: Cart Items ── */}
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <BackButton className="mb-4" />
                <h1 className="font-serif text-4xl md:text-5xl text-primary font-black leading-tight">
                  Your <span className="font-light text-gold">Treasures.</span>
                </h1>
                <p className="text-primary/60 text-xs font-bold uppercase tracking-widest">
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in your collection
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-[2.5rem] border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {/* Image */}
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 overflow-hidden rounded-3xl border border-primary/10 bg-[#fdf9f3] shadow-inner">
                          <Image
                            src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : buildImageUrl(item.product.image)) : ""}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gold">
                                {typeof item.product?.category === 'object' && item.product.category?.name
                                  ? `${item.product.category.name}${typeof item.product.subcategory === 'object' && item.product.subcategory?.name ? ` / ${item.product.subcategory.name}` : ''}`
                                  : (item.product?.category || "Decor")}
                              </span>
                              <h3 className="text-xl font-bold text-primary tracking-tight">{item.product?.name}</h3>
                            </div>
                            <p className="text-lg font-black text-primary">₹{(item.product?.price || 0).toLocaleString()}</p>
                          </div>

                          {/* Personalization Preview */}
                          {item.personalization?.name && (
                            <div className="mt-3 p-3 bg-[#fdf9f3] rounded-xl border border-primary/5 inline-block self-start">
                              <p className="text-[9px] font-black text-gold uppercase tracking-widest mb-1">Personalization</p>
                              <p className="text-xs font-medium text-primary/70">{item.personalization.name}</p>
                            </div>
                          )}

                          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3 rounded-3xl border border-primary/10 bg-neutral-50 p-2 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-primary/70 transition-all hover:bg-white hover:text-primary"
                              >
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <span className="text-xs font-black text-primary w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => {
                                  const stock = (item.product as any)?.stock;
                                  if (stock !== undefined && item.quantity >= stock) {
                                    toast.error(`Only ${stock} item(s) available in stock`);
                                    return;
                                  }
                                  updateQuantity(item.product?._id, item.quantity + 1);
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-primary/70 transition-all hover:bg-white hover:text-primary"
                              >
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product?._id)}
                              className="rounded-2xl border border-primary/10 bg-white p-2 text-primary/60 transition-colors hover:border-red-200 hover:text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-24 space-y-8 bg-white rounded-[3rem] border border-dashed border-primary/10 shadow-xl shadow-charcoal/10">
                      <div className="w-20 h-20 bg-[#fdf9f3] rounded-full flex items-center justify-center mx-auto text-primary/30 shadow-inner">
                        <ShoppingBag size={40} strokeWidth={1} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-primary">Your cart is empty</h3>
                        <p className="text-primary/60 text-sm max-w-xs mx-auto">
                          Discover our handcrafted treasures for your sanctuary.
                        </p>
                      </div>
                      <Link href="/shop" className="inline-block">
                        <button className="px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gold transition-all shadow-xl shadow-primary/10">
                          Start Exploring
                        </button>
                      </Link>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {cart.length > 0 && (
                <Link href="/shop" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-gold transition-colors">
                  <ArrowLeft size={14} /> Continue Shopping
                </Link>
              )}
            </div>

            {/* ── Order Summary ── */}
            {cart.length > 0 && (
              <div className="lg:w-100 shrink-0">
                <div className="sticky top-32 space-y-6">
                  <div className="rounded-[2.5rem] border border-primary/10 bg-linear-to-br from-white via-[#fff9f1] to-[#fef3d6] p-8 sm:p-10 shadow-2xl shadow-primary/10 space-y-8">
                    <h2 className="text-2xl font-serif font-medium text-primary tracking-tight">
                      Order <span className="italic font-light text-gold">Summary</span>
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary/60 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                        <span className="font-bold text-primary">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-primary/60 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                        <span className="font-bold text-primary">₹{shipping.toLocaleString()}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-gold">
                          <span className="font-bold uppercase tracking-widest text-[10px]">Discount</span>
                          <span className="font-bold">-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="h-px bg-primary/10 w-full my-2" />
                      
                      <div className="flex justify-between items-end">
                        <span className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em]">Total</span>
                        <span className="text-3xl font-bold text-primary tracking-tighter">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Coupon Input */}
                    <div className="pt-4">
                      {!appliedCoupon ? (
                        <div className="relative">
                          <input 
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="COUPON CODE"
                            className="w-full h-14 pl-5 pr-24 bg-neutral-50 border border-primary/10 rounded-2xl text-[10px] font-black tracking-widest placeholder:text-primary/30 focus:bg-white focus:border-gold/50 transition-all outline-none uppercase"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            disabled={isApplying || !couponCode}
                            className="absolute right-1.5 top-1.5 h-11 px-6 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gold disabled:opacity-50 transition-all"
                          >
                            {isApplying ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Ticket size={16} className="text-gold" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gold">{appliedCoupon.code}</p>
                              <p className="text-[8px] text-primary/60 font-bold uppercase">Applied Successfully</p>
                            </div>
                          </div>
                          <button onClick={removeCoupon} className="text-primary/40 hover:text-red-400">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                      className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gold transition-all duration-300 shadow-xl shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-3xl border border-primary/5 text-center space-y-1 shadow-sm">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Safe Delivery</p>
                      <p className="text-[8px] text-primary/40 font-medium">Insured shipping India-wide</p>
                    </div>
                    <div className="p-5 bg-white rounded-3xl border border-primary/5 text-center space-y-1 shadow-sm">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Authentic</p>
                      <p className="text-[8px] text-primary/40 font-medium">Handcrafted Artisan Pieces</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirm modal removed – Razorpay handles confirmation */}

      {/* ── Checkout & Address Dialog Box ── */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] p-8 md:p-10 max-w-2xl w-full space-y-6 shadow-2xl border border-primary/5 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-primary/10 pb-4">
                <div>
                  <h3 className="text-2xl font-serif font-black text-primary">Checkout Details</h3>
                  <p className="text-[9px] uppercase tracking-widest font-black text-gold mt-1">Specify Delivery & Payment</p>
                </div>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-primary/40 hover:text-primary transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Shipping Address Fields */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-widest">1. Shipping Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      placeholder="Receiver's Name"
                      className="w-full h-12 px-4 bg-neutral-50 border border-primary/10 rounded-xl text-xs font-bold text-primary focus:bg-white focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="text" 
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      placeholder="10-digit Phone"
                      className="w-full h-12 px-4 bg-neutral-50 border border-primary/10 rounded-xl text-xs font-bold text-primary focus:bg-white focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">Street Address</label>
                    <input 
                      type="text" 
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      placeholder="Flat, House no., Building, Apartment, Street name"
                      className="w-full h-12 px-4 bg-neutral-50 border border-primary/10 rounded-xl text-xs font-bold text-primary focus:bg-white focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="City"
                      className="w-full h-12 px-4 bg-neutral-50 border border-primary/10 rounded-xl text-xs font-bold text-primary focus:bg-white focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">State</label>
                        <input 
                          type="text" 
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          placeholder="State"
                          className="w-full h-12 px-4 bg-neutral-50 border border-primary/10 rounded-xl text-xs font-bold text-primary focus:bg-white focus:border-gold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">Pincode</label>
                        <input 
                          type="text" 
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                          placeholder="6-digits"
                          className="w-full h-12 px-4 bg-neutral-50 border border-primary/10 rounded-xl text-xs font-bold text-primary focus:bg-white focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-widest">2. Payment Method</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'Razorpay' 
                        ? 'border-gold bg-gold/5 text-primary shadow-lg shadow-gold/5' 
                        : 'border-primary/10 hover:border-gold/40 text-primary/60 bg-white'
                    }`}
                  >
                    <CreditCard size={20} className={paymentMethod === 'Razorpay' ? 'text-gold' : 'text-primary/40'} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider">Pay Online</p>
                      <p className="text-[8px] font-bold text-primary/40 mt-0.5">UPI, Cards, NetBanking</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'COD' 
                        ? 'border-gold bg-gold/5 text-primary shadow-lg shadow-gold/5' 
                        : 'border-primary/10 hover:border-gold/40 text-primary/60 bg-white'
                    }`}
                  >
                    <ShoppingBag size={20} className={paymentMethod === 'COD' ? 'text-gold' : 'text-primary/40'} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider">Cash On Delivery</p>
                      <p className="text-[8px] font-bold text-primary/40 mt-0.5">Pay cash on delivery</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Total Review */}
              <div className="p-4 bg-[#fdf9f3] rounded-2xl border border-primary/5 flex justify-between items-center text-sm font-bold text-primary">
                <span className="uppercase text-[9px] tracking-widest text-primary/60">Final Investment</span>
                <span className="text-xl text-gold">₹{total.toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-4 border border-primary/10 text-primary/60 hover:text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeCheckout}
                  disabled={isCheckingOut}
                  className="flex-1 py-4 bg-primary hover:bg-gold text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{paymentMethod === 'COD' ? 'Place COD Order' : 'Pay via Razorpay'}</span>
                  )}
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
