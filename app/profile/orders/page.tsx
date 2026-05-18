"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  ChevronRight, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Banknote,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderService, type Order } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/common/back-button";

export default function UserOrdersPage() {
  const router = useRouter();
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-gold bg-gold/5 border-gold/10';
      case 'Processing': return 'text-blue-500 bg-blue-500/5 border-blue-500/10';
      case 'Shipped': return 'text-purple-500 bg-purple-500/5 border-purple-500/10';
      case 'Delivered': return 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10';
      case 'Cancelled': return 'text-red-500 bg-red-500/5 border-red-500/10';
      default: return 'text-charcoal/40 bg-charcoal/5 border-charcoal/10';
    }
  };

  if (loading) {
    return (
      <div>
        <Header variant="light" />
        <div className="min-h-screen pt-40 pb-20 bg-[#fdf9f3] flex items-center justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Loading your masterpieces...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header variant="light" />
      <div className="min-h-screen pt-40 pb-20 bg-[#fdf9f3]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mx-auto space-y-12">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[3rem] border border-charcoal/10 bg-linear-to-br from-[#fffdf8] via-white to-[#fff7e7] p-8 md:p-10 shadow-2xl shadow-charcoal/10">
              <div className="pointer-events-none absolute -right-24 top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
              <div className="pointer-events-none absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                  <BackButton />
                  <h1 className="font-serif text-4xl md:text-5xl text-primary font-black leading-tight">
                    My <span className="font-light text-gold">Order</span>
                  </h1>
                  <p className="max-w-2xl text-sm text-primary/70">
                    A curated overview of every purchase, status, and detail in one elegant place.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 w-full lg:w-auto">
                  <div className="rounded-3xl border border-charcoal/10 bg-white/90 p-5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Orders</p>
                    <p className="mt-3 text-3xl font-black text-primary">{orders.length}</p>
                  </div>
                  <div className="rounded-3xl border border-charcoal/10 bg-white/90 p-5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Total Spent</p>
                    <p className="mt-3 text-3xl font-black text-gold">₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl border border-charcoal/10 bg-white/90 p-5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Latest Status</p>
                    <p className="mt-3 text-sm font-black text-primary">
                      {orders[0]?.status || "No orders yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map((order, idx) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="overflow-hidden rounded-[2.5rem] border border-charcoal/10 bg-white shadow-xl shadow-charcoal/5 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="p-8 md:p-10 space-y-8">
                      {/* Order Meta */}
                      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] lg:grid-cols-[1.5fr_1fr]">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="rounded-3xl bg-[#fff8e8] border border-gold/10 p-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/40">Order Reference</p>
                            <p className="mt-3 text-sm font-black text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="rounded-3xl bg-[#eef6ff] border border-blue-100 p-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/40">Ordered On</p>
                            <p className="mt-3 text-sm font-black text-charcoal">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                          <div className="rounded-3xl border border-charcoal/10 p-5 flex flex-col justify-between">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/40">Status</p>
                            <span className={`mt-3 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="rounded-3xl bg-[#f9fafb] border border-charcoal/10 p-5 text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/40">Investment</p>
                            <p className="mt-3 text-xl font-black text-charcoal flex items-center justify-end gap-1">
                              <IndianRupee size={16} className="text-gold" />
                              {order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address & Payment Method */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dashed border-charcoal/10">
                        <div className="flex items-start gap-3">
                          <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-black text-charcoal/30 uppercase tracking-[0.2em]">Shipping Destination</p>
                            <p className="text-xs font-bold text-charcoal">{order.shippingAddress?.name || user?.name} ({order.shippingAddress?.phone || (user as any)?.mobile})</p>
                            <p className="text-[11px] text-charcoal/60 leading-relaxed">
                              {order.shippingAddress?.address ? (
                                `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                              ) : (
                                "No Shipping Address Stored"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 md:justify-end md:text-right">
                          {order.paymentMethod === 'COD' ? (
                            <>
                              <div className="space-y-0.5 md:order-1">
                                <p className="text-[8px] font-black text-charcoal/30 uppercase tracking-[0.2em]">Payment Mode</p>
                                <p className="text-xs font-black text-gold uppercase tracking-wider">Cash on Delivery</p>
                                <p className="text-[10px] text-charcoal/40 font-bold uppercase">
                                  {order.paymentStatus === 'Paid' ? 'Paid ✓' : 'Pay on Delivery'}
                                </p>
                              </div>
                              <Banknote size={14} className="text-gold shrink-0 mt-0.5 md:order-2" />
                            </>
                          ) : (
                            <>
                              <div className="space-y-0.5 md:order-1">
                                <p className="text-[8px] font-black text-charcoal/30 uppercase tracking-[0.2em]">Payment Mode</p>
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-wider">Paid Online</p>
                                <p className="text-[10px] text-charcoal/40 font-bold uppercase">Verified via Razorpay</p>
                              </div>
                              <CreditCard size={14} className="text-emerald-600 shrink-0 mt-0.5 md:order-2" />
                            </>
                          )}
                        </div>
                      </div>

                      <div className="h-px bg-charcoal/5" />

                      {/* Items */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="group flex gap-4 rounded-3xl border border-charcoal/10 bg-neutral-50 p-4 transition-all duration-300 hover:border-gold/20">
                            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm">
                              <img src={item.product?.image} alt={item.product?.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-black text-charcoal leading-tight line-clamp-2">{item.product?.name}</p>
                              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">Qty: {item.quantity}</p>
                              {item.personalization?.name && (
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-gold">
                                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                  Personalized
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-charcoal/5 shadow-xl shadow-charcoal/5">
                  <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-charcoal/5">
                    <ShoppingBag size={40} className="text-charcoal/10" />
                  </div>
                  <h3 className="text-2xl font-serif font-black text-charcoal">No orders yet</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-charcoal/30 mt-3 max-w-xs mx-auto leading-relaxed">
                    Your collection is waiting to be started. Explore our shop for masterpieces.
                  </p>
                  <Button
                    onClick={() => router.push("/shop")}
                    className="mt-10 bg-charcoal text-white hover:bg-gold px-12 py-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all"
                  >
                    Start Shopping
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
