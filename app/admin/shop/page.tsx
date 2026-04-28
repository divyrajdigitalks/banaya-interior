"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Image as ImageIcon,
  Check,
  X,
  Package
} from "lucide-react";
import { FEATURED_PRODUCTS, CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export default function AdminShopManagementPage() {
  const [products, setProducts] = useState(FEATURED_PRODUCTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<any>({});

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        price: 0,
        category: CATEGORIES[0].name,
        image: "",
        description: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? formData : p));
    } else {
      setProducts([formData, ...products]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

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
            <span className="text-xs font-medium text-gold">Commerce Center</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal tracking-tight">
            Shop <span className="italic font-light text-gold">Management</span>
          </h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-charcoal hover:bg-gold text-white font-medium text-sm py-6 px-8 rounded-2xl transition-all duration-500 shadow-xl shadow-charcoal/10 group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={16} />
              Add New Masterpiece
            </span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>
          <DialogContent className="max-w-2xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-charcoal p-8 text-white relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-semibold tracking-tight text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <p className="text-xs text-gold font-medium mt-1">Product Details & Specs</p>
              </DialogHeader>
              <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
                <Package size={80} />
              </div>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Product Name</Label>
                  <Input 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. The Royal Lounge" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Price (₹)</Label>
                  <Input 
                    type="number" 
                    value={formData.price || ""} 
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    placeholder="45,000" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Category</Label>
                  <Select 
                    value={formData.category?.toLowerCase()} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-charcoal/5 rounded-2xl">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.name} value={cat.name.toLowerCase()} className="text-xs font-medium focus:bg-warm-cream">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Tag (Optional)</Label>
                  <Input 
                    value={formData.tag || ""} 
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    placeholder="e.g. New Arrival" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" 
                  />
                </div>
              </div>
              
              <div className="space-y-2.5">
                <Label className="text-xs font-medium text-charcoal/60 ml-1">Main Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                  <Input 
                    value={formData.image || ""} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-medium text-charcoal/60 ml-1">Description</Label>
                <textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell the story of this piece..." 
                  className="w-full min-h-[120px] bg-warm-cream/30 border border-charcoal/5 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 outline-none transition-all placeholder:text-charcoal/20"
                />
              </div>
            </div>
            
            <DialogFooter className="p-8 pt-4 border-t border-charcoal/5 flex sm:justify-between items-center bg-warm-cream/10">
              <button onClick={() => setIsDialogOpen(false)} className="text-sm font-medium text-charcoal/40 hover:text-charcoal transition-colors">Cancel</button>
              <Button onClick={handleSave} className="bg-gold hover:bg-charcoal text-white font-medium text-sm py-5 px-10 rounded-2xl transition-all duration-500 shadow-xl shadow-gold/10">
                {editingProduct ? "Update Product" : "Publish Masterpiece"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium focus:ring-2 focus:ring-gold/5 shadow-xl shadow-charcoal/5"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-charcoal/5 rounded-2xl text-xs font-medium text-charcoal hover:bg-warm-cream transition-all shadow-lg shadow-charcoal/5">
            <Filter size={14} className="text-gold" /> Filter By
          </button>
          <div className="h-10 w-[1px] bg-charcoal/5 hidden lg:block" />
          {["All", ...CATEGORIES.map(c => c.name)].map(cat => (
            <button key={cat} className="px-6 py-4 bg-white/50 border border-charcoal/5 rounded-2xl text-xs font-medium text-charcoal/40 hover:bg-white hover:text-charcoal hover:shadow-lg transition-all">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product List ── */}
      <Card className="border-charcoal/5 shadow-2xl rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-charcoal/5 bg-warm-cream/30">
                  <th className="px-8 py-5 text-[10px] font-semibold text-charcoal/40">Product Piece</th>
                  <th className="px-8 py-5 text-[10px] font-semibold text-charcoal/40">Category</th>
                  <th className="px-8 py-5 text-[10px] font-semibold text-charcoal/40">Price</th>
                  <th className="px-8 py-5 text-[10px] font-semibold text-charcoal/40">Stock Status</th>
                  <th className="px-8 py-5 text-[10px] font-semibold text-charcoal/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-warm-cream/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-warm-cream border border-charcoal/5 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal leading-tight">{product.name}</p>
                          <p className="text-[10px] font-medium text-charcoal/30 mt-1">ID: #{product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-semibold text-gold bg-gold/5 px-3 py-1.5 rounded-full border border-gold/10">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-charcoal tracking-tight">₹{product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-500">In Stock</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDialog(product)}
                          className="p-3 hover:bg-white rounded-xl text-charcoal/30 hover:text-gold transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-3 hover:bg-white rounded-xl text-charcoal/30 hover:text-red-500 transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-3 hover:bg-white rounded-xl text-charcoal/30 hover:text-charcoal transition-all shadow-sm">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-medium text-charcoal/30">
          Showing <span className="text-charcoal">{filteredProducts.length}</span> of <span className="text-charcoal">{products.length}</span> Masterpieces
        </p>
        <div className="flex items-center gap-2">
          <button className="px-6 py-3 rounded-xl bg-white border border-charcoal/5 text-xs font-medium text-charcoal/30 cursor-not-allowed">Previous</button>
          <button className="px-6 py-3 rounded-xl bg-charcoal text-white text-xs font-medium shadow-xl shadow-charcoal/10 hover:bg-gold transition-all">Next</button>
        </div>
      </div>
    </div>
  );
}
