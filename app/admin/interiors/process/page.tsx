"use client";

import { useState } from "react";
import { Search, Edit3, Trash2, Plus, Save, Search as SearchIcon, PenTool, Hammer, PackageCheck, Heart, Type, FileText } from "lucide-react";
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
  { id: "Search", icon: SearchIcon, label: "Consultation" },
  { id: "PenTool", icon: PenTool, label: "Design" },
  { id: "Hammer", icon: Hammer, label: "Execution" },
  { id: "PackageCheck", icon: PackageCheck, label: "Handover" },
  { id: "Heart", icon: Heart, label: "After Sales" },
];

const INITIAL_PROCESS = [
  {
    id: "1",
    iconId: "Search",
    step: "01",
    title: "Consultation",
    desc: "Understanding your needs & lifestyle",
  },
  {
    id: "2",
    iconId: "PenTool",
    step: "02",
    title: "Design & Planning",
    desc: "Concept, 3D designs & planning",
  },
  {
    id: "3",
    iconId: "Hammer",
    step: "03",
    title: "Execution",
    desc: "Quality execution with precision",
  },
  {
    id: "4",
    iconId: "PackageCheck",
    step: "04",
    title: "Handover",
    desc: "Timely handover with perfection",
  },
  {
    id: "5",
    iconId: "Heart",
    step: "05",
    title: "After Sales Service",
    desc: "We're with you, always",
  },
];

export default function InteriorProcessPage() {
  const [processSteps, setProcessSteps] = useState(INITIAL_PROCESS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ step: "", title: "", desc: "", iconId: "Search" });
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Step",
      accessorKey: "step",
      cell: (item: any) => (
        <span className="font-black text-gold bg-gold/5 px-3 py-1 rounded-full border border-gold/10 text-xs">
          {item.step}
        </span>
      )
    },
    {
      header: "Process Info",
      accessorKey: "title",
      cell: (item: any) => {
        const Icon = ICON_OPTIONS.find(i => i.id === item.iconId)?.icon || SearchIcon;
        return (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal/60 border border-charcoal/10">
              <Icon size={18} />
            </div>
            <div>
              <p className="font-bold text-charcoal">{item.title}</p>
              <p className="text-[10px] text-charcoal/40 font-medium line-clamp-1">{item.desc}</p>
            </div>
          </div>
        );
      }
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
            onClick={(e) => { e.stopPropagation(); setProcessSteps(processSteps.filter(s => s.id !== item.id)); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (step: any = null) => {
    if (step) {
      setEditingStep(step);
      setFormData(step);
    } else {
      setEditingStep(null);
      // Auto-increment step number
      const nextStepNum = (processSteps.length + 1).toString().padStart(2, '0');
      setFormData({ step: nextStepNum, title: "", desc: "", iconId: "Search" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.step || !formData.title || !formData.desc) return;

    if (editingStep) {
      setProcessSteps(processSteps.map(s => s.id === editingStep.id ? formData : s));
    } else {
      setProcessSteps([...processSteps, { id: Date.now().toString(), ...formData }]);
    }
    setIsDialogOpen(false);
  };

  const filteredSteps = processSteps.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.step.includes(searchQuery)
  );

  return (
    <div className="space-y-12 pb-24 pt-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-[500px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={20} />
          <Input 
            placeholder="Search process steps..." 
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
          Add New Step
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredSteps} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] w-[95vw] rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto border-none shadow-2xl">
          <DialogHeader className="pb-8 border-b border-charcoal/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <PenTool size={24} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-charcoal">
                  {editingStep ? "Edit" : "New"} <span className="text-gold font-bold">Process Step</span>
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Design Workflow</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-10">
            <div className="grid grid-cols-2 gap-6">
              <AdminFormInput 
                label="Step Number"
                value={formData.step}
                onChange={(val) => setFormData({ ...formData, step: val })}
                placeholder="e.g. 01"
              />
              <AdminFormInput 
                label="Title"
                value={formData.title}
                onChange={(val) => setFormData({ ...formData, title: val })}
                placeholder="e.g. Consultation"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Choose Icon</Label>
              <div className="grid grid-cols-5 gap-3">
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
                    <opt.icon size={20} />
                    <span className="text-[7px] font-black uppercase tracking-widest text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Description</Label>
              <textarea 
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Briefly explain this step..."
                className="w-full h-24 p-5 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all text-sm font-medium leading-relaxed resize-none"
              />
            </div>
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
              Save Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
