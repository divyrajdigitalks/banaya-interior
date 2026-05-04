"use client";

import { useState } from "react";
import { Search, GalleryHorizontal } from "lucide-react";
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
import { AdminGridCard } from "@/components/admin/grid-card";
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
        subtitle="Interiors Management"
        actionLabel="Add Gallery Item"
        onAction={() => handleOpenDialog()}
      />

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input 
          placeholder="Search gallery..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGallery.map((item, index) => (
          <AdminGridCard 
            key={item.id}
            {...item}
            category={item.subtitle}
            icon={GalleryHorizontal}
            onEdit={() => handleOpenDialog(item)}
            onDelete={() => setGallery(gallery.filter(i => i.id !== item.id))}
            index={index}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-black">
              {editingItem ? "Edit" : "Add"} <span className="text-gold italic font-light">Interior Gallery Item</span>
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
