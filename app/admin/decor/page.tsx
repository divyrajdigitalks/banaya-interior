"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Image as ImageIcon,
  Palette,
  Tag,
  Box,
  Layers,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const DECOR_ITEMS = [
  { id: "1", name: "Royal Gold Vase", category: "Vases", price: "₹4,999", material: "Ceramic", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800" },
  { id: "2", name: "Velvet Persian Cushion", category: "Textiles", price: "₹2,499", material: "Silk Velvet", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800" },
  { id: "3", name: "Antique Brass Mirror", category: "Mirrors", price: "₹12,999", material: "Brass", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" },
];

export default function AdminDecorManagementPage() {
  const [items, setItems] = useState(DECOR_ITEMS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<any>({
    name: "",
    category: "",
    price: "",
    material: "",
    image: "",
    description: ""
  });

  const handleOpenDialog = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        material: "",
        image: "",
        description: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.image) return;
    
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? formData : i));
    } else {
      const item = {
        id: (items.length + 1).toString(),
        ...formData
      };
      setItems([item, ...items]);
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-xs font-medium text-gold">Inventory Management</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-sans font-black text-charcoal tracking-tight uppercase">
            Decor <span className="text-gold">Collection</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
            <Input 
              placeholder="Search masterpieces..." 
              className="bg-white border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-charcoal hover:bg-gold text-white font-medium text-sm py-6 px-8 rounded-2xl transition-all duration-500 shadow-xl shadow-charcoal/10 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} />
                Add New Item
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>

            <DialogContent className="max-w-2xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-charcoal p-8 text-white relative">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif font-semibold tracking-tight text-white">
                    {editingItem ? "Edit Decor Masterpiece" : "New Decor Masterpiece"}
                  </DialogTitle>
                  <p className="text-xs text-gold font-medium mt-1">Item Details & Inventory Data</p>
                </DialogHeader>
                <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
                  <Sparkles size={80} />
                </div>
              </div>
              
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Item Name</Label>
                    <Input 
                      placeholder="e.g. Royal Gold Vase" 
                      className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Category</Label>
                    <Input 
                      placeholder="e.g. Vases" 
                      className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Price (₹)</Label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                      <Input 
                        placeholder="e.g. 4,999" 
                        className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Material</Label>
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                      <Input 
                        placeholder="e.g. Ceramic" 
                        className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Image URL</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                    <Input 
                      placeholder="https://images.unsplash.com/..." 
                      className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Description</Label>
                  <textarea 
                    placeholder="Describe the item's features and history..." 
                    className="w-full min-h-[120px] bg-warm-cream/30 border border-charcoal/5 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 outline-none transition-all placeholder:text-charcoal/20"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter className="p-8 pt-4 border-t border-charcoal/5 flex sm:justify-between items-center bg-warm-cream/10">
                <button onClick={() => setIsDialogOpen(false)} className="text-sm font-medium text-charcoal/40 hover:text-charcoal transition-colors">Cancel</button>
                <Button 
                  onClick={handleSave}
                  className="bg-gold hover:bg-charcoal text-white font-medium text-sm py-5 px-10 rounded-2xl transition-all duration-500 shadow-xl shadow-gold/10"
                >
                  {editingItem ? "Update Item" : "Add to Collection"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* ── Items Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-charcoal/5 shadow-xl hover:shadow-2xl transition-all duration-700 group rounded-[2.5rem] overflow-hidden bg-white flex flex-col h-full">
              <div className="relative aspect-square overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-charcoal/80 backdrop-blur-md text-gold text-[10px] font-medium px-3 py-1.5 rounded-full border border-gold/20">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex gap-2">
                  <button 
                    onClick={() => handleOpenDialog(item)}
                    className="p-3 bg-white/90 backdrop-blur-md text-charcoal rounded-xl hover:bg-gold hover:text-white transition-all shadow-xl"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-3 bg-white/90 backdrop-blur-md text-charcoal rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <CardContent className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Box size={10} className="text-gold" />
                    <span className="text-xs font-medium text-charcoal/30">{item.material}</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-charcoal tracking-tight group-hover:text-gold transition-colors duration-500">
                    {item.name}
                  </h3>
                </div>
                
                <div className="pt-4 mt-auto border-t border-charcoal/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-charcoal/30">Investment</span>
                    <span className="text-lg font-serif font-semibold text-charcoal">{item.price}</span>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-medium text-charcoal hover:text-gold transition-colors group/btn">
                    Details <ShoppingBag size={12} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
