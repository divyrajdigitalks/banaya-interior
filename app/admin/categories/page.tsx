"use client";

import { useState } from "react";
import { Search, Layers, Edit3, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";

const INITIAL_CATEGORIES = [
  { id: "1", name: "Living Room", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" },
  { id: "2", name: "Bedroom", image: "https://images.unsplash.com/photo-1616486341351-79b5b248883e?auto=format&fit=crop&q=80&w=800" },
  { id: "3", name: "Kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Category Info",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-charcoal/5">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-charcoal">{item.name}</span>
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
            onClick={(e) => { e.stopPropagation(); setCategories(categories.filter(c => c.id !== item.id)); }}
            className="p-2 hover:bg-red-50 rounded-xl text-charcoal/30 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({ name: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.image) return;
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? formData : c));
    } else {
      setCategories([{ id: Date.now().toString(), ...formData }, ...categories]);
    }
    setIsDialogOpen(false);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      <AdminPageHeader 
        title="Decor Categories"
        subtitle="Decor Management"
        actionLabel="Add Decor Category"
        onAction={() => handleOpenDialog()}
      />

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input 
          placeholder="Search categories..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all shadow-xl shadow-charcoal/5"
        />
      </div>

      <AdminTable columns={columns} data={filteredCategories} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2.5rem] p-10 mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black text-charcoal">
              {editingCategory ? "Edit" : "Add"} <span className="text-gold font-bold">Decor Category</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-8">
            <AdminFormInput 
              label="Category Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Living Room"
            />
            <ImageUpload 
              label="Category Image"
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
            />
          </div>
          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-2xl">Save Decor Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
