"use client";

import { useState } from "react";
import { Search, GalleryHorizontal, Edit3, Trash2 } from "lucide-react";
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

const INITIAL_GALLERY = [
  { 
    id: "1", 
    name: "Elegant Living Space", 
    subtitle: "Modern Minimalist",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" 
  },
];

export default function InteriorGalleryPage() {
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", subtitle: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Gallery Item",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-xl overflow-hidden shadow-md border border-charcoal/5">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">{item.subtitle}</p>
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
            onClick={(e) => { e.stopPropagation(); setGallery(gallery.filter(g => g.id !== item.id)); }}
            className="p-2 hover:bg-red-50 rounded-xl text-charcoal/30 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: "", subtitle: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.image) return;
    if (editingItem) {
      setGallery(gallery.map(item => item.id === editingItem.id ? formData : item));
    } else {
      setGallery([{ id: Date.now().toString(), ...formData }, ...gallery]);
    }
    setIsDialogOpen(false);
  };

  const filteredGallery = gallery.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      <AdminPageHeader 
        title="Interior Gallery"
        subtitle="Interior Management"
        actionLabel="Add Gallery Item"
        onAction={() => handleOpenDialog()}
      />

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input 
          placeholder="Search gallery..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all shadow-xl shadow-charcoal/5"
        />
      </div>

      <AdminTable columns={columns} data={filteredGallery} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2.5rem] p-10 mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black text-charcoal">
              {editingItem ? "Edit" : "Add"} <span className="text-gold font-bold">Gallery Item</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-8">
            <AdminFormInput 
              label="Title"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Elegant Living Space"
            />
            <AdminFormInput 
              label="Subtitle"
              value={formData.subtitle}
              onChange={(val) => setFormData({ ...formData, subtitle: val })}
              placeholder="e.g. Modern Minimalist"
            />
            <ImageUpload 
              label="Gallery Image"
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
            />
          </div>
          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-2xl shadow-lg shadow-gold/20">Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
