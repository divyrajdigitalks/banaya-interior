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
  ArrowLeft
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
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <BackButton />
                <h1 className="text-4xl md:text-5xl font-sans font-black text-charcoal tracking-tight uppercase">
                  My <span className="text-gold">Orders</span>
                </h1>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white border border-charcoal/5 rounded-2xl shadow-xl shadow-charcoal/5">
                <Package size={20} className="text-gold" />
                <span className="text-sm font-bold text-charcoal">{orders.length} Orders Total</span>
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
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2.5rem] border border-charcoal/5 overflow-hidden shadow-xl shadow-charcoal/5 hover:shadow-2xl transition-all duration-500 group"
                  >
                    <div className="p-8 md:p-10 space-y-8">
                      {/* Order Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em]">Order Reference</p>
                          <p className="text-sm font-bold text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em]">Ordered On</p>
                          <p className="text-sm font-bold text-charcoal">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em]">Status</p>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em]">Investment</p>
                          <p className="text-xl font-black text-charcoal flex items-center justify-end gap-1">
                            <IndianRupee size={16} className="text-gold" />
                            {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-charcoal/5" />

                      {/* Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-6 p-4 rounded-3xl bg-neutral-50 border border-charcoal/5 group/item hover:border-gold/20 transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-white border border-charcoal/5 overflow-hidden flex-shrink-0 shadow-sm">
                              <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 py-1">
                              <p className="text-xs font-bold text-charcoal leading-tight line-clamp-2">{item.product?.name}</p>
                              <p className="text-[10px] font-bold text-charcoal/40 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                              {item.personalization?.name && (
                                <div className="mt-3 flex items-center gap-2">
                                  <div className="w-1 h-4 bg-gold rounded-full" />
                                  <span className="text-[9px] font-black text-gold uppercase tracking-widest">Personalized</span>
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
