"use client";

import { useState } from "react";
import { Search, Briefcase, Edit3, Trash2, Layout, Save, MapPin, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { motion } from "framer-motion";

const INITIAL_CATEGORIES = [
  { id: "1", name: "Residential" },
  { id: "2", name: "Commercial" },
  { id: "3", name: "Hospitality" },
];

const INITIAL_PROJECTS = [
  { 
    id: "1", 
    name: "Modern Minimalist Villa", 
    categoryId: "1", 
    categoryName: "Residential",
    description: "A beautiful minimalist villa project in the heart of Mumbai.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" 
  },
];

export default function InteriorProjectsPage() {
  const [categories] = useState(INITIAL_CATEGORIES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", categoryId: "", description: "", image: "", location: "" });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Section Content State
  const [sectionContent, setSectionContent] = useState({
    subHeading: "Portfolio of distinction",
    headingLine1: "Living",
    headingLine2: "Masterpieces.",
    description: "Each project is a unique dialogue between architecture and soul, meticulously crafted to reflect the essence of its inhabitants.",
    bgText: "Legacy"
  });

  const handleSaveSection = () => {
    console.log("Saving Section Content:", sectionContent);
    alert("Project Section content updated!");
  };

  const columns = [
    {
      header: "Project Info",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4 max-w-md">
          <div className="w-20 h-14 rounded-2xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-charcoal truncate">{item.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10">{item.categoryName}</span>
              <span className="text-[9px] font-bold text-charcoal/30 flex items-center gap-1 uppercase tracking-widest">
                <MapPin size={10} /> {item.location || "Location N/A"}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "ID",
      accessorKey: "id",
      cell: (item: any) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">#{item.id}</span>
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
            onClick={(e) => { e.stopPropagation(); setProjects(projects.filter(p => p.id !== item.id)); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({ name: "", categoryId: "", description: "", image: "", location: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || !formData.image) return;
    const category = categories.find(c => c.id === formData.categoryId);
    const dataWithCategoryName = { ...formData, categoryName: category?.name || "" };

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? dataWithCategoryName : p));
    } else {
      setProjects([{ id: Date.now().toString(), ...dataWithCategoryName }, ...projects]);
    }
    setIsDialogOpen(false);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-24 pt-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Section Content Management ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[3rem] shadow-sm border border-charcoal/5 space-y-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between pb-6 border-b border-charcoal/5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
              <Layout size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-charcoal">Projects Section Details</h2>
              <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-widest mt-0.5">Left Side Branding & Content</p>
            </div>
          </div>
          <Button 
            onClick={handleSaveSection}
            className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-8 h-12 rounded-2xl flex items-center gap-2 shadow-xl"
          >
            <Save size={16} className="text-gold" />
            Update Content
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[11px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Sub-Heading Label</Label>
              <input 
                value={sectionContent.subHeading}
                onChange={(e) => setSectionContent({ ...sectionContent, subHeading: e.target.value })}
                className="w-full h-14 px-6 rounded-2xl border-2 border-charcoal/5 bg-charcoal/5 focus:bg-white focus:border-gold/50 focus:ring-8 focus:ring-gold/5 transition-all outline-none text-sm font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[11px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Heading Line 1</Label>
                <input 
                  value={sectionContent.headingLine1}
                  onChange={(e) => setSectionContent({ ...sectionContent, headingLine1: e.target.value })}
                  className="w-full h-14 px-6 rounded-2xl border-2 border-charcoal/5 bg-charcoal/5 focus:bg-white focus:border-gold/50 transition-all outline-none text-lg font-black"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[11px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Heading Line 2 (Gold)</Label>
                <input 
                  value={sectionContent.headingLine2}
                  onChange={(e) => setSectionContent({ ...sectionContent, headingLine2: e.target.value })}
                  className="w-full h-14 px-6 rounded-2xl border-2 border-charcoal/5 bg-charcoal/5 focus:bg-white focus:border-gold/50 transition-all outline-none text-lg font-black text-gold"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[11px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Main Description</Label>
              <textarea 
                value={sectionContent.description}
                onChange={(e) => setSectionContent({ ...sectionContent, description: e.target.value })}
                className="w-full h-32 p-6 rounded-2xl border-2 border-charcoal/5 bg-charcoal/5 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-medium leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Project List Management ── */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:w-[500px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={20} />
            <Input 
              placeholder="Search projects by name or category..." 
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
            Add New Project
          </Button>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-charcoal/5 overflow-hidden">
          <AdminTable columns={columns} data={filteredProjects} />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] w-[95vw] rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto border-none shadow-2xl">
          <DialogHeader className="pb-8 border-b border-charcoal/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Briefcase size={24} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-charcoal">
                  {editingProject ? "Refine" : "Create"} <span className="text-gold font-bold">Project</span>
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Portfolio Entry</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Project Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val) => setFormData({...formData, categoryId: val})}
                >
                  <SelectTrigger className="h-14 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all text-sm font-bold">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-charcoal/5 shadow-2xl p-2">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="rounded-xl py-3 px-4 font-bold focus:bg-gold/10 focus:text-gold">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <AdminFormInput 
                label="Project Title"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="e.g. Niseko Dining House"
              />

              <AdminFormInput 
                label="Location (City, Country)"
                value={formData.location}
                onChange={(val) => setFormData({ ...formData, location: val })}
                placeholder="e.g. Hokkaido, Japan"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Project Narrative</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell the story of this masterpiece..."
                  className="w-full h-[148px] p-5 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all text-sm font-medium leading-relaxed resize-none"
                />
              </div>

              <ImageUpload 
                label="Hero Showcase Photo"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
              />
            </div>
          </div>

          <DialogFooter className="pt-8 border-t border-charcoal/5 flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="flex-1 h-16 rounded-2xl border-charcoal/10 font-bold text-charcoal/60 hover:bg-charcoal/5 transition-all"
            >
              Discard
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 h-16 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-charcoal/10 transition-all active:scale-95"
            >
              Confirm & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
