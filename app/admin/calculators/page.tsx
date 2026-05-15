"use client";

import { useState, useEffect } from "react";
import { Search, Edit3, Trash2, Plus, Save, ArrowLeft, Image as ImageIcon, Zap, Layers, Paintbrush, Wind, Armchair, LayoutGrid, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";
import { calculatorService, type CalculatorItem, type BrandOption } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";

const SCOPE_OPTIONS = [
  { id: "full_home", label: "Full Home" },
  { id: "specific_area", label: "Specific Area" },
];

const SERVICE_TYPE_OPTIONS = [
  { id: "services", label: "Services" },
  { id: "interior", label: "Interior" },
  { id: "homes", label: "Homes" },
];

export default function CalculatorManagementPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Item State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalculatorItem | null>(null);
  const [formData, setFormData] = useState<Partial<CalculatorItem>>({
    name: "", serviceType: "homes", projectScope: "full_home", price: 0, unit: "unit", category: ""
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Brand State
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandOption | null>(null);
  const [brandFormData, setBrandFormData] = useState<Partial<BrandOption>>({
    name: "", multiplier: 1, description: ""
  });
  const [brandDeleteId, setBrandDeleteId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [itemsData, brandsData] = await Promise.all([
        calculatorService.getAllItems(),
        calculatorService.getBrands()
      ]);
      setItems(itemsData);
      setBrands(brandsData);
    } catch (error) {
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Item",
      accessorKey: "name",
      cell: (item: CalculatorItem) => (
        <div className="flex items-center gap-4">
          {item.image ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-charcoal/10">
              <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
              <ImageIcon size={20} />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">{item.serviceType}</p>
          </div>
        </div>
      )
    },
    {
      header: "Service",
      accessorKey: "serviceType",
      cell: (item: CalculatorItem) => (
        <span className="text-xs font-bold text-charcoal/40 uppercase">{item.serviceType}</span>
      )
    },
    {
      header: "Scope",
      accessorKey: "projectScope",
      cell: (item: CalculatorItem) => (
        <span className="text-xs font-bold text-charcoal/60 uppercase">{item.projectScope.replace('_', ' ')}</span>
      )
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item: CalculatorItem) => (
        <span className="font-black text-charcoal">₹{item.price.toLocaleString()} / {item.unit}</span>
      )
    },
    {
      header: "Actions",
      accessorKey: "_id",
      cell: (item: CalculatorItem) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenDialog(item)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
            <Edit3 size={14} />
          </button>
          <button onClick={() => setDeleteId(item._id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const brandColumns = [
    {
      header: "Brand",
      accessorKey: "name",
      cell: (brand: BrandOption) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-charcoal/10">
            <img src={brand.image ? buildImageUrl(brand.image) : ""} alt={brand.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-medium">{brand.name}</span>
        </div>
      )
    },
    {
      header: "Multiplier",
      accessorKey: "multiplier",
      cell: (brand: BrandOption) => <span className="font-bold">{brand.multiplier}x</span>
    },
    {
      header: "Actions",
      accessorKey: "_id",
      cell: (brand: BrandOption) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenBrandDialog(brand)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
            <Edit3 size={14} />
          </button>
          <button onClick={() => setBrandDeleteId(brand._id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (item: CalculatorItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name, itemType: item.itemType, serviceType: item.serviceType, projectScope: item.projectScope,
        price: item.price, unit: item.unit
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "", itemType: "service", serviceType: "homes", projectScope: "full_home", price: 0, unit: "unit"
      });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleOpenBrandDialog = (brand: BrandOption | null = null) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandFormData({ name: brand.name, multiplier: brand.multiplier, description: brand.description || "" });
    } else {
      setEditingBrand(null);
      setBrandFormData({ name: "", multiplier: 1, description: "" });
    }
    setSelectedFile(null);
    setIsBrandDialogOpen(true);
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, value.toString());
      });
      if (selectedFile) fd.append("image", selectedFile);

      if (editingItem) await calculatorService.updateItem(editingItem._id, fd);
      else await calculatorService.addItem(fd);

      showSuccess("Item saved!");
      loadAll();
      setIsDialogOpen(false);
    } catch (err) {
      showError("Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBrand = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(brandFormData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, value.toString());
      });
      if (selectedFile) fd.append("image", selectedFile);

      if (editingBrand) await calculatorService.updateBrand(editingBrand._id, fd);
      else await calculatorService.addBrand(fd);

      showSuccess("Brand saved!");
      loadAll();
      setIsBrandDialogOpen(false);
    } catch (err) {
      showError("Failed to save brand");
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="h-9 w-9 rounded-xl bg-white border border-charcoal/10">
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">Calculator Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage items and brands for the interior calculator</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="bg-white border border-charcoal/10 rounded-xl p-1">
          <TabsTrigger value="items" className="rounded-lg px-8">Items</TabsTrigger>
          <TabsTrigger value="brands" className="rounded-lg px-8">Brands</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          <AdminSearchHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search items..."
            actionLabel="Add Item"
            onAction={() => handleOpenDialog()}
            ActionIcon={Plus}
          />
          <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
            <AdminTable columns={columns} data={filteredItems} />
          </div>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          <AdminSearchHeader 
            searchQuery={searchQuery} // Actually brand doesn't use search, but we'll use a dummy or just use AdminSearchHeader without search by hiding it or adding a prop. But wait, AdminSearchHeader requires search props.
            setSearchQuery={() => {}}
            searchPlaceholder="Search brands..."
            actionLabel="Add Brand"
            onAction={() => handleOpenBrandDialog()}
            ActionIcon={Plus}
          />
          <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
            <AdminTable columns={brandColumns} data={brands} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 border-b bg-warm-cream/20">
            <DialogTitle className="font-serif font-black">{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* 1. Item Name */}
            <AdminFormInputEnhanced label="1. Item Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />

            <div className="grid grid-cols-2 gap-6">
              {/* 2. Service Type */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">2. Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(v: any) => {
                    const updates: any = { serviceType: v };
                    if (v === "homes") updates.projectScope = "specific_area";
                    setFormData({ ...formData, ...updates });
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{SERVICE_TYPE_OPTIONS.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* 3. Project Scope */}
              {formData.serviceType !== "homes" && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">3. Project Scope</Label>
                  <Select value={formData.projectScope} onValueChange={(v: any) => setFormData({ ...formData, projectScope: v })}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{SCOPE_OPTIONS.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
            </div>


            <div className="grid grid-cols-2 gap-6">
              <AdminFormInputEnhanced label="Base Price" type="number" value={formData.price?.toString()} onChange={(v) => setFormData({ ...formData, price: Number(v) })} />
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Pricing Unit</Label>
                <Select value={formData.unit} onValueChange={(v: any) => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="unit">Per Unit</SelectItem><SelectItem value="sqft">Per Sqft</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload label="Item Thumbnail" value={editingItem?.image} onChange={(_, f) => f && setSelectedFile(f)} />
          </div>
          <DialogFooter className="p-8 bg-white border-t gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handleSaveItem} disabled={saving} className="flex-1 bg-charcoal text-white rounded-xl">Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brand Dialog */}
      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 border-b bg-warm-cream/20">
            <DialogTitle className="font-serif font-black">{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <AdminFormInputEnhanced label="Brand Name" value={brandFormData.name} onChange={(v) => setBrandFormData({ ...brandFormData, name: v })} />
            <AdminFormInputEnhanced label="Multiplier" type="number" value={brandFormData.multiplier?.toString()} onChange={(v) => setBrandFormData({ ...brandFormData, multiplier: Number(v) })} />
            <AdminFormInputEnhanced label="Description" value={brandFormData.description} onChange={(v) => setBrandFormData({ ...brandFormData, description: v })} />
            <ImageUpload label="Brand Logo" value={editingBrand?.image} onChange={(_, f) => f && setSelectedFile(f)} />
          </div>
          <DialogFooter className="p-8 bg-white border-t gap-4">
            <Button variant="ghost" onClick={() => setIsBrandDialogOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handleSaveBrand} disabled={saving} className="flex-1 bg-charcoal text-white rounded-xl">Save Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader><AlertDialogTitle>Delete Item?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && calculatorService.deleteItem(deleteId).then(() => { showSuccess("Deleted"); loadAll(); setDeleteId(null); })} className="bg-red-500 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Brand Alert */}
      <AlertDialog open={!!brandDeleteId} onOpenChange={(o) => !o && setBrandDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader><AlertDialogTitle>Delete Brand?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => brandDeleteId && calculatorService.deleteBrand(brandDeleteId).then(() => { showSuccess("Deleted"); loadAll(); setBrandDeleteId(null); })} className="bg-red-500 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
