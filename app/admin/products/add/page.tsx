"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Package, Info, Image as ImageIcon, LayoutGrid, Tag, IndianRupee, Sparkles, Plus, Trash2, ListChecks, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

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

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    name: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    originalPrice: "",
    image: "",
    subImages: ["", "", ""],
    description: "",
    stock: "",
    sku: "",
    sizes: ["Small (12 x 8 in)", "Medium (16 x 10 in)", "Large (18 x 12 in)"],
    tags: ["Bestseller"],
    isPersonalisable: true,
    features: ["Elegant natural wood finish", "Sturdy handles for easy grip"],
    specifications: [
      { label: "Material", value: "Premium Sheesham Wood" },
      { label: "Finish", value: "Food Safe Natural Oil" }
    ],
    careInstructions: "Wipe with a soft damp cloth. Do not soak in water.",
    shippingReturns: "Free shipping on orders above ₹1499. 7 days easy return policy."
  });

  const [newSize, setNewSize] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return INITIAL_SUBCATEGORIES.filter(s => s.categoryId === formData.categoryId);
  }, [formData.categoryId]);

  const addSize = () => {
    if (newSize.trim()) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] });
      setNewSize("");
    }
  };

  const removeSize = (index: number) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((_: any, i: number) => i !== index) });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_: any, i: number) => i !== index) });
  };

  const addSpec = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { label: "", value: "" }] });
  };

  const updateSpec = (index: number, field: string, value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpec = (index: number) => {
    setFormData({ ...formData, specifications: formData.specifications.filter((_: any, i: number) => i !== index) });
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || !formData.subcategoryId || !formData.image) {
      alert("Please fill all required fields");
      return;
    }
    console.log("Saving product:", formData);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-0 z-40 bg-white/80 backdrop-blur-xl py-6 border-b border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group"
          >
            <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Inventory Management</span>
              </div>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">New Collection Entry</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex-1 sm:flex-none h-14 px-10 rounded-2xl border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Discard Changes
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 sm:flex-none h-14 bg-slate-900 hover:bg-black text-white font-bold text-sm px-12 rounded-2xl shadow-2xl shadow-slate-200 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={20} className="text-blue-400" />
            Publish Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* Card: Basic Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">General Information</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Core Product Details</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Product Identity</Label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Teak Wood Dining Table"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none text-lg font-bold placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">The Story / Description</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Craft a compelling narrative about this masterpiece..."
                  className="w-full h-56 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none text-base font-medium leading-relaxed resize-none placeholder:text-slate-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Card: Pricing & Inventory */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                  <IndianRupee size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Pricing & Inventory</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Financials and Stock Control</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Selling Price (₹)</Label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-emerald-500 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full h-16 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-emerald-500/50 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none text-xl font-black"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Original Price (₹)</Label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-slate-400 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full h-16 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-slate-300 focus:ring-8 focus:ring-slate-500/5 transition-all outline-none text-xl font-black text-slate-400 line-through decoration-slate-300"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">SKU Identification</Label>
                <input 
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. FURN-ROYAL-001"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-base font-bold uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">In-Stock Quantity</Label>
                <input 
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-xl font-black"
                />
              </div>
            </div>
          </motion.div>

          {/* Card: Media */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Product Gallery</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Showcase Images and Angles</p>
                </div>
              </div>
            </div>
            <MultiImageUpload 
              label="Upload Multiple Images"
              value={formData.subImages}
              onChange={(val) => setFormData({ ...formData, subImages: val })}
            />
          </motion.div>

          {/* Card: Features & Specifications */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                  <ListChecks size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Features & Specifications</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Technical and Aesthetic Details</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {/* Features List */}
              <div className="space-y-4">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Key Features</Label>
                <div className="flex gap-4">
                  <input 
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature (e.g. Handcrafted from Teak)"
                    className="flex-1 h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white transition-all outline-none font-bold"
                  />
                  <Button onClick={addFeature} type="button" className="h-14 w-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white">
                    <Plus size={24} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                      <span className="text-sm font-bold text-slate-600">{feature}</span>
                      <button onClick={() => removeFeature(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Specifications</Label>
                  <Button onClick={addSpec} variant="ghost" className="text-xs font-black text-amber-600 uppercase tracking-widest hover:bg-amber-50">
                    <Plus size={14} className="mr-2" /> Add Spec
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.specifications.map((spec: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5">
                        <input 
                          value={spec.label}
                          onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                          placeholder="Label (e.g. Material)"
                          className="w-full h-12 px-6 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white transition-all outline-none font-bold text-sm"
                        />
                      </div>
                      <div className="md:col-span-6">
                        <input 
                          value={spec.value}
                          onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                          placeholder="Value (e.g. Sheesham Wood)"
                          className="w-full h-12 px-6 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white transition-all outline-none font-bold text-sm"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-center">
                        <button onClick={() => removeSpec(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card: Care & Shipping */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Care & Shipping</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Post-Purchase Information</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Care Instructions</Label>
                <textarea 
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  placeholder="How to take care of this product..."
                  className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Shipping & Returns</Label>
                <textarea 
                  value={formData.shippingReturns}
                  onChange={(e) => setFormData({ ...formData, shippingReturns: e.target.value })}
                  placeholder="Details about shipping and return policy for this item..."
                  className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-10">
          {/* Card: Options & Sizes */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Settings2 size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Options</h3>
            </div>

            <div className="space-y-8">
              {/* Personalisation Switch */}
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-wider">Personalisation</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enable custom engraving</p>
                </div>
                <Switch 
                  checked={formData.isPersonalisable}
                  onCheckedChange={(val) => setFormData({ ...formData, isPersonalisable: val })}
                />
              </div>

              {/* Sizes Dynamic List */}
              <div className="space-y-4">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Available Sizes</Label>
                <div className="flex gap-2">
                  <input 
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="e.g. Medium (16x10 in)"
                    className="flex-1 h-12 px-4 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white transition-all outline-none font-bold text-xs"
                  />
                  <Button onClick={addSize} type="button" className="h-12 w-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white p-0">
                    <Plus size={20} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                      {size}
                      <button onClick={() => removeSize(idx)} className="hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Tags */}
              <div className="space-y-4 pt-4">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Product Badges/Tags</Label>
                <div className="flex flex-wrap gap-3">
                  {["Bestseller", "New Arrival", "Limited Edition", "Handcrafted"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const tags = formData.tags.includes(tag)
                          ? formData.tags.filter((t: string) => t !== tag)
                          : [...formData.tags, tag];
                        setFormData({ ...formData, tags });
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.tags.includes(tag)
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card: Main Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Hero Image</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
              <ImageUpload 
                label="Primary Thumbnail"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
              />
            </div>
          </motion.div>

          {/* Card: Organization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <LayoutGrid size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Taxonomy</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Master Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val) => setFormData({...formData, categoryId: val, subcategoryId: ""})}
                >
                  <SelectTrigger className="h-16 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-orange-500/50 transition-all text-base font-bold">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 shadow-2xl p-2">
                    {INITIAL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="rounded-xl py-3 px-4 font-bold focus:bg-orange-50 focus:text-orange-600">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Sub-Category</Label>
                <Select 
                  value={formData.subcategoryId} 
                  onValueChange={(val) => setFormData({...formData, subcategoryId: val})}
                  disabled={!formData.categoryId}
                >
                  <SelectTrigger className="h-16 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-orange-500/50 transition-all text-base font-bold">
                    <SelectValue placeholder="Select Sub-Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 shadow-2xl p-2">
                    {filteredSubcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id} className="rounded-xl py-3 px-4 font-bold focus:bg-orange-50 focus:text-orange-600">{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Card: Tags/Status */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 p-10 rounded-[32px] shadow-2xl shadow-slate-200 space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-gold/20 transition-all duration-700" />
            
            <div className="flex items-center gap-3 text-gold relative z-10">
              <Sparkles size={20} className="animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.25em]">Ready to Launch?</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
              Double check your <span className="text-white font-bold">Pricing</span> and <span className="text-white font-bold">Inventory</span> before publishing this item to the store.
            </p>
            <Button 
              onClick={handleSave}
              className="w-full h-14 bg-gold hover:bg-white text-charcoal font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 relative z-10"
            >
              Publish Now
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
