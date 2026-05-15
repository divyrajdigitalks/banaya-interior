"use client";

import { useState, useEffect } from "react";
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
  Tag,
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
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";

import { offerService } from "@/lib/api/services/offer.service";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { buildImageUrl } from "@/lib/api/axios";

export default function OffersManagementPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const response = await offerService.getOffers();
      if (response.success) {
        setOffers(response.data);
      }
    } catch (error) {
      showError("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Offer Details",
      accessorKey: "title",
      cell: (item: any) => (
        <div className="flex items-center gap-4 max-w-md">
          <div className="w-16 h-12 rounded-xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            <img 
              src={item.image ? (item.image.startsWith('http') ? item.image : buildImageUrl(item.image)) : "/placeholder-offer.jpg"} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-charcoal truncate">{item.title}</p>
            <p className="text-[10px] text-charcoal/40 font-medium line-clamp-1 italic">"{item.description}"</p>
          </div>
        </div>
      )
    },
    {
      header: "Benefit",
      accessorKey: "discountText",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-gold" />
          <span className="font-black text-charcoal">{item.discountText}</span>
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
            {new Date(item.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
            <Clock size={12} className="text-gold" />
            {new Date(item.endDate).toLocaleDateString()}
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
            title={item.isActive ? "Pause" : "Launch"}
          >
            {item.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/offers/${item._id}`); }}
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
    router.push("/admin/offers/add");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await offerService.deleteOffer(id);
      if (response.success) {
        showSuccess("Offer deleted");
        loadOffers();
      }
    } catch (error) {
      showError("Delete failed");
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      const response = await offerService.updateOffer(item._id, { isActive: !item.isActive });
      if (response.success) {
        showSuccess(`Offer ${item.isActive ? 'paused' : 'launched'}`);
        loadOffers();
      }
    } catch (error) {
      showError("Update failed");
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="space-y-12 pb-12">
      <AdminSearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search offers..."
        actionLabel="Create New Offer"
        onAction={handleOpenAddPage}
        ActionIcon={Sparkles}
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredOffers} />
      </div>
    </div>
  );
}
