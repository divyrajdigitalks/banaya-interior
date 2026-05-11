"use client";

import { useState, useEffect } from "react";
import { Search, IndianRupee, Edit3, Trash2, Plus, Save, Layout, Sofa, Bed, Baby, Home, Building2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
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
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { motion } from "framer-motion";
import { costGuideService, type CostGuideItem } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

const ICON_OPTIONS = [
  { id: "Layout", icon: Layout, label: "Kitchen" },
  { id: "Sofa", icon: Sofa, label: "Living Room" },
  { id: "Bed", icon: Bed, label: "Bedroom" },
  { id: "Baby", icon: Baby, label: "Kids Room" },
  { id: "Home", icon: Home, label: "Small Home" },
  { id: "Building2", icon: Building2, label: "Large Home" },
];

export default function InteriorCostGuidePage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [costGuideItems, setCostGuideItems] = useState<CostGuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CostGuideItem | null>(null);
  const [formData, setFormData] = useState<Partial<CostGuideItem>>({ title: "", range: "", iconId: "Layout", description: "", isActive: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadCostGuideItems();
  }, []);

  const loadCostGuideItems = async () => {
    setLoading(true);
    try {
      const data = await costGuideService.getCostGuideList(true);
      setCostGuideItems(data);
    } catch (error) {
      showError("Failed to load cost guide items");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Category",
      accessorKey: "title",
      cell: (item: CostGuideItem) => {
        const IconComponent = ICON_OPTIONS.find(i => i.id === item.iconId)?.icon || Layout;
        return (
          <div className="flex items-center gap-4">
            {item.image ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-charcoal/10 bg-charcoal/5">
                <img src={buildImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                <IconComponent size={20} />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-charcoal">{item.title}</p>
              {item.description && (
                <p className="text-[11px] text-charcoal/40 line-clamp-1">{item.description}</p>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: "Price Range",
      accessorKey: "range",
      cell: (item: CostGuideItem) => (
        <span className="font-black text-charcoal">{item.range}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (item: CostGuideItem) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: CostGuideItem) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const validateForm = () => {
    const formState = {
      title: { value: formData.title, rules: ValidationRules.name },
      range: { value: formData.range, rules: ValidationRules.required }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (item: CostGuideItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        range: item.range,
        iconId: item.iconId,
        description: item.description || "",
        isActive: item.isActive
      });
      setSelectedFile(null);
    } else {
      setEditingItem(null);
      setFormData({ title: "", range: "", iconId: "Layout", description: "", isActive: true });
      setSelectedFile(null);
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError("Please fix the validation errors");
      return;
    }
    
    setSaving(true);
    try {
      if (editingItem) {
        await costGuideService.updateCostGuideItem(editingItem.id, formData, selectedFile || undefined);
        showSuccess("Cost guide item updated successfully!");
      } else {
        await costGuideService.createCostGuideItem(formData as any, selectedFile || undefined);
        showSuccess("Cost guide item created successfully!");
      }
      
      await loadCostGuideItems();
      setIsDialogOpen(false);
    } catch (error) {
      showError(editingItem ? "Failed to update cost guide item" : "Failed to create cost guide item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await costGuideService.deleteCostGuideItem(id);
      showSuccess("Cost guide item deleted successfully!");
      await loadCostGuideItems();
    } catch (error) {
      showError("Failed to delete cost guide item");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredItems = costGuideItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-white border border-charcoal/10"
          >
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">Cost Guide Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage interior cost guide items</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input 
              placeholder="Search cost guide..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
            />
          </div>

          <Button 
            onClick={() => handleOpenDialog()}
            className="h-10 bg-charcoal hover:bg-charcoal/90 text-white text-sm rounded-xl px-4"
          >
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredItems} />
      </AdminCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] w-[95vw] rounded-[2rem] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 border-b border-charcoal/5 bg-warm-cream/20">
            <DialogTitle className="text-xl font-serif font-black text-charcoal">
              {editingItem ? "Edit Cost Guide Item" : "Add Cost Guide Item"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="space-y-8">
              <AdminFormInputEnhanced 
                label="Title"
                value={formData.title || ""}
                onChange={(val) => setFormData({ ...formData, title: val })}
                placeholder="e.g. Modular Kitchen"
                required
                error={formErrors.title}
              />
              <AdminFormInputEnhanced 
                label="Price Range"
                value={formData.range || ""}
                onChange={(val) => setFormData({ ...formData, range: val })}
                placeholder="e.g. ₹2.5L - ₹5L"
                required
                error={formErrors.range}
              />
              <AdminFormInputEnhanced 
                label="Description (Optional)"
                value={formData.description || ""}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Brief description of the service"
              />
              
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">Icon Selection</Label>
                <div className="grid grid-cols-3 gap-4">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComponent = opt.icon;
                    const isActive = formData.iconId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, iconId: opt.id })}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                          isActive 
                            ? 'bg-gold/10 border-gold text-gold shadow-lg shadow-gold/5' 
                            : 'bg-white border-charcoal/5 text-charcoal/40 hover:border-gold/30 hover:text-gold'
                        }`}
                      >
                        <IconComponent size={22} className={isActive ? 'scale-110' : ''} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <ImageUpload 
                  label="Custom Icon Image (Optional)"
                  value={editingItem?.image}
                  onChange={(val, file) => {
                    if (file) setSelectedFile(file);
                  }}
                  className="bg-white rounded-2xl"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-charcoal/5 rounded-2xl">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-charcoal/10 text-gold focus:ring-gold accent-gold"
                />
                <Label htmlFor="isActive" className="text-xs font-bold text-charcoal cursor-pointer">
                  Active (visible on website)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-white border-t border-charcoal/5 gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl border border-charcoal/10 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-12 bg-charcoal hover:bg-gold hover:text-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all duration-500">
              <Save size={16} className="mr-2" />
              {saving ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cost Guide Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cost guide item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 h-9 rounded-xl border border-charcoal/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
