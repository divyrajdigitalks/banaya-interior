"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
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
  Image as ImageIcon,
  Tag
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
import { ImageUpload } from "@/components/admin/image-upload";

const INITIAL_OFFERS = [
  { 
    id: "1", 
    name: "Summer Sale 2024", 
    description: "Get up to 40% off on all luxury furniture items this summer season.", 
    discount: "Up to 40% OFF", 
    startDate: "2024-05-01", 
    endDate: "2024-06-30", 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    isActive: true 
  },
  { 
    id: "2", 
    name: "New Home Bundle", 
    description: "Special bundle offer for new homeowners. Save ₹50,000 on full home interiors.", 
    discount: "Flat ₹50,000 OFF", 
    startDate: "2024-01-01", 
    endDate: "2024-12-31", 
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    isActive: true 
  },
];

export default function OffersManagementPage() {
  const router = useRouter();
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    image: "",
    isActive: true
  });

  const columns = [
    {
      header: "Offer Details",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4 max-w-md">
          <div className="w-16 h-12 rounded-xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-charcoal truncate">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 font-medium line-clamp-1 italic">"{item.description}"</p>
          </div>
        </div>
      )
    },
    {
      header: "Benefit",
      accessorKey: "discount",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-gold" />
          <span className="font-black text-charcoal">{item.discount}</span>
        </div>
      )
    },
    {
      header: "Duration",
      accessorKey: "startDate",
      cell: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Calendar size={12} className="text-gold" />
            {item.startDate}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Clock size={12} className="text-gold" />
            {item.endDate}
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
          {item.isActive ? 'Live' : 'Paused'}
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
            title={item.isActive ? "Pause" : "Launch"}
          >
            {item.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/offers/add?id=${item.id}`); }}
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

  const handleOpenAddPage = () => {
    router.push("/admin/offers/add");
  };

  const handleDelete = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const toggleStatus = (id: string) => {
    setOffers(offers.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o));
  };

  const filteredOffers = offers.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
          <Input 
            placeholder="Search offers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-charcoal/5 rounded-2xl pl-11 py-6 text-[10px] uppercase tracking-widest font-bold focus:ring-2 focus:ring-gold/5 shadow-xl shadow-charcoal/5"
          />
        </div>

        <Button 
          onClick={handleOpenAddPage}
          className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl shadow-gold/10 flex items-center gap-3 group transition-all duration-500"
        >
          <Sparkles className="group-hover:rotate-90 transition-transform duration-500" size={16} />
          Create New Offer
        </Button>
      </div>

      <AdminTable columns={columns} data={filteredOffers} />
    </div>
  );
}
