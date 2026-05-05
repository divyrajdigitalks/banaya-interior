"use client";

import { useState } from "react";
import { Search, Briefcase, Edit3, Trash2 } from "lucide-react";
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
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";

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
  const [formData, setFormData] = useState<any>({ name: "", categoryId: "", description: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Project Info",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4 max-w-md">
          <div className="w-16 h-12 rounded-xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-charcoal truncate">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">{item.categoryName}</p>
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
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="p-2 hover:bg-warm-cream rounded-xl text-charcoal/30 hover:text-charcoal"
          >
            <Edit3 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); setProjects(projects.filter(p => p.id !== item.id)); }}
            className="p-2 hover:bg-red-50 rounded-xl text-charcoal/30 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
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
      setFormData({ name: "", categoryId: "", description: "", image: "" });
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
    <div className="space-y-12 pb-12">
      <AdminPageHeader 
        title="Interior Projects"
        subtitle="Interior Management"
        actionLabel="Add Interior Project"
        onAction={() => handleOpenDialog()}
      />

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input 
          placeholder="Search projects..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all shadow-xl shadow-charcoal/5"
        />
      </div>

      <AdminTable columns={columns} data={filteredProjects} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black text-charcoal">
              {editingProject ? "Edit" : "Add"} <span className="text-gold font-bold">Interior Project</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-8">
            <div className="space-y-3">
              <Label className="text-xs font-bold tracking-tight text-charcoal/40">Select Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(val) => setFormData({...formData, categoryId: val})}
              >
                <SelectTrigger className="h-14 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-charcoal/5 shadow-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="rounded-xl py-3 px-4">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <AdminFormInput 
              label="Project Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Modern Minimalist Villa"
            />

            <div className="space-y-3">
              <Label className="text-xs font-bold tracking-tight text-charcoal/40">Description</Label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description..."
                className="w-full h-32 p-4 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all text-sm resize-none"
              />
            </div>

            <ImageUpload 
              label="Project Image"
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
            />
          </div>
          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-2xl shadow-lg shadow-gold/20">Save Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
