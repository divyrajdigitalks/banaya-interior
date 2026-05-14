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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminCard } from "@/components/admin/admin-card";
import { orderService, type Order } from "@/lib/api";
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
      header: "Status",
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

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
            <input 
              placeholder="Search by order ID or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-charcoal/10 rounded-2xl text-sm focus:ring-4 focus:ring-gold/5 focus:border-gold/50 transition-all outline-none placeholder:text-charcoal/20 font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
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
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredOrders} />
      </AdminCard>

      {/* Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl bg-white border-none rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-charcoal/5 bg-neutral-50/50">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl font-bold text-charcoal tracking-tight">Order Analysis</DialogTitle>
                <p className="text-[9px] uppercase tracking-widest font-black text-charcoal/30 mt-1">ID: {selectedOrder?._id.toUpperCase()}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                selectedOrder?.status === 'Pending' ? 'bg-gold/10 text-gold border-gold/20' : 
                selectedOrder?.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                selectedOrder?.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                selectedOrder?.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                {selectedOrder?.status}
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-50 border border-charcoal/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-sm font-black border border-gold/20">
                      {(selectedOrder?.user?.name || selectedOrder?.shippingAddress?.name || "U")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-charcoal">{selectedOrder?.user?.name || selectedOrder?.shippingAddress?.name}</p>
                      <p className="text-[9px] font-black text-gold uppercase tracking-widest">Client Profile</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2.5 pt-4 border-t border-charcoal/5">
                    <div className="flex items-center gap-3">
                      <Mail size={12} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60 truncate">{selectedOrder?.user?.email || selectedOrder?.shippingAddress?.email || "No Email Provided"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={12} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60">{selectedOrder?.shippingAddress?.phone || selectedOrder?.user?.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={12} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-[11px] font-bold text-charcoal/60 leading-relaxed">
                        {selectedOrder?.shippingAddress?.address}, {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state} - {selectedOrder?.shippingAddress?.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-charcoal text-white flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gold/60 mb-0.5">Total Amount</p>
                    <h2 className="text-2xl font-black text-gold">₹{selectedOrder?.totalAmount.toLocaleString()}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-0.5">Payment</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{selectedOrder?.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center justify-between">
                  <span>Order Manifest</span>
                  <span className="text-charcoal/30">{selectedOrder?.items?.length} Items</span>
                </h4>
                
                <div className="space-y-3">
                  {selectedOrder?.items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-neutral-50 border border-charcoal/5">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-white border border-charcoal/5 overflow-hidden shrink-0">
                          <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-xs font-bold text-charcoal truncate">{item.product?.name}</p>
                            <p className="text-xs font-black text-charcoal">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="text-[9px] font-bold text-charcoal/30 uppercase mt-1">
                            ₹{item.price.toLocaleString()} × {item.quantity}
                          </p>
                          
                          {item.personalization?.name && (
                            <div className="mt-2 pt-2 border-t border-charcoal/5">
                              <p className="text-[8px] font-black text-gold uppercase tracking-widest">Personalization: <span className="text-charcoal/60">{item.personalization.name}</span></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-5 border-t border-charcoal/10 bg-neutral-50/50 flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 gap-2">
              <Button 
                onClick={() => updateStatus(selectedOrder!._id, "Processing")}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10"
                disabled={selectedOrder?.status !== 'Pending'}
              >
                Accept
              </Button>
              <Button 
                onClick={() => updateStatus(selectedOrder!._id, "Shipped")}
                className="flex-1 bg-purple-500 text-white hover:bg-purple-600 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/10"
                disabled={selectedOrder?.status !== 'Processing'}
              >
                Ship
              </Button>
              <Button 
                onClick={() => updateStatus(selectedOrder!._id, "Delivered")}
                className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10"
                disabled={selectedOrder?.status !== 'Shipped'}
              >
                Deliver
              </Button>
            </div>
            <Button 
              onClick={() => setSelectedOrder(null)}
              variant="outline"
              className="sm:w-24 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest border-charcoal/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
