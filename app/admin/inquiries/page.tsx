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
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-semibold border ${item.status === 'New' ? 'bg-gold/10 text-gold border-gold/20' :
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
              className={`px-5 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === status
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
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className=" bg-white border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 border-b border-charcoal/5 bg-[#fdf9f3] relative">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold bg-gold/10 px-3 py-1 rounded-full">
                  Inquiry Analyzer
                </span>
                <DialogTitle className="text-2xl font-serif font-black text-charcoal mt-2 tracking-tight">Calculator Proposal Review</DialogTitle>
                <p className="text-[10px] font-mono text-charcoal/40 mt-1 uppercase tracking-wider">Proposal Ref: {selectedInquiry?.id?.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${selectedInquiry?.status === 'New' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                    selectedInquiry?.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                  {selectedInquiry?.status}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[65vh] no-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Customer Profile & Estimate details */}
              <div className="lg:col-span-5 space-y-6">

                {/* Customer Details Card */}
                <div className="p-6 rounded-[2rem] bg-neutral-50 border border-charcoal/5 space-y-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold text-lg font-black border border-gold/20 shadow-inner">
                      {(selectedInquiry?.name || "U")[0]}
                    </div>
                    <div>
                      <p className="text-base font-black text-charcoal">{selectedInquiry?.name}</p>
                      <p className="text-[8px] font-black text-gold uppercase tracking-[0.2em]">Inquiry Client</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-5 border-t border-charcoal/5">
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60 truncate">{selectedInquiry?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60">{selectedInquiry?.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-[11px] font-bold text-charcoal/60 leading-relaxed">{selectedInquiry?.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={14} className="text-gold shrink-0" />
                      <span className="text-[11px] font-bold text-charcoal/60">Submitted on {selectedInquiry?.date}</span>
                    </div>
                  </div>
                </div>

                {/* Estimate details summary card */}
                {selectedInquiry?.estimateDetails && (
                  <div className="p-6 rounded-[2rem] bg-charcoal text-white space-y-5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gold/60 mb-0.5">Calculated Estimate</p>
                        <h2 className="text-3xl font-black text-gold font-serif">₹{selectedInquiry?.estimateDetails?.estimate?.toLocaleString() || "0"}</h2>
                      </div>
                      {selectedInquiry?.estimateDetails?.brand && (
                        <div className="text-right">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Quality Level</p>
                          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                            {selectedInquiry?.estimateDetails?.brand}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 relative z-10">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">Service Category</p>
                        <p className="text-xs font-bold text-white/95">{selectedInquiry?.service}</p>
                      </div>
                      {selectedInquiry?.estimateDetails?.reqType && (
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">Project Scope</p>
                          <p className="text-xs font-bold text-white/95 uppercase">
                            {selectedInquiry?.estimateDetails?.reqType === 'full_home' ? 'Full Home' : 'Specific Area'}
                          </p>
                        </div>
                      )}
                      {selectedInquiry?.estimateDetails?.selBHK && (
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">Config / Room</p>
                          <p className="text-xs font-bold text-white/95">{selectedInquiry?.estimateDetails?.selBHK}</p>
                        </div>
                      )}
                      {selectedInquiry?.estimateDetails?.carpetArea && (
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">Carpet Area</p>
                          <p className="text-xs font-bold text-white/95">{selectedInquiry?.estimateDetails?.carpetArea} sq.ft</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Selections breakdown & Custom notes */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold flex items-center justify-between border-b border-charcoal/5 pb-2">
                  <span>Selections Breakdown</span>
                  <span className="text-charcoal/40 font-mono">{selectedInquiry?.estimateDetails?.items?.length || 0} Item{selectedInquiry?.estimateDetails?.items && selectedInquiry.estimateDetails.items.length > 1 ? 's' : ''}</span>
                </h4>

                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedInquiry?.estimateDetails?.items?.length > 0 ? (
                    selectedInquiry.estimateDetails.items.map((item: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-neutral-50 border border-charcoal/5 hover:border-gold/10 transition-all duration-300 shadow-sm flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-charcoal">{item.name}</p>
                          <p className="text-[9px] text-charcoal/40 font-bold uppercase tracking-wider mt-0.5">Qty / Area: {item.qty}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-neutral-50/50 border border-charcoal/5">
                      <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-widest">No specific items listed</p>
                    </div>
                  )}

                  {selectedInquiry?.message && (
                    <div className="mt-6 p-5 rounded-2xl bg-[#fdf9f3] border border-gold/15 space-y-2">
                      <p className="text-[8px] font-black text-gold uppercase tracking-[0.2em]">Client Notes / Requirements</p>
                      <p className="text-xs text-charcoal/80 leading-relaxed font-bold italic">"{selectedInquiry.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-charcoal/10 bg-[#fdf9f3] flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 gap-3">
              <Button
                onClick={() => updateStatus(selectedInquiry!.id, "In Progress")}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 disabled:opacity-30 disabled:shadow-none transition-all duration-300"
                disabled={selectedInquiry?.status !== 'New'}
              >
                In Progress
              </Button>
              <Button
                onClick={() => updateStatus(selectedInquiry!.id, "Completed")}
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10 disabled:opacity-30 disabled:shadow-none transition-all duration-300"
                disabled={selectedInquiry?.status !== 'In Progress'}
              >
                Complete Inquiry
              </Button>
            </div>
            <Button
              onClick={() => setSelectedInquiry(null)}
              variant="outline"
              className="sm:w-28 h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border-charcoal/10 hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
