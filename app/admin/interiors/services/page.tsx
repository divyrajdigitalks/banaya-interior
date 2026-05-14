"use client";

import { useState, useEffect } from "react";
import { Search, Edit3, Trash2, Plus, ArrowLeft, Image as ImageIcon, Layers, LayoutGrid } from "lucide-react";
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
import { calculatorService, type CalculatorItem } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";

export default function ServicesManagementPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [serviceItems, setServiceItems] = useState<CalculatorItem[]>([]);
  const [interiorServices, setInteriorServices] = useState<CalculatorItem[]>([]);
  const [homeServices, setHomeServices] = useState<CalculatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("services");

  // Item State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalculatorItem | null>(null);
  const [formData, setFormData] = useState<Partial<CalculatorItem>>({
    name: "", serviceType: "services", projectScope: "specific_area", price: 0, unit: "unit", category: ""
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const [allCalculatorItems, allServiceItems, allInteriorServices, allHomeServices] = await Promise.all([
        calculatorService.getAllItems(),
        calculatorService.getAllServiceItems(),
        calculatorService.getAllInteriorServices(),
        calculatorService.getAllHomeServices()
      ]);
      setItems(allCalculatorItems);
      setServiceItems(allServiceItems);
      setInteriorServices(allInteriorServices);
      setHomeServices(allHomeServices);
    } catch (error) {
      showError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // Get unique areas for Services categories
  const serviceAreaOptions = items
    .filter(i => i.projectScope === "specific_area" && i.serviceType === "services" && !i.category)
    .map(i => i.name);

  // Get unique areas for Interior categories
  const interiorAreaOptions = items
    .filter(i => i.projectScope === "specific_area" && i.serviceType === "interior" && !i.category)
    .map(i => i.name);

  // Get home service types for Homes categories
  const homeAreaOptions = items
    .filter(i => i.serviceType === "homes" && !i.category)
    .map(i => i.name);

  const areaOptions = activeTab === "services" ? serviceAreaOptions : (activeTab === "interior" ? interiorAreaOptions : homeAreaOptions);

  const handleOpenDialog = (item: CalculatorItem | null = null, prefilledCategory: string = "") => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        serviceType: item.serviceType,
        projectScope: item.projectScope,
        price: item.price,
        unit: item.unit,
        category: item.category || ""
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        price: 0,
        unit: "unit",
        category: prefilledCategory || ""
      });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, value.toString());
      });
      if (selectedFile) fd.append("image", selectedFile);

      if (activeTab === "services") {
        if (editingItem) await calculatorService.updateServiceItem(editingItem._id, fd);
        else await calculatorService.addServiceItem(fd);
      } else if (activeTab === "interior") {
        if (editingItem) await calculatorService.updateInteriorService(editingItem._id, fd);
        else await calculatorService.addInteriorService(fd);
      } else {
        if (editingItem) await calculatorService.updateHomeService(editingItem._id, fd);
        else await calculatorService.addHomeService(fd);
      }

      showSuccess("Service saved!");
      loadItems();
      setIsDialogOpen(false);
    } catch (err) {
      showError("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteId) return;
    try {
      if (activeTab === "services") {
        await calculatorService.deleteServiceItem(deleteId);
      } else if (activeTab === "interior") {
        await calculatorService.deleteInteriorService(deleteId);
      } else {
        await calculatorService.deleteHomeService(deleteId);
      }
      showSuccess("Deleted successfully");
      loadItems();
    } catch (error) {
      showError("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Service",
      accessorKey: "name",
      cell: (item: CalculatorItem) => (
        <div className="flex items-center gap-4">
          {item.image ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-charcoal/10">
              <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
              <Layers size={16} />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">{item.category || "No Category"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item: CalculatorItem) => (
        <span className="font-bold text-charcoal">₹{item.price.toLocaleString()} / {item.unit}</span>
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

  // Group items by category for the current tab
  const activeItems = activeTab === "services" ? serviceItems : (activeTab === "interior" ? interiorServices : homeServices);
  
  const groupedItems = activeItems
    .filter(item => 
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reduce((acc, item) => {
      const cat = item.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, CalculatorItem[]>);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="h-9 w-9 rounded-xl bg-white border border-charcoal/10">
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">Services Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage detailed services for the calculator</p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="h-10 bg-charcoal hover:bg-charcoal/90 text-white text-sm rounded-xl px-4">
          <Plus size={16} className="mr-2" /> Add {activeTab === "services" ? "Service" : (activeTab === "interior" ? "Interior Item" : "Home Item")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-charcoal/10 rounded-xl p-1">
          <TabsTrigger value="services" className="rounded-lg px-8">Services</TabsTrigger>
          <TabsTrigger value="interior" className="rounded-lg px-8">Interior Services</TabsTrigger>
          <TabsTrigger value="homes" className="rounded-lg px-8">Home Services</TabsTrigger>
        </TabsList>

        <AdminCard>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input
              placeholder="Search items or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
            />
          </div>
        </AdminCard>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-charcoal" />
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedItems).length === 0 ? (
              <AdminCard>
                <div className="py-12 text-center">
                  <LayoutGrid className="mx-auto text-charcoal/10 mb-4" size={48} />
                  <p className="text-charcoal/40 font-medium">No items found.</p>
                  <p className="text-xs text-charcoal/20 mt-1">Add a new item to get started.</p>
                </div>
              </AdminCard>
            ) : (
              Object.entries(groupedItems).map(([category, catItems]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/60 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                      {category}
                      <span className="ml-2 text-[10px] font-normal text-charcoal/30">({catItems.length} items)</span>
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenDialog(null, category)}
                      className="h-8 text-[10px] uppercase tracking-wider font-bold text-charcoal/40 hover:text-charcoal"
                    >
                      <Plus size={14} className="mr-1" /> Add to {category}
                    </Button>
                  </div>
                  <AdminCard>
                    <AdminTable columns={columns} data={catItems} />
                  </AdminCard>
                </div>
              ))
            )}
          </div>
        )}
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 border-b bg-warm-cream/20">
            <DialogTitle className="font-serif font-black">{editingItem ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <AdminFormInputEnhanced 
              label={`1. ${activeTab === "services" ? "Service" : (activeTab === "interior" ? "Interior Item" : "Home Item")} Name`} 
              value={formData.name} 
              onChange={(v) => setFormData({ ...formData, name: v })} 
              placeholder={activeTab === "services" ? "e.g. Wall Painting, Ceiling Work" : (activeTab === "interior" ? "e.g. Wooden Flooring, False Ceiling" : "e.g. Sofa Set, Dining Table")}
              required 
            />
            {activeTab !== "services" && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">2. Assign to {activeTab === "homes" ? "Home Item" : "Area"} (Category)</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder={`Select a ${activeTab === "homes" ? "Category" : "Area"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {areaOptions.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-charcoal/40 mt-1 italic">
                  * Categories are derived from {activeTab === "homes" ? 'Home service items added in calculators' : '"Specific Area" items in Scope'}.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <AdminFormInputEnhanced 
                label="Base Price" 
                type="number" 
                value={formData.price?.toString()} 
                onChange={(v) => setFormData({ ...formData, price: Number(v) })} 
              />
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Pricing Unit</Label>
                <Select value={formData.unit} onValueChange={(v: any) => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">Per Unit</SelectItem>
                    <SelectItem value="sqft">Per Sqft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload label="Service Thumbnail" value={editingItem?.image} onChange={(_, f) => f && setSelectedFile(f)} />
          </div>
          <DialogFooter className="p-8 bg-white border-t gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handleSaveItem} disabled={saving} className="flex-1 bg-charcoal text-white rounded-xl">
              {saving ? "Saving..." : "Save Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service from the calculator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-500 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
