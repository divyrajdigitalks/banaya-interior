"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Filter,
  CheckCircle2,
  Trash2,
  ExternalLink,
  MapPin,
  Layers,
  IndianRupee,
  X,
  ArrowLeft,
  User,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";
import { inquiryService, type Inquiry } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InquiriesManagementPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showSuccess, showError } = useAdminToast();

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await inquiryService.getInquiries();
      setInquiries(data);
    } catch (error) {
      showError("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      const success = await inquiryService.deleteInquiry(id);
      if (success) {
        showSuccess("Inquiry deleted successfully");
        loadInquiries();
      }
    } catch (error) {
      showError("Failed to delete inquiry");
    } finally {
      setDeleteId(null);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const success = await inquiryService.updateInquiryStatus(id, newStatus as any);
      if (success) {
        showSuccess(`Status updated to ${newStatus}`);
        loadInquiries();
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (error) {
      showError("Failed to update status");
    }
  };

  const columns = [
    {
      header: "Customer Info",
      accessorKey: "name",
      cell: (item: Inquiry) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold border border-gold/20">
            {item.name[0]}
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 font-medium uppercase tracking-widest">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Service",
      accessorKey: "service",
      cell: (item: Inquiry) => (
        <span className="text-[10px] font-semibold text-charcoal/60 bg-charcoal/5 px-3 py-1.5 rounded-full">
          {item.service}
        </span>
      )
    },
    {
      header: "Estimate",
      accessorKey: "estimateDetails",
      cell: (item: Inquiry) => (
        <div className="flex items-center gap-1.5 font-semibold text-charcoal">
          <IndianRupee size={12} className="text-gold" />
          {item.estimateDetails?.estimate?.toLocaleString() || "0"}
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: Inquiry) => (
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-semibold border ${
          item.status === 'New' ? 'bg-gold/10 text-gold border-gold/20' : 
          item.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: Inquiry) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedInquiry(item)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
          >
            <ExternalLink size={14} />
          </button>
          <button 
            onClick={() => setDeleteId(item.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40 font-bold uppercase tracking-widest text-[10px]">Loading inquiries...</p>
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold text-charcoal tracking-tight">Inquiries Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage customer calculator inquiries</p>
          </div>
        </div>
      </div>

      <AdminSearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search by name, email or service..."
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar w-full">
          {["All", "New", "In Progress", "Completed"].map(status => (
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
        <AdminTable columns={columns} data={filteredInquiries} />
      </div>

      {/* Details Dialog */}
    

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-charcoal">Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal/60">
              Are you sure you want to delete this inquiry from <b>{inquiries.find(i => i.id === deleteId)?.name}</b>? This action is permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="flex-1 h-12 rounded-2xl border border-charcoal/10 font-bold uppercase text-[10px] tracking-widest">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty State */}
      {filteredInquiries.length === 0 && (
        <AdminCard>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center text-charcoal/10 border border-charcoal/5 mb-6">
              <Search size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-charcoal">No inquiries found</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mt-1.5">Try adjusting your search query or filters</p>
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
