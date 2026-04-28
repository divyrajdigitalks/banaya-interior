"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calculator,
  Home,
  LayoutGrid,
  Sparkles, 
  Zap, 
  Paintbrush, 
  Layers, 
  ChevronRight, 
  Settings2,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { 
  BHK_OPTIONS, 
  ROOM_OPTIONS, 
  FURNITURE_ITEMS, 
  BASIC_REQUIREMENTS,
  BRAND_OPTIONS,
  DETAILED_FURNITURE,
  GENERAL_SERVICES
} from "@/lib/data/calculator";

export default function AdminCalculatorManagementPage() {
  const [activeTab, setActiveTab] = useState("bhk");
  const [bhkOptions, setBhkOptions] = useState(BHK_OPTIONS);
  const [roomOptions, setRoomOptions] = useState(ROOM_OPTIONS);
  const [furnitureItems, setFurnitureItems] = useState(FURNITURE_ITEMS);
  const [basicReqs, setBasicReqs] = useState(BASIC_REQUIREMENTS);
  const [brandOptions, setBrandOptions] = useState(BRAND_OPTIONS);
  const [detailedFurniture, setDetailedFurniture] = useState(DETAILED_FURNITURE);
  const [generalServices, setGeneralServices] = useState(GENERAL_SERVICES);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleOpenDialog = (item: any = null) => {
    if (item && item.id) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      // Initialize based on tab
      const initialData: any = { 
        id: Math.random().toString(36).substr(2, 9),
        category: item?.category || "" 
      };
      if (activeTab === "bhk") initialData.price = 0;
      if (activeTab === "rooms") initialData.basePrice = 0;
      if (activeTab === "furniture") initialData.price = 0;
      if (activeTab === "requirements") initialData.price = 0;
      if (activeTab === "brands") initialData.multiplier = 1.0;
      if (activeTab === "detailed") initialData.price = 0;
      if (activeTab === "services") initialData.price = 0;
      setFormData(initialData);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (activeTab === "bhk") {
      if (editingItem) setBhkOptions(bhkOptions.map(o => o.id === editingItem.id ? formData : o));
      else setBhkOptions([...bhkOptions, formData]);
    } else if (activeTab === "rooms") {
      if (editingItem) setRoomOptions(roomOptions.map(o => o.id === editingItem.id ? formData : o));
      else setRoomOptions([...roomOptions, formData]);
    } else if (activeTab === "furniture") {
      if (editingItem) setFurnitureItems(furnitureItems.map(o => o.id === editingItem.id ? formData : o));
      else setFurnitureItems([...furnitureItems, formData]);
    } else if (activeTab === "requirements") {
      if (editingItem) setBasicReqs(basicReqs.map(o => o.id === editingItem.id ? formData : o));
      else setBasicReqs([...basicReqs, formData]);
    } else if (activeTab === "brands") {
      if (editingItem) setBrandOptions(brandOptions.map(o => o.id === editingItem.id ? formData : o));
      else setBrandOptions([...brandOptions, formData]);
    } else if (activeTab === "detailed") {
      // Logic for detailed furniture might be complex as it's an object of arrays
      // For simplicity, we can just handle it as a flat list if we pass the category in formData
      const category = formData.category || "Living Area";
      const updatedDetailed = { ...detailedFurniture };
      if (editingItem) {
        updatedDetailed[category] = updatedDetailed[category].map(o => o.id === editingItem.id ? formData : o);
      } else {
        updatedDetailed[category] = [...(updatedDetailed[category] || []), formData];
      }
      setDetailedFurniture(updatedDetailed);
    } else if (activeTab === "services") {
      if (editingItem) setGeneralServices(generalServices.map(o => o.id === editingItem.id ? formData : o));
      else setGeneralServices([...generalServices, formData]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, category?: string) => {
    if (activeTab === "bhk") setBhkOptions(bhkOptions.filter(o => o.id !== id));
    else if (activeTab === "rooms") setRoomOptions(roomOptions.filter(o => o.id !== id));
    else if (activeTab === "furniture") setFurnitureItems(furnitureItems.filter(o => o.id !== id));
    else if (activeTab === "requirements") setBasicReqs(basicReqs.filter(o => o.id !== id));
    else if (activeTab === "brands") setBrandOptions(brandOptions.filter(o => o.id !== id));
    else if (activeTab === "detailed" && category) {
      const updatedDetailed = { ...detailedFurniture };
      updatedDetailed[category] = updatedDetailed[category].filter(o => o.id !== id);
      setDetailedFurniture(updatedDetailed);
    }
    else if (activeTab === "services") setGeneralServices(generalServices.filter(o => o.id !== id));
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
            <span className="text-xs text-gold font-medium">Logic Engine</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal tracking-tight">
            Calculator <span className="italic font-light text-gold">Systems</span>
          </h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-charcoal hover:bg-gold text-white font-medium py-7 px-8 rounded-2xl transition-all duration-500 shadow-xl shadow-charcoal/10 group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={16} />
              Add New Configuration
            </span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>

          <DialogContent className="max-w-2xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-charcoal p-8 text-white relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-semibold tracking-tight text-white">
                  {editingItem ? "Edit" : "Add New"} {activeTab}
                </DialogTitle>
                <p className="text-xs text-gold font-medium mt-1">Update Calculator Logic Values</p>
              </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Name</Label>
                  <Input 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Premium Finish" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-normal" 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">
                    {activeTab === "brands" ? "Multiplier" : "Price (₹)"}
                  </Label>
                  <Input 
                    type="number"
                    value={activeTab === "brands" ? formData.multiplier : (formData.price || formData.basePrice || 0)} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      [activeTab === "brands" ? "multiplier" : (activeTab === "rooms" ? "basePrice" : "price")]: parseFloat(e.target.value)
                    })}
                    placeholder="Value" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-normal" 
                  />
                </div>
              </div>
              
              <div className="space-y-2.5">
                <Label className="text-xs font-medium text-charcoal/60 ml-1">Image URL</Label>
                <Input 
                  value={formData.image || ""} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..." 
                  className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-normal" 
                />
              </div>

              { (activeTab === "requirements" || activeTab === "detailed" || activeTab === "services") && (
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Unit</Label>
                  <Input 
                    value={formData.unit || ""} 
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="sqft / unit" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-normal" 
                  />
                </div>
              )}

              { activeTab === "detailed" && (
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-normal">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-charcoal/5 rounded-2xl">
                      {Object.keys(detailedFurniture).map(cat => (
                        <SelectItem key={cat} value={cat} className="text-xs font-medium focus:bg-warm-cream">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter className="p-8 pt-4 border-t border-charcoal/5 flex sm:justify-between items-center bg-warm-cream/10">
              <button onClick={() => setIsDialogOpen(false)} className="text-xs font-medium text-charcoal/40 hover:text-charcoal transition-colors">Cancel</button>
              <Button onClick={handleSave} className="bg-gold hover:bg-charcoal text-white font-medium py-6 px-10 rounded-2xl transition-all duration-500 shadow-xl shadow-gold/10">
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* ── Tabs Navigation ── */}
      <Tabs defaultValue="bhk" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-charcoal/5 h-auto flex flex-wrap gap-2">
          <TabsTrigger value="bhk" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Home size={14} className="mr-2" /> BHK Config
          </TabsTrigger>
          <TabsTrigger value="rooms" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <LayoutGrid size={14} className="mr-2" /> Room Base
          </TabsTrigger>
          <TabsTrigger value="furniture" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Sparkles size={14} className="mr-2" /> Furniture
          </TabsTrigger>
          <TabsTrigger value="requirements" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Zap size={14} className="mr-2" /> Essentials
          </TabsTrigger>
          <TabsTrigger value="brands" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Layers size={14} className="mr-2" /> Brand Multipliers
          </TabsTrigger>
          <TabsTrigger value="detailed" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Settings2 size={14} className="mr-2" /> Detailed Furniture
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-xl px-6 py-3 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Wind size={14} className="mr-2" /> General Services
          </TabsTrigger>
        </TabsList>

        {/* ── BHK Options Content ── */}
        <TabsContent value="bhk" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold text-charcoal">BHK Configuration Prices</h2>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gold hover:bg-charcoal text-white rounded-xl text-xs font-medium px-6">
              <Plus size={14} className="mr-2" /> Add BHK Type
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bhkOptions.map((opt) => (
              <Card key={opt.id} className="border-charcoal/5 shadow-lg rounded-3xl overflow-hidden bg-white group">
                <div className="relative h-40 overflow-hidden">
                  <Image src={opt.image} alt={opt.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-charcoal">{opt.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-serif font-semibold text-gold">₹{(opt.price / 100000).toFixed(1)}L</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenDialog(opt)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-gold transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(opt.id)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Room Options Content ── */}
        <TabsContent value="rooms" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold text-charcoal">Room Base Estimates</h2>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gold hover:bg-charcoal text-white rounded-xl text-xs font-medium px-6">
              <Plus size={14} className="mr-2" /> Add Room Type
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomOptions.map((room) => (
              <Card key={room.id} className="border-charcoal/5 shadow-lg rounded-3xl overflow-hidden bg-white flex items-center group">
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                  <Image src={room.image} alt={room.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-medium text-charcoal">{room.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-serif font-semibold text-gold">₹{(room.basePrice / 1000).toFixed(0)}K</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenDialog(room)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-gold transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(room.id)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Furniture Items Content ── */}
        <TabsContent value="furniture" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold text-charcoal">Furniture Catalog & Pricing</h2>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gold hover:bg-charcoal text-white rounded-xl text-xs font-medium px-6">
              <Plus size={14} className="mr-2" /> Add Furniture
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {furnitureItems.map((item) => (
              <Card key={item.id} className="border-charcoal/5 shadow-lg rounded-3xl overflow-hidden bg-white group">
                <div className="flex">
                  <div className="relative w-48 h-full min-h-[180px] overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <CardContent className="p-6 flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">{item.name}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenDialog(item)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-gold transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-charcoal/30">Variants & Pricing</p>
                      {item.options ? (
                        <div className="space-y-2">
                          {item.options.map(opt => (
                            <div key={opt.id} className="flex items-center justify-between bg-warm-cream/30 p-2 rounded-xl border border-charcoal/5">
                              <span className="text-xs font-medium text-charcoal">{opt.name}</span>
                              <span className="text-xs font-semibold text-gold">₹{opt.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-warm-cream/30 p-3 rounded-xl border border-charcoal/5">
                          <span className="text-xs font-medium text-charcoal">Base Price</span>
                          <span className="text-xs font-semibold text-gold">₹{item.price?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Requirements Content ── */}
        <TabsContent value="requirements" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold text-charcoal">Essential Service Rates</h2>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gold hover:bg-charcoal text-white rounded-xl text-xs font-medium px-6">
              <Plus size="14" className="mr-2" /> Add Essential
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {basicReqs.map((req) => (
              <Card key={req.id} className="border-charcoal/5 shadow-lg rounded-3xl bg-white group hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-warm-cream/50 rounded-2xl group-hover:bg-gold/10 transition-colors">
                      <Zap size={20} className="text-gold" />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenDialog(req)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-gold transition-colors"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(req.id)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold text-charcoal">{req.name}</h3>
                    <p className="text-[10px] font-medium text-charcoal/30 mt-1">Unit: {req.unit}</p>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-2xl font-serif font-semibold text-charcoal">₹{req.price.toLocaleString()}</span>
                    <span className="text-[10px] font-medium text-charcoal/30 ml-2">/ {req.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Brands Content ── */}
        <TabsContent value="brands" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold text-charcoal">Brand Tier Multipliers</h2>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gold hover:bg-charcoal text-white rounded-xl text-xs font-medium px-6">
              <Plus size={14} className="mr-2" /> Add Brand Tier
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brandOptions.map((brand) => (
              <Card key={brand.id} className="border-charcoal/5 shadow-lg rounded-3xl overflow-hidden bg-white group relative">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button onClick={() => handleOpenDialog(brand)} className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-charcoal/30 hover:text-gold transition-colors shadow-sm"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(brand.id)} className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-charcoal/30 hover:text-red-500 transition-colors shadow-sm"><Trash2 size={14} /></button>
                </div>
                <div className="h-32 bg-charcoal flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 flex items-center justify-center scale-150 rotate-12">
                    <Layers size={100} className="text-white" />
                  </div>
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-serif font-semibold tracking-tight text-white">{brand.name}</h3>
                    <p className="text-xs text-gold font-medium mt-1">Multiplier: {brand.multiplier}x</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Detailed Furniture Content ── */}
        <TabsContent value="detailed" className="space-y-12">
          {Object.entries(detailedFurniture).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-gold rounded-full" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">{category}</h3>
                </div>
                <Button onClick={() => handleOpenDialog({ category })} size="sm" className="bg-charcoal hover:bg-gold text-white rounded-xl text-xs font-medium px-6">
                  <Plus size={14} className="mr-2" /> Add {category} Item
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item: any) => (
                  <Card key={item.id} className="border-charcoal/5 shadow-lg rounded-3xl bg-white overflow-hidden group hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xs font-semibold text-charcoal leading-tight">{item.name}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenDialog({ ...item, category })} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-gold transition-colors"><Edit2 size={12} /></button>
                          <button onClick={() => handleDelete(item.id, category)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-serif font-semibold text-charcoal">₹{item.price.toLocaleString()}</span>
                        <span className="text-[10px] font-medium text-charcoal/30 ml-1">/ {item.unit}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ── General Services Content ── */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold text-charcoal">General Service Rates</h2>
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gold hover:bg-charcoal text-white rounded-xl text-xs font-medium px-6">
              <Plus size={14} className="mr-2" /> Add Service
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalServices.map((service) => (
              <Card key={service.id} className="border-charcoal/5 shadow-lg rounded-3xl bg-white p-6 group hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                    <Paintbrush size={20} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenDialog(service)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-gold transition-colors"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-warm-cream rounded-lg text-charcoal/30 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
                <h3 className="text-xs font-semibold text-charcoal mb-2">{service.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-serif font-semibold text-charcoal">₹{service.price.toLocaleString()}</span>
                  <span className="text-[10px] font-medium text-charcoal/30 ml-2">/ {service.unit}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
