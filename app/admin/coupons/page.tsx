"use client";

import { useState } from "react";
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
  Banknote
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

const INITIAL_COUPONS = [
  { 
    id: "1", 
    code: "WELCOME10", 
    discountType: "Percentage", 
    value: 10, 
    expiryDate: "2024-12-31", 
    minOrder: 500, 
    isActive: true 
  },
  { 
    id: "2", 
    code: "FESTIVE500", 
    discountType: "Flat", 
    value: 500, 
    expiryDate: "2024-06-30", 
    minOrder: 5000, 
    isActive: false 
  },
];

export default function CouponsManagementPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    code: "",
    discountType: "Percentage",
    value: "",
    expiryDate: "",
    minOrder: "",
    isActive: true
  });

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
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">ID: #{item.id}</p>
          </div>
        </div>
      )
    },
    {
      header: "Discount",
      accessorKey: "value",
      cell: (item: any) => (
        <div className="flex items-center gap-2 font-bold text-charcoal">
          {item.discountType === "Percentage" ? (
            <><Percent size={14} className="text-gold" /> {item.value}%</>
          ) : (
            <><Banknote size={14} className="text-gold" /> ₹{item.value}</>
          )}
        </div>
      )
    },
    {
      header: "Requirements",
      accessorKey: "minOrder",
      cell: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Clock size={12} className="text-gold" />
            Min: ₹{item.minOrder}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Calendar size={12} className="text-gold" />
            Ends: {item.expiryDate}
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
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleStatus(item.id); }}
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
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100/50"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100/50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (coupon: any = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData(coupon);
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discountType: "Percentage",
        value: "",
        expiryDate: "",
        minOrder: "",
        isActive: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.value) return;
    
    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? formData : c));
    } else {
      setCoupons([{ id: Date.now().toString(), ...formData }, ...coupons]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const toggleStatus = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
          <Input 
            placeholder="Search coupon codes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-charcoal/5 rounded-2xl pl-11 py-6 text-[10px] uppercase tracking-widest font-bold focus:ring-2 focus:ring-gold/5 shadow-xl shadow-charcoal/5"
          />
        </div>

        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl shadow-gold/10 flex items-center gap-3 group transition-all duration-500"
        >
          <Plus className="group-hover:rotate-90 transition-transform duration-500" size={16} />
          Create New Coupon
        </Button>
      </div>

      <AdminTable columns={columns} data={filteredCoupons} />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-[2.5rem] p-10 overflow-hidden mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black text-charcoal">
              {editingCoupon ? "Edit" : "Create"} <span className="text-gold font-bold">Promo Coupon</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-8">
            <div className="col-span-2">
              <AdminFormInput 
                label="Coupon Code"
                value={formData.code}
                onChange={(val) => setFormData({ ...formData, code: val.toUpperCase() })}
                placeholder="e.g. SUMMER2024"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 ml-2">Discount Type</label>
              <select 
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full h-14 bg-warm-cream/50 border-none rounded-2xl px-6 text-sm font-bold text-charcoal focus:ring-2 focus:ring-gold/20 outline-none appearance-none cursor-pointer"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat Amount (₹)</option>
              </select>
            </div>

            <AdminFormInput 
              label="Discount Value"
              type="number"
              value={formData.value}
              onChange={(val) => setFormData({ ...formData, value: val })}
              placeholder={formData.discountType === "Percentage" ? "e.g. 10" : "e.g. 500"}
            />

            <AdminFormInput 
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(val) => setFormData({ ...formData, expiryDate: val })}
            />

            <AdminFormInput 
              label="Min Order Value (₹)"
              type="number"
              value={formData.minOrder}
              onChange={(val) => setFormData({ ...formData, minOrder: val })}
              placeholder="e.g. 1000"
            />
          </div>

          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10 text-[10px] font-black uppercase tracking-widest">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-gold/20">
              Save Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
