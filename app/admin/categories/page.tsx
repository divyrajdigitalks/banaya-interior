"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, Edit3, Trash2, Plus, ArrowLeft, Save } from "lucide-react";
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
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminLabel } from "@/components/admin/admin-label";
import { categoryService, type Category } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({ name: "", image: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategoryList(true);
      setCategories(data);
    } catch (error) {
      showError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const columns = [
    {
      header: "Category Info",
      accessorKey: "name",
      cell: (item: Category) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-charcoal/10 bg-charcoal/5">
            {item.image ? (
              <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-charcoal/5 flex items-center justify-center">
                <Layers size={16} className="text-charcoal/30" />
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-charcoal">{item.name}</span>
          </div>
        </div>
      )
    },
    {
      header: "Created Date",
      accessorKey: "createdAt",
      cell: (item: Category) => (
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
      header: "Actions",
      accessorKey: "id",
      cell: (item: Category) => (
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

  const handleOpenDialog = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        image: category.image || "",
      });
      setSelectedFile(null);
    } else {
      setEditingCategory(null);
      setFormData({ name: "", image: "" });
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
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData, selectedFile || undefined);
        showSuccess("Category updated successfully!");
      } else {
        await categoryService.createCategory(formData as Category, selectedFile || undefined);
        showSuccess("Category created successfully!");
      }
      
      setIsDialogOpen(false);
      // Add a small delay before reloading to ensure the operation is complete
      setTimeout(() => {
        loadCategories();
      }, 500);
    } catch (error) {
      showError(editingCategory ? "Failed to update category" : "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory?.(id);
      showSuccess("Category deleted successfully!");
      // Add a small delay before reloading to ensure the operation is complete
      setTimeout(() => {
        loadCategories();
      }, 500);
    } catch (error) {
      showError("Failed to delete category");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-xl font-semibold text-charcoal">Categories</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage product categories</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input 
              placeholder="Search categories..." 
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
            Add Category
          </Button>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredCategories} />
      </AdminCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2rem] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 border-b border-charcoal/5 bg-warm-cream/20">
            <DialogTitle className="text-xl font-serif font-black text-charcoal">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="space-y-8">
              <AdminFormInputEnhanced 
                label="Category Name"
                value={formData.name || ""}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="e.g. Living Room"
                required
                error={formErrors.name}
              />
              <ImageUpload 
                label="Category Image"
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
              <Save size={16} className="mr-2" />
              {saving ? "Saving..." : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
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
