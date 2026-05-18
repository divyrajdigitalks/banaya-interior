"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  ExternalLink,
  ArrowLeft,
  IndianRupee,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Filter,
  User,
  Phone,
  MapPin,
  Mail,
  CreditCard,
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";
import { orderService, type Order, buildImageUrl } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { showSuccess, showError } = useAdminToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      showError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shippingAddress?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const success = await orderService.updateOrderStatus(id, newStatus);
      if (success) {
        showSuccess(`Order status updated to ${newStatus}`);
        loadOrders();
        if (selectedOrder?._id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (error) {
      showError("Failed to update status");
    }
  };

  const columns = [
    {
      header: "Order ID",
      accessorKey: "_id",
      cell: (item: Order) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">
          #{item._id.slice(-8)}
        </span>
      )
    },
    {
      header: "Customer",
      accessorKey: "user",
      cell: (item: Order) => (
        <div>
          <p className="font-bold text-charcoal">{item.user?.name || item.shippingAddress?.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail size={10} className="text-gold" />
            <p className="text-[9px] text-charcoal/40 font-medium uppercase tracking-widest">{item.user?.email || "No Email Provided"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Total",
      accessorKey: "totalAmount",
      cell: (item: Order) => (
        <div className="flex items-center gap-1 font-black text-charcoal">
          <IndianRupee size={12} className="text-gold" />
          {item.totalAmount.toLocaleString()}
        </div>
      )
    },
    {
      header: "Order Status",
      accessorKey: "status",
      cell: (item: Order) => (
        <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
          item.status === 'Pending' ? 'bg-gold/10 text-gold border-gold/20' : 
          item.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
          item.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
          item.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
          'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      cell: (item: Order) => (
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border w-fit ${
            (item as any).paymentStatus === 'Paid' 
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
              : (item as any).paymentStatus === 'Failed'
              ? 'bg-red-500/10 text-red-500 border-red-500/20'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
          }`}>
            {(item as any).paymentStatus === 'Paid' 
              ? <CheckCircle2 size={9} /> 
              : (item as any).paymentStatus === 'Failed'
              ? <XCircle size={9} />
              : <Clock size={9} />}
            {(item as any).paymentStatus || 'Pending'}
          </span>
          <span className="text-[8px] text-charcoal/40 font-bold uppercase tracking-wider">
            {item.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
          </span>
          {(item as any).razorpayPaymentId && (
            <span className="text-[8px] text-charcoal/30 font-mono truncate max-w-[100px]">
              {(item as any).razorpayPaymentId}
            </span>
          )}
        </div>
      )
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (item: Order) => (
        <span className="text-[10px] font-bold text-charcoal/40">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "_id",
      cell: (item: Order) => (
        <button 
          onClick={() => setSelectedOrder(item)}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-gold/5 text-gold border border-gold/10 hover:bg-gold hover:text-white transition-all"
        >
          <ExternalLink size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-white border border-charcoal/10"
          >
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal tracking-tight">Order Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage and track customer shop orders</p>
          </div>
        </div>
      </div>

      <AdminSearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search by order ID or name..."
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar w-full">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map(status => (
            <button 
              key={status} 
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === status 
                  ? "bg-charcoal text-white border-charcoal shadow-lg shadow-charcoal/10" 
                  : "bg-white border-charcoal/5 text-charcoal/40 hover:bg-neutral-50 hover:text-charcoal"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </AdminSearchHeader>

      <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredOrders} />
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl bg-white border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 border-b border-charcoal/5 bg-[#fdf9f3] relative">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold bg-gold/10 px-3 py-1 rounded-full">
                  Order Analyzer
                </span>
                <DialogTitle className="text-2xl font-serif font-black text-charcoal mt-2 tracking-tight">Invoice Review & Dispatch</DialogTitle>
                <p className="text-[10px] font-mono text-charcoal/40 mt-1 uppercase tracking-wider">Ref ID: {selectedOrder?._id.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  selectedOrder?.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                  selectedOrder?.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                  selectedOrder?.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                  selectedOrder?.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {selectedOrder?.status}
                </div>
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
                  (selectedOrder as any)?.paymentStatus === 'Paid' 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                    : (selectedOrder as any)?.paymentStatus === 'Failed'
                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}>
                  {(selectedOrder as any)?.paymentStatus === 'Paid' 
                    ? <CheckCircle2 size={11} className="text-emerald-600" /> 
                    : (selectedOrder as any)?.paymentStatus === 'Failed'
                    ? <XCircle size={11} className="text-red-500" />
                    : <Clock size={11} className="text-amber-600" />}
                  {(selectedOrder as any)?.paymentStatus || 'Payment Pending'}
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-8 overflow-y-auto max-h-[65vh] no-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Client Profile & Investment Info */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Client Profile Card */}
                <div className="p-6 rounded-[2rem] bg-neutral-50 border border-charcoal/5 space-y-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold text-lg font-black border border-gold/20 shadow-inner">
                      {(selectedOrder?.user?.name || selectedOrder?.shippingAddress?.name || "U")[0]}
                    </div>
                    <div>
                      <p className="text-base font-black text-charcoal">{selectedOrder?.user?.name || selectedOrder?.shippingAddress?.name}</p>
                      <p className="text-[8px] font-black text-gold uppercase tracking-[0.2em]">Client Profile</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-5 border-t border-charcoal/5">
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60 truncate">{selectedOrder?.user?.email || "No Email Provided"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60">{selectedOrder?.shippingAddress?.phone || selectedOrder?.user?.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-[11px] font-bold text-charcoal/60 leading-relaxed">
                        {selectedOrder?.shippingAddress?.address ? (
                          `${selectedOrder?.shippingAddress.address}, ${selectedOrder?.shippingAddress.city}, ${selectedOrder?.shippingAddress.state} - ${selectedOrder?.shippingAddress.pincode}`
                        ) : (
                          "No Shipping Address Stored"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment & Payment Mode Card */}
                <div className="p-6 rounded-[2rem] bg-charcoal text-white space-y-5 shadow-xl relative overflow-hidden">
                  {/* Decorative Gradient Flare */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gold/60 mb-0.5">Net Revenue</p>
                      <h2 className="text-3xl font-black text-gold font-serif">₹{selectedOrder?.totalAmount.toLocaleString()}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        (selectedOrder as any)?.paymentStatus === 'Paid'
                          ? 'bg-emerald-500 text-white'
                          : (selectedOrder as any)?.paymentStatus === 'Failed'
                          ? 'bg-red-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {(selectedOrder as any)?.paymentStatus === 'Paid'
                          ? <CheckCircle2 size={9} />
                          : <Clock size={9} />}
                        {(selectedOrder as any)?.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Payment Mode</p>
                      <p className="text-[11px] font-black text-gold uppercase tracking-wider">
                        {selectedOrder?.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                      </p>
                    </div>
                    
                    {(selectedOrder as any)?.razorpayPaymentId && (
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Razorpay Payment ID</p>
                        <p className="text-[9px] font-mono text-white/70 break-all">{(selectedOrder as any).razorpayPaymentId}</p>
                      </div>
                    )}
                    {(selectedOrder as any)?.razorpayOrderId && (
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Razorpay Order ID</p>
                        <p className="text-[9px] font-mono text-white/50 break-all">{(selectedOrder as any).razorpayOrderId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Manifest */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold flex items-center justify-between border-b border-charcoal/5 pb-2">
                  <span>Order Manifest</span>
                  <span className="text-charcoal/40 font-mono">{selectedOrder?.items?.length} Product{selectedOrder?.items && selectedOrder.items.length > 1 ? 's' : ''}</span>
                </h4>
                
                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder?.items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-charcoal/5 hover:border-gold/20 transition-all duration-300 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white border border-charcoal/5 overflow-hidden shrink-0 shadow-inner">
                          <img 
                            src={buildImageUrl(item.product?.image || item.product?.images?.[0])} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-xs font-black text-charcoal truncate">{item.product?.name}</p>
                            <p className="text-xs font-black text-charcoal">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-charcoal/5">
                            <p className="text-[9px] font-bold text-charcoal/40 uppercase tracking-wider">
                              ₹{item.price.toLocaleString()} × {item.quantity}
                            </p>
                            {item.personalization?.name && (
                              <span className="text-[8px] font-black text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10 uppercase tracking-widest">
                                Monogram: {item.personalization.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
          
          <DialogFooter className="p-6 border-t border-charcoal/10 bg-[#fdf9f3] flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 gap-3">
              <Button 
                onClick={() => updateStatus(selectedOrder!._id, "Processing")}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 disabled:opacity-30 disabled:shadow-none transition-all duration-300"
                disabled={selectedOrder?.status !== 'Pending'}
              >
                Accept Order
              </Button>
              <Button 
                onClick={() => updateStatus(selectedOrder!._id, "Shipped")}
                className="flex-1 bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/10 disabled:opacity-30 disabled:shadow-none transition-all duration-300"
                disabled={selectedOrder?.status !== 'Processing'}
              >
                Ship Order
              </Button>
              <Button 
                onClick={() => updateStatus(selectedOrder!._id, "Delivered")}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10 disabled:opacity-30 disabled:shadow-none transition-all duration-300"
                disabled={selectedOrder?.status !== 'Shipped'}
              >
                Deliver Order
              </Button>
            </div>
            <Button 
              onClick={() => setSelectedOrder(null)}
              variant="outline"
              className="sm:w-28 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border-charcoal/10 hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
