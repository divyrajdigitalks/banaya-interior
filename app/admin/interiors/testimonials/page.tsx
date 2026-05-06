"use client";

import { useState } from "react";
import { Search, Quote, Edit3, Trash2, Plus, Save, User, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { motion } from "framer-motion";

const INITIAL_TESTIMONIALS = [
  {
    id: "1",  
    name: "Neha & Rohit Sharma",
    location: "Bangalore",
    text: "Banaya Interiors transformed our house into a dream home. The team was professional, creative and delivered beyond our expectations.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
];

export default function InteriorTestimonialsPage() {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", location: "", text: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Client Info",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/30 flex items-center gap-1 uppercase tracking-widest font-black">
              <MapPin size={10} /> {item.location}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Feedback",
      accessorKey: "text",
      cell: (item: any) => (
        <p className="text-[11px] text-charcoal/60 line-clamp-2 italic max-w-xs">"{item.text}"</p>
      )
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setTestimonials(testimonials.filter(t => t.id !== item.id)); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (testimonial: any = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData(testimonial);
    } else {
      setEditingTestimonial(null);
      setFormData({ name: "", location: "", text: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.text || !formData.image) return;

    if (editingTestimonial) {
      setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? formData : t));
    } else {
      setTestimonials([{ id: Date.now().toString(), ...formData }, ...testimonials]);
    }
    setIsDialogOpen(false);
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 pt-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-[500px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={20} />
          <Input 
            placeholder="Search testimonials..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-16 h-16 bg-white border-charcoal/5 rounded-[2rem] focus:ring-gold/20 focus:border-gold transition-all shadow-2xl shadow-charcoal/5 text-base"
          />
        </div>

        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full lg:w-auto bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] px-10 h-16 rounded-[2rem] shadow-2xl flex items-center gap-4 group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold group-hover:rotate-90 transition-transform duration-500">
            <Plus size={18} />
          </div>
          Add Testimonial
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredTestimonials} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto border-none shadow-2xl">
          <DialogHeader className="pb-8 border-b border-charcoal/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Quote size={24} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-charcoal">
                  {editingTestimonial ? "Edit" : "New"} <span className="text-gold font-bold">Feedback</span>
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Client Experience</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminFormInput 
                label="Client Name"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="e.g. Neha & Rohit Sharma"
              />
              <AdminFormInput 
                label="Location"
                value={formData.location}
                onChange={(val) => setFormData({ ...formData, location: val })}
                placeholder="e.g. Mumbai, India"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Client Testimonial</Label>
              <textarea 
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Write the feedback here..."
                className="w-full h-32 p-5 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all text-sm font-medium leading-relaxed resize-none"
              />
            </div>

            <ImageUpload 
              label="Client Photo"
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
            />
          </div>

          <DialogFooter className="pt-8 border-t border-charcoal/5 flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="flex-1 h-16 rounded-2xl border-charcoal/10 font-bold text-charcoal/60 hover:bg-charcoal/5 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 h-16 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-charcoal/10 transition-all active:scale-95"
            >
              Save Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
