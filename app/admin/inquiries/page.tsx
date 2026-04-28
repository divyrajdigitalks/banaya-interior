"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Trash2,
  ExternalLink
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

const INITIAL_INQUIRIES = [
  { 
    id: "INQ001", 
    name: "Rajesh Kumar", 
    email: "rajesh@example.com", 
    phone: "+91 98765 43210", 
    service: "Full Interior Design", 
    status: "New", 
    date: "2024-04-28",
    message: "Interested in 3BHK interior design for my new apartment in Gurgaon."
  },
  { 
    id: "INQ002", 
    name: "Anita Sharma", 
    email: "anita.s@example.com", 
    phone: "+91 87654 32109", 
    service: "Decor Shopping", 
    status: "In Progress", 
    date: "2024-04-27",
    message: "Looking for premium lighting fixtures and wall art for my living room."
  },
  { 
    id: "INQ003", 
    name: "Vikram Singh", 
    email: "vikram.v@example.com", 
    phone: "+91 76543 21098", 
    service: "Furniture Customization", 
    status: "Completed", 
    date: "2024-04-25",
    message: "Need a custom-sized dining table in teak wood finish."
  },
  { 
    id: "INQ004", 
    name: "Sonal Gupta", 
    email: "sonal.g@example.com", 
    phone: "+91 65432 10987", 
    service: "Heritage Consultation", 
    status: "New", 
    date: "2024-04-24",
    message: "Want to restore a family heirloom chair and match it with new decor."
  },
];

export default function InquiriesManagementPage() {
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inq.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setInquiries(inquiries.filter(inq => inq.id !== id));
  };

  const updateStatus = (id: string, newStatus: string) => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-[10px] tracking-[0.4em] text-gold uppercase font-black">Client Relations</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-charcoal tracking-tight">
            Customer <span className="italic font-light text-gold">Inquiries</span>
          </h1>
        </div>
      </header>

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
                          <p className="text-[10px] uppercase tracking-widest font-black text-charcoal/30 mt-1">ID: #{inq.id}</p>
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
                          <p className="text-[10px] uppercase tracking-widest font-black text-charcoal/30 mb-3">Customer Message</p>
                          <p className="text-[13px] leading-relaxed font-medium text-charcoal/80 italic">"{inq.message}"</p>
                          <div className="absolute top-4 right-6 opacity-5 group-hover/msg:opacity-10 transition-opacity">
                            <Mail size={40} />
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
