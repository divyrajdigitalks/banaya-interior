"use client";

import { useState } from "react";
import { Search, IndianRupee, Edit3, Trash2, Plus, Save, Layout, Sofa, Bed, Baby, Home, Building2 } from "lucide-react";
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
import { motion } from "framer-motion";

const ICON_OPTIONS = [
  { id: "Layout", icon: Layout, label: "Kitchen" },
  { id: "Sofa", icon: Sofa, label: "Living Room" },
  { id: "Bed", icon: Bed, label: "Bedroom" },
  { id: "Baby", icon: Baby, label: "Kids Room" },
  { id: "Home", icon: Home, label: "Small Home" },
  { id: "Building2", icon: Building2, label: "Large Home" },
];

const INITIAL_COSTS = [
  { id: "1", iconId: "Layout", title: "Modular Kitchen", range: "₹2.5L - ₹5L" },
  { id: "2", iconId: "Sofa", title: "Living Room", range: "₹1.5L - ₹3.5L" },
  { id: "3", iconId: "Bed", title: "Master Bedroom", range: "₹1.5L - ₹3L" },
  { id: "4", iconId: "Baby", title: "Children's Bedroom", range: "₹1L - ₹2.5L" },
  { id: "5", iconId: "Home", title: "Full Home (2 BHK)", range: "₹8L - ₹15L" },
  { id: "6", iconId: "Building2", title: "Full Home (3 BHK)", range: "₹12L - ₹20L+" },
];

export default function InteriorCostGuidePage() {
  const [costs, setCosts] = useState(INITIAL_COSTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ title: "", range: "", iconId: "Layout" });
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Category",
      accessorKey: "title",
      cell: (item: any) => {
        const Icon = ICON_OPTIONS.find(i => i.id === item.iconId)?.icon || Layout;
        return (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
              <Icon size={18} />
            </div>
            <p className="font-bold text-charcoal">{item.title}</p>
          </div>
        );
      }
    },
    {
      header: "Price Range",
      accessorKey: "range",
      cell: (item: any) => (
        <span className="font-black text-charcoal">{item.range}</span>
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
            onClick={(e) => { e.stopPropagation(); setCosts(costs.filter(c => c.id !== item.id)); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (cost: any = null) => {
    if (cost) {
      setEditingCost(cost);
      setFormData(cost);
    } else {
      setEditingCost(null);
      setFormData({ title: "", range: "", iconId: "Layout" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.range) return;

    if (editingCost) {
      setCosts(costs.map(c => c.id === editingCost.id ? formData : c));
    } else {
      setCosts([{ id: Date.now().toString(), ...formData }, ...costs]);
    }
    setIsDialogOpen(false);
  };

  const filteredCosts = costs.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 pt-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-[500px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={20} />
          <Input 
            placeholder="Search cost categories..." 
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
          Add Cost Item
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredCosts} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto border-none shadow-2xl">
          <DialogHeader className="pb-8 border-b border-charcoal/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <IndianRupee size={24} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-charcoal">
                  {editingCost ? "Edit" : "New"} <span className="text-gold font-bold">Estimate</span>
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Pricing Guide</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-10">
            <div className="space-y-4">
              <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Choose Icon</Label>
              <div className="grid grid-cols-3 gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, iconId: opt.id })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      formData.iconId === opt.id 
                        ? 'bg-gold/10 border-gold text-gold shadow-inner' 
                        : 'bg-charcoal/5 border-transparent text-charcoal/40 hover:bg-charcoal/10'
                    }`}
                  >
                    <opt.icon size={24} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <AdminFormInput 
              label="Category Title"
              value={formData.title}
              onChange={(val) => setFormData({ ...formData, title: val })}
              placeholder="e.g. Modular Kitchen"
            />

            <AdminFormInput 
              label="Price Range"
              value={formData.range}
              onChange={(val) => setFormData({ ...formData, range: val })}
              placeholder="e.g. ₹2.5L - ₹5L"
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
              Save Estimate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
