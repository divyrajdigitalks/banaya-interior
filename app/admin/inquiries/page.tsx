"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Filter,
  CheckCircle2,
  MoreVertical,
  Trash2,
  ExternalLink,
  MapPin,
  Layers,
  IndianRupee,
  Clock,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { inquiryService, type Inquiry } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

export default function InquiriesManagementPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
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
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const success = await inquiryService.updateInquiryStatus(id, newStatus as any);
      if (success) {
        showSuccess(`Status updated to ${newStatus}`);
        loadInquiries();
      }
    } catch (error) {
      showError("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40 font-bold uppercase tracking-widest text-[10px]">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
          <Input 
            placeholder="Search inquiries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-charcoal/5 rounded-2xl pl-11 py-6 text-[10px] uppercase tracking-widest font-bold focus:ring-2 focus:ring-gold/5 shadow-xl shadow-charcoal/5"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 px-6 py-4 bg-white border border-charcoal/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-charcoal shadow-lg shadow-charcoal/5">
            <Filter size={14} className="text-gold" /> Filter By Status
          </div>
          <div className="h-10 w-[1px] bg-charcoal/5 hidden lg:block" />
          {["All", "New", "In Progress", "Completed"].map(status => (
            <button 
              key={status} 
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-4 border rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                statusFilter === status 
                  ? "bg-charcoal text-white border-charcoal shadow-lg" 
                  : "bg-white/50 border-charcoal/5 text-charcoal/40 hover:bg-white hover:text-charcoal"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredInquiries.map((inq, index) => (
          <motion.div
            key={inq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-charcoal/5 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white group">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Status Indicator Sidebar */}
                  <div className={`w-2 lg:w-3 ${
                    inq.status === 'New' ? 'bg-gold' : 
                    inq.status === 'In Progress' ? 'bg-blue-500' : 
                    'bg-emerald-500'
                  }`} />
                  
                  <div className="flex-1 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-warm-cream flex items-center justify-center text-charcoal text-lg font-black shadow-inner">
                          {inq.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-serif font-black text-charcoal tracking-tight">{inq.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-black ${
                              inq.status === 'New' ? 'bg-gold/10 text-gold' : 
                              inq.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 
                              'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={10} className="text-gold" />
                            <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{inq.city || "Unknown City"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] uppercase tracking-widest font-black text-charcoal/30">Inquiry Date</p>
                          <div className="flex items-center justify-end gap-2 text-[11px] font-bold text-charcoal mt-1">
                            <Calendar size={12} className="text-gold" />
                            {inq.date}
                          </div>
                        </div>
                        <div className="h-10 w-px bg-charcoal/5" />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setSelectedInquiry(inq)}
                            variant="ghost" 
                            className="p-3 hover:bg-warm-cream rounded-xl text-gold hover:text-charcoal transition-all"
                          >
                            <ExternalLink size={20} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="p-3 hover:bg-warm-cream rounded-xl text-charcoal/30 hover:text-charcoal transition-all">
                                <MoreVertical size={20} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-charcoal/5 rounded-2xl shadow-2xl p-2">
                              <DropdownMenuItem onClick={() => updateStatus(inq.id, "New")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer focus:bg-warm-cream focus:text-gold transition-colors">
                                Mark as New
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(inq.id, "In Progress")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer focus:bg-warm-cream focus:text-blue-500 transition-colors">
                                Mark as In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(inq.id, "Completed")} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer focus:bg-warm-cream focus:text-emerald-500 transition-colors">
                                Mark as Completed
                              </DropdownMenuItem>
                              <div className="h-px bg-charcoal/5 my-1" />
                              <DropdownMenuItem onClick={() => handleDelete(inq.id)} className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer focus:bg-red-50 text-red-500 transition-colors">
                                Delete Inquiry
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-6 bg-warm-cream/30 rounded-3xl border border-charcoal/5 relative overflow-hidden group/msg">
                          <p className="text-[10px] uppercase tracking-widest font-black text-charcoal/30 mb-3">Estimate Summary</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-charcoal/5">
                              <IndianRupee size={14} className="text-gold" />
                              <span className="text-sm font-black text-charcoal">
                                {inq.estimateDetails?.estimate?.toLocaleString() || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-charcoal/5">
                              <Layers size={14} className="text-gold" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/60">
                                {inq.estimateDetails?.brand || "Standard"}
                              </span>
                            </div>
                          </div>
                          <div className="absolute top-4 right-6 opacity-5 group-hover/msg:opacity-10 transition-opacity">
                            <IndianRupee size={40} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-4 bg-white border border-charcoal/5 rounded-2xl hover:border-gold/30 transition-all cursor-pointer group/link">
                            <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center text-gold group-hover/link:bg-gold group-hover/link:text-white transition-colors">
                              <Mail size={14} />
                            </div>
                            <span className="text-[11px] font-bold text-charcoal/60 group-hover/link:text-charcoal transition-colors truncate">{inq.email}</span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-white border border-charcoal/5 rounded-2xl hover:border-gold/30 transition-all cursor-pointer group/link">
                            <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center text-gold group-hover/link:bg-gold group-hover/link:text-white transition-colors">
                              <Phone size={14} />
                            </div>
                            <span className="text-[11px] font-bold text-charcoal/60 group-hover/link:text-charcoal transition-colors">{inq.phone}</span>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-charcoal rounded-2xl text-white">
                          <p className="text-[8px] uppercase tracking-widest font-black text-gold mb-1">Requested Service</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black">{inq.service}</span>
                            <ExternalLink size={14} className="text-white/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-4xl bg-white border-none rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-10 border-b border-charcoal/5 bg-warm-cream/20">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-3xl font-serif font-black text-charcoal tracking-tight">Inquiry Details</DialogTitle>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-charcoal/40 mt-2">Reference ID: {selectedInquiry?.id}</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedInquiry(null)}
                className="w-10 h-10 rounded-full p-0 hover:bg-charcoal/5"
              >
                <X size={20} />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-10 space-y-10 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-4">Customer Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-warm-cream flex items-center justify-center text-charcoal text-lg font-black">{selectedInquiry?.name[0]}</div>
                      <div>
                        <p className="text-lg font-serif font-black text-charcoal">{selectedInquiry?.name}</p>
                        <p className="text-[11px] font-bold text-charcoal/40">{selectedInquiry?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-warm-cream/30 border border-charcoal/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-charcoal/30 mb-1">Phone</p>
                        <p className="text-[11px] font-black text-charcoal">{selectedInquiry?.phone}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-warm-cream/30 border border-charcoal/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-charcoal/30 mb-1">City</p>
                        <p className="text-[11px] font-black text-charcoal">{selectedInquiry?.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-4">Estimate Details</h4>
                  <div className="p-6 rounded-3xl bg-charcoal text-white space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Estimate</span>
                      <span className="text-2xl font-black text-gold">₹{selectedInquiry?.estimateDetails?.estimate?.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Service Type</p>
                        <p className="text-[11px] font-black">{selectedInquiry?.service}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Quality Level</p>
                        <p className="text-[11px] font-black">{selectedInquiry?.estimateDetails?.brand || "Standard"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Project Scope</p>
                        <p className="text-[11px] font-black uppercase">{selectedInquiry?.estimateDetails?.reqType?.replace('_', ' ') || "Full Home"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">BHK Config</p>
                        <p className="text-[11px] font-black">{selectedInquiry?.estimateDetails?.selBHK || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-4">Selected Items</h4>
                  <div className="space-y-3">
                    {selectedInquiry?.estimateDetails?.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-charcoal/5 shadow-sm">
                        <span className="text-[11px] font-bold text-charcoal">{item.id.replace(/-/g, ' ').toUpperCase()}</span>
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gold/10 text-gold">QTY: {item.qty}</span>
                      </div>
                    ))}
                    {!selectedInquiry?.estimateDetails?.items?.length && (
                      <p className="text-[11px] text-charcoal/40 font-bold italic">No specific items selected.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-t border-charcoal/5 bg-warm-cream/10 flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                onClick={() => updateStatus(selectedInquiry!.id, "In Progress")}
                className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10"
              >
                Start Process
              </Button>
              <Button 
                onClick={() => updateStatus(selectedInquiry!.id, "Completed")}
                className="bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10"
              >
                Complete Inquiry
              </Button>
            </div>
            <Button 
              onClick={() => setSelectedInquiry(null)}
              variant="ghost" 
              className="text-[9px] font-black uppercase tracking-widest text-charcoal/40"
            >
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredInquiries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-warm-cream flex items-center justify-center text-charcoal/10">
            <Search size={40} />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black text-charcoal">No inquiries found</h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mt-1">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  );
}
