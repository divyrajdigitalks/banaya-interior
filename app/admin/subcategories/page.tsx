"use client";

import { useState, useEffect } from "react";
import { Search, Grid, Edit3, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { AdminSelectEnhanced } from "@/components/admin/admin-select-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { categoryService, type Category, type Subcategory } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function AdminSubcategoriesPage() {
  const { showSuccess, showError } = useAdminToast();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState<Partial<Subcategory>>({ name: "", image: "", categoryId: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name },
      categoryId: { value: formData.categoryId, rules: ValidationRules.required }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const loadSubcategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getSubcategoryList(true);
      setSubcategories(data);
    } catch (error) {
      showError("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategoryList();
      setCategories(data);
    } catch (error) {
      showError("Failed to load categories");
    }
  };

  useEffect(() => { 
    loadSubcategories(); 
    loadCategories();
  }, []);

  const columns = [
    {
      header: "Subcategory Info",
      accessorKey: "name",
      cell: (item: Subcategory) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-charcoal/5">
            {item.image ? (
              <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-charcoal/5 flex items-center justify-center">
                <Grid size={16} className="text-charcoal/30" />
              </div>
            )}
          </div>
          <div>
            <span className="font-bold text-charcoal">{item.name}</span>
          </div>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "categoryId",
      cell: (item: Subcategory) => {
        const category = categories.find(c => c.id === item.categoryId);
        return (
          <span className="text-sm font-medium text-charcoal/60">
            {category?.name || "No Category"}
          </span>
        );
      }
    },
    {
      header: "Created Date",
      accessorKey: "createdAt",
      cell: (item: Subcategory) => (
        <span className="text-[12px] text-charcoal/60">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }) : "—"}
        </span>
      )
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item: Subcategory) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100/50"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100/50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (subcategory: Subcategory | null = null) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setFormData({ 
        name: subcategory.name, 
        image: subcategory.image || "",
        categoryId: subcategory.categoryId
      });
      setSelectedFile(null);
    } else {
      setEditingSubcategory(null);
      setFormData({ name: "", image: "", categoryId: "" });
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
      if (editingSubcategory) {
        await categoryService.updateSubcategory(editingSubcategory.id, formData, selectedFile || undefined);
        showSuccess("Subcategory updated successfully!");
      } else {
        await categoryService.createSubcategory(formData as Subcategory, selectedFile || undefined);
        showSuccess("Subcategory created successfully!");
      }
      
      await loadSubcategories();
      setIsDialogOpen(false);
    } catch (error) {
      showError(editingSubcategory ? "Failed to update subcategory" : "Failed to create subcategory");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteSubcategory(id);
      showSuccess("Subcategory deleted successfully!");
      await loadSubcategories();
    } catch (error) {
      showError("Failed to delete subcategory");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredSubcategories = subcategories.filter(c => {
    const category = categories.find(cat => cat.id === c.categoryId);
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (category?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  });

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
          <Input 
            placeholder="Search subcategories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all shadow-xl shadow-charcoal/5"
          />
        </div>

        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl shadow-gold/10 flex items-center gap-3 group transition-all duration-500"
        >
          <Grid className="group-hover:rotate-90 transition-transform duration-500" size={16} />
          Add Subcategory
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-charcoal/30 text-sm font-medium">
            Loading subcategories...
          </div>
        ) : (
          <AdminTable columns={columns} data={filteredSubcategories} />
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2rem] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 border-b border-charcoal/5 bg-warm-cream/20">
            <DialogTitle className="text-xl font-serif font-black text-charcoal">
              {editingSubcategory ? "Edit" : "Add"} <span className="text-gold font-light italic">Subcategory</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="space-y-8">
              <AdminFormInputEnhanced 
                label="Subcategory Name"
                value={formData.name || ""}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="e.g. Sofas"
                required
                error={formErrors.name}
              />
              <AdminSelectEnhanced
                label="Parent Category"
                value={formData.categoryId || ""}
                onChange={(val) => setFormData({ ...formData, categoryId: val })}
                options={categoryOptions}
                placeholder="Select Category"
                required
                error={formErrors.categoryId}
              />
              <ImageUpload 
                label="Subcategory Image"
                value={formData.image}
                onChange={(val, file) => {
                  setFormData({ ...formData, image: val });
                  if (file) setSelectedFile(file);
                }}
                className="bg-white rounded-2xl"
              />
            </div>
          </div>

          <DialogFooter className="p-8 bg-white border-t border-charcoal/5 gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl border border-charcoal/10 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-12 bg-charcoal hover:bg-gold hover:text-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all duration-500">
              {saving ? "Saving..." : "Save Subcategory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subcategory? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-4">
            <AlertDialogCancel className="flex-1 h-14 rounded-2xl border-charcoal/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}