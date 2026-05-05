"use client";

import { useState, useMemo } from "react";
import { Search, Package, Edit3, Trash2, Tag } from "lucide-react";
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
import { MultiImageUpload } from "@/components/admin/multi-image-upload";

const INITIAL_CATEGORIES = [
  { id: "1", name: "Living Room" },
  { id: "2", name: "Bedroom" },
  { id: "3", name: "Kitchen" },
];

const INITIAL_SUBCATEGORIES = [
  { id: "1", name: "Coffee Tables", categoryId: "1" },
  { id: "2", name: "Sofas", categoryId: "1" },
  { id: "3", name: "Beds", categoryId: "2" },
  { id: "4", name: "Kitchen Cabinets", categoryId: "3" },
];

const INITIAL_PRODUCTS = [
  { 
    id: "1", 
    name: "Royal Teak Coffee Table", 
    categoryId: "1", 
    subcategoryId: "1",
    price: 15000,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    subImages: [""]
  },
];

export default function AdminProductsPage() {
  const [categories] = useState(INITIAL_CATEGORIES);
  const [subcategories] = useState(INITIAL_SUBCATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Product Details",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-charcoal/5">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">
              {categories.find(c => c.id === item.categoryId)?.name} • {subcategories.find(s => s.id === item.subcategoryId)?.name}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Pricing",
      accessorKey: "price",
      cell: (item: any) => (
        <div className="space-y-0.5">
          <p className="font-black text-charcoal">₹{item.price}</p>
          {item.originalPrice && (
            <p className="text-[10px] text-charcoal/30 line-through">₹{item.originalPrice}</p>
          )}
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
            onClick={(e) => { e.stopPropagation(); setProducts(products.filter(p => p.id !== item.id)); }}
            className="p-2 hover:bg-red-50 rounded-xl text-charcoal/30 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const [formData, setFormData] = useState<any>({
    name: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    originalPrice: "",
    image: "",
    subImages: [""]
  });

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter(s => s.categoryId === formData.categoryId);
  }, [formData.categoryId, subcategories]);

  const handleOpenDialog = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        categoryId: "",
        subcategoryId: "",
        price: "",
        originalPrice: "",
        image: "",
        subImages: [""]
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || !formData.subcategoryId || !formData.image) return;
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? formData : p));
    } else {
      setProducts([{ id: Date.now().toString(), ...formData }, ...products]);
    }
    setIsDialogOpen(false);
  };

  const displayProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      <AdminPageHeader 
        title="Decor Products"
        subtitle="Decor Management"
        actionLabel="Add Decor Product"
        onAction={() => handleOpenDialog()}
      />

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
        <Input 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all shadow-xl shadow-charcoal/5"
        />
      </div>

      <AdminTable columns={columns} data={displayProducts} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] w-[95vw] rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black text-charcoal">
              {editingProduct ? "Edit" : "Add"} <span className="text-gold font-bold">Product</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8">
            <div className="space-y-6">
              <AdminFormInput 
                label="Product Name"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="e.g. Royal Teak Table"
              />

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-charcoal/40">Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val) => setFormData({...formData, categoryId: val, subcategoryId: ""})}
                >
                  <SelectTrigger className="h-14 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-charcoal/5 shadow-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-charcoal/40">Subcategory</Label>
                <Select 
                  value={formData.subcategoryId} 
                  onValueChange={(val) => setFormData({...formData, subcategoryId: val})}
                  disabled={!formData.categoryId}
                >
                  <SelectTrigger className="h-14 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all">
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-charcoal/5 shadow-xl">
                    {filteredSubcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AdminFormInput 
                  label="Rate (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(val) => setFormData({ ...formData, price: val })}
                  placeholder="15000"
                />
                <AdminFormInput 
                  label="Original Rate (₹)"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(val) => setFormData({ ...formData, originalPrice: val })}
                  placeholder="18000"
                />
              </div>
            </div>

            <div className="space-y-8">
              <ImageUpload 
                label="Main Product Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
              />

              <MultiImageUpload 
                label="Sub Images"
                value={formData.subImages}
                onChange={(val) => setFormData({ ...formData, subImages: val })}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-4 pt-6 border-t border-charcoal/5">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-2xl shadow-lg shadow-gold/20">Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
