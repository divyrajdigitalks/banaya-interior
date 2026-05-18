"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Ticket, 
  Calendar, 
  Trash2, 
  Edit3, 
  Plus, 
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Percent,
  Banknote,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInput } from "@/components/admin/form-input";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";
import { couponService } from "@/lib/api/services/coupon.service";
import { useAdminToast } from "@/hooks/use-admin-toast";

export default function CouponsManagementPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponService.getCoupons();
      if (response.success) {
        setCoupons(response.data);
      }
    } catch (error) {
      showError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Coupon Info",
      accessorKey: "code",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${item.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'}`}>
            <Ticket size={20} />
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.code}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">ID: #{item._id.substring(0, 6)}</p>
          </div>
        </div>
      )
    },
    {
      header: "Discount",
      accessorKey: "discountAmount",
      cell: (item: any) => (
        <div className="flex items-center gap-2 font-bold text-charcoal">
          {item.discountType === "percentage" ? (
            <><Percent size={14} className="text-gold" /> {item.discountAmount}%</>
          ) : (
            <><Banknote size={14} className="text-gold" /> ₹{item.discountAmount}</>
          )}
        </div>
      )
    },
    {
      header: "Requirements",
      accessorKey: "minPurchase",
      cell: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Clock size={12} className="text-gold" />
            Min: ₹{item.minPurchase}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Calendar size={12} className="text-gold" />
            Ends: {new Date(item.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Ticket size={12} className="text-gold" />
            Used: {item.usedCount ?? 0} / {item.usageLimit ?? 0}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (item: any) => (
        <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-black ${
          item.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-400/10 text-red-400'
        }`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: "Action",
      accessorKey: "_id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleStatus(item); }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all shadow-sm ${
              item.isActive 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' 
                : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white'
            }`}
            title={item.isActive ? "Deactivate" : "Activate"}
          >
            {item.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/coupons/${item._id}`); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100/50"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100/50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenAddPage = () => {
    router.push("/admin/coupons/add");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await couponService.deleteCoupon(id);
      if (response.success) {
        showSuccess("Coupon deleted");
        loadCoupons();
      }
    } catch (error) {
      showError("Delete failed");
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      const response = await couponService.updateCoupon(item._id, { isActive: !item.isActive });
      if (response.success) {
        showSuccess(`Coupon ${item.isActive ? 'deactivated' : 'activated'}`);
        loadCoupons();
      }
    } catch (error) {
      showError("Update failed");
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="space-y-12 pb-12">
      <AdminSearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search coupon codes..."
        actionLabel="Create New Coupon"
        onAction={handleOpenAddPage}
        ActionIcon={Plus}
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredCoupons} />
      </div>
    </div>
  );
}
