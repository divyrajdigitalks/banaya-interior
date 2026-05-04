"use client";

import { useState } from "react";
import { Search, Grid } from "lucide-react";
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
import { AdminGridCard } from "@/components/admin/grid-card";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";

const INITIAL_CATEGORIES = [
  { id: "1", name: "Living Room" },
  { id: "2", name: "Bedroom" },
  { id: "3", name: "Kitchen" },
];

const INITIAL_SUBCATEGORIES = [
  { id: "1", name: "Coffee Tables", categoryId: "1", categoryName: "Living Room", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800" },
  { id: "2", name: "Sofas", categoryId: "1", categoryName: "Living Room", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" },
  { id: "3", name: "Beds", categoryId: "2", categoryName: "Bedroom", image: "https://images.unsplash.com/photo-1505693333510-5d03d203c53a?auto=format&fit=crop&q=80&w=800" },
];

export default function AdminSubcategoriesPage() {
  const [categories] = useState(INITIAL_CATEGORIES);
  const [subcategories, setSubcategories] = useState(INITIAL_SUBCATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", categoryId: "", image: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenDialog = (subcategory: any = null) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setFormData(subcategory);
    } else {
      setEditingSubcategory(null);
      setFormData({ name: "", categoryId: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || !formData.image) return;
    const category = categories.find(c => c.id === formData.categoryId);
    const dataWithCategoryName = { ...formData, categoryName: category?.name || "" };

    if (editingSubcategory) {
      setSubcategories(subcategories.map(s => s.id === editingSubcategory.id ? dataWithCategoryName : s));
    } else {
      setSubcategories([{ id: Date.now().toString(), ...dataWithCategoryName }, ...subcategories]);
    }
    setIsDialogOpen(false);
  };

  const filteredSubcategories = subcategories.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      <AdminPageHeader 
        title="Decor Subcategories"
        subtitle="Decor Management"
        actionLabel="Add Decor Subcategory"
        onAction={() => handleOpenDialog()}
      />

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input 
          placeholder="Search subcategories..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSubcategories.map((subcategory, index) => (
          <AdminGridCard 
            key={subcategory.id}
            {...subcategory}
            category={subcategory.categoryName}
            icon={Grid}
            onEdit={() => handleOpenDialog(subcategory)}
            onDelete={() => setSubcategories(subcategories.filter(s => s.id !== subcategory.id))}
            index={index}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-black">
              {editingSubcategory ? "Edit" : "Add"} <span className="text-gold italic font-light">Subcategory</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-8">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-charcoal/40">Select Category</Label>
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
              label="Subcategory Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Coffee Tables"
            />
            <ImageUpload 
              label="Subcategory Image"
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
            />
          </div>
          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-2xl">Save Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
