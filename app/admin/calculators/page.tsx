"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit3, Trash2, Layout, Image as ImageIcon, Type, IndianRupee, Layers, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { AdminSelectEnhanced } from "@/components/admin/admin-select-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { calculatorService, type CalculatorItem } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CalculatorManagementPage() {
  const { showSuccess, showError } = useAdminToast();
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingService] = useState<CalculatorItem | null>(null);
  const [formData, setFormData] = useState<any>({
    calculatorType: 'interior',
    type: 'furniture',
    name: '',
    price: 0,
    unit: 'unit',
    category: '',
    options: []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCalculatorType, setFilterCalculatorType] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [brands, setBrands] = useState<any[]>([]);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [brandFormData, setBrandFormData] = useState({ 
    name: '', 
    multiplier: 1.0, 
    image: '',
    calculatorType: 'all' 
  });
  const [brandFile, setBrandFile] = useState<File | null>(null);

  useEffect(() => {
    loadItems();
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const data = await calculatorService.getBrands();
    setBrands(data);
  };

  const handleSaveBrand = async () => {
    if (editingBrand) {
      await calculatorService.updateBrand(editingBrand.id, brandFormData, brandFile || undefined);
    } else {
      await calculatorService.addBrand(brandFormData, brandFile || undefined);
    }
    setIsBrandDialogOpen(false);
    loadBrands();
  };

  const handleDeleteBrand = async (id: string) => {
    await calculatorService.deleteBrand(id);
    loadBrands();
  };

  const loadItems = async () => {
    setLoading(true);
    const data = await calculatorService.getAllItems();
    setItems(data);
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await calculatorService.updateItem(editingItem.id, formData, selectedFile || undefined);
        showSuccess("Item updated successfully");
      } else {
        await calculatorService.addItem(formData, selectedFile || undefined);
        showSuccess("Item added successfully");
      }
      setIsDialogOpen(false);
      loadItems();
    } catch (error) {
      showError("Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    const success = await calculatorService.deleteItem(id);
    if (success) {
      showSuccess("Item deleted");
      loadItems();
    } else {
      showError("Failed to delete");
    }
    setDeleteId(null);
  };

  const columns = [
    {
      header: "Item Info",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          {item.image ? (
            <img src={buildImageUrl(item.image)} className="w-10 h-10 rounded-lg object-cover" alt="" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <ImageIcon size={16} className="text-slate-400" />
            </div>
          )}
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{item.type}</p>
          </div>
        </div>
      )
    },
    {
      header: "Calculator",
      accessorKey: "calculatorType",
      cell: (item: any) => (
        <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600">
          {item.calculatorType}
        </span>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item: any) => <span className="text-xs font-bold text-slate-600">{item.category || "—"}</span>
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-black text-charcoal">₹{item.price.toLocaleString()}</span>
          <span className="text-[10px] uppercase text-slate-400 font-bold">per {item.unit}</span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setEditingService(item); setFormData(item); setIsDialogOpen(true); }}>
            <Edit3 size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(item.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-black text-charcoal">Calculator Management</h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Manage all dynamic calculator options and brands</p>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-8">
        <TabsList className="bg-slate-50 p-1 rounded-2xl border border-slate-100">
          <TabsTrigger value="items" className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Calculator Items</TabsTrigger>
          <TabsTrigger value="brands" className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Brand Options</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <AdminFormInputEnhanced placeholder="Search items..." value={searchQuery} onChange={(val) => setSearchQuery(val as string)} className="pl-11" />
              </div>
              <AdminSelectEnhanced 
                value={filterCalculatorType} 
                onChange={(val) => setFilterCalculatorType(val)} 
                options={[
                  { value: 'all', label: 'All Calculators' },
                  { value: 'services', label: 'Services' },
                  { value: 'interior', label: 'Interior' },
                  { value: 'homes', label: 'Homes' }
                ]} 
              />
            </div>
            <Button onClick={() => { setEditingService(null); setFormData({ calculatorType: 'interior', type: 'furniture', name: '', price: 0, unit: 'unit', category: '', options: [] }); setIsDialogOpen(true); }} className="bg-charcoal text-white hover:bg-gold px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all">
              <Plus size={16} className="mr-2" /> Add Item
            </Button>
          </div>
          <AdminTable 
            columns={columns} 
            data={items.filter(i => 
              i.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
              (filterCalculatorType === 'all' || i.calculatorType === filterCalculatorType)
            )} 
          />
        </TabsContent>

        <TabsContent value="brands" className="space-y-8">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingBrand(null); setBrandFormData({ name: '', multiplier: 1.0, image: '' }); setIsBrandDialogOpen(true); }} className="bg-charcoal text-white hover:bg-gold px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all">
              <Plus size={16} className="mr-2" /> Add Brand
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brands.map(brand => (
              <div key={brand.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-50">
                  <img src={brand.image ? buildImageUrl(brand.image) : "https://via.placeholder.com/300x200"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-charcoal">{brand.name}</h3>
                    <p className="text-[10px] font-black uppercase text-gold tracking-widest">{brand.multiplier}x Multiplier</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingBrand(brand); setBrandFormData(brand); setIsBrandDialogOpen(true); }}>
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteBrand(brand.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-charcoal/5 bg-warm-cream/20">
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingItem ? "Edit Calculator Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <AdminSelectEnhanced 
                label="Calculator Type" 
                value={formData.calculatorType} 
                onChange={(val) => setFormData({ ...formData, calculatorType: val })} 
                options={[
                  { value: 'services', label: 'Services Calculator' },
                  { value: 'interior', label: 'Interior Calculator' },
                  { value: 'homes', label: 'Homes Calculator' }
                ]} 
              />
              <AdminSelectEnhanced 
                label="Item Step / Category" 
                value={formData.type} 
                onChange={(val) => setFormData({ ...formData, type: val })} 
                options={[
                  { value: 'bhk', label: 'Step 1: BHK / Area Option' },
                  { value: 'furniture', label: 'Step 2: Furniture Selection' },
                  { value: 'detailed', label: 'Step 3: Detailed Components' },
                  { value: 'basic', label: 'Step 4: Basic Requirements' },
                  { value: 'general_service', label: 'General Services' }
                ]} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <AdminFormInputEnhanced 
                label="Item Name" 
                value={formData.name} 
                onChange={(val) => setFormData({ ...formData, name: val })} 
                placeholder="e.g. King Bed, Wall Paint" 
              />
              <AdminFormInputEnhanced 
                label="Base Price" 
                type="number" 
                value={formData.price} 
                onChange={(val) => setFormData({ ...formData, price: Number(val) })} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AdminSelectEnhanced 
                label="Unit" 
                value={formData.unit} 
                onChange={(val) => setFormData({ ...formData, unit: val })} 
                options={[
                  { value: 'unit', label: 'Per Unit' },
                  { value: 'sqft', label: 'Per SQ FT' }
                ]} 
              />
              <AdminFormInputEnhanced 
                label="Category / Room (Optional)" 
                value={formData.category} 
                onChange={(val) => setFormData({ ...formData, category: val })} 
                placeholder="e.g. Living Area, Kitchen" 
              />
            </div>

            <ImageUpload 
              label="Item Image"
              value={selectedFile ? URL.createObjectURL(selectedFile) : (formData.image ? buildImageUrl(formData.image) : "")} 
              onChange={(val, file) => setSelectedFile(file || null)} 
            />
          </div>
          <DialogFooter className="p-6 border-t border-charcoal/5 bg-warm-cream/5 flex gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-10 rounded-xl border border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 h-10 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl">
              <Save size={16} className="mr-2" />
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the calculator item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 h-10 rounded-xl border border-charcoal/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-charcoal/5 bg-warm-cream/20">
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <AdminSelectEnhanced 
              label="Calculator Type" 
              value={brandFormData.calculatorType} 
              onChange={(val) => setBrandFormData({ ...brandFormData, calculatorType: val })} 
              options={[
                { value: 'all', label: 'All Calculators' },
                { value: 'services', label: 'Services Calculator' },
                { value: 'interior', label: 'Interior Calculator' },
                { value: 'homes', label: 'Homes Calculator' }
              ]} 
            />
            <AdminFormInputEnhanced 
              label="Brand Name" 
              value={brandFormData.name} 
              onChange={(val) => setBrandFormData({ ...brandFormData, name: val as string })} 
              placeholder="e.g. Premium Brand" 
            />
            <AdminFormInputEnhanced 
              label="Price Multiplier" 
              type="number" 
              value={brandFormData.multiplier} 
              onChange={(val) => setBrandFormData({ ...brandFormData, multiplier: Number(val) })} 
            />
            <ImageUpload 
              label="Brand Logo / Image"
              value={brandFile ? URL.createObjectURL(brandFile) : (brandFormData.image ? buildImageUrl(brandFormData.image) : "")} 
              onChange={(val, file) => setBrandFile(file || null)} 
            />
          </div>
          <DialogFooter className="p-6 border-t border-charcoal/5 bg-warm-cream/5 flex gap-3">
            <Button variant="ghost" onClick={() => setIsBrandDialogOpen(false)} className="flex-1 h-10 rounded-xl border border-charcoal/10">Cancel</Button>
            <Button onClick={handleSaveBrand} className="flex-1 h-10 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl">
              <Save size={16} className="mr-2" />
              Save Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
