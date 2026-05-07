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
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminLabel } from "@/components/admin/admin-label";
import { categoryService, type Category } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({ name: "", image: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await categoryService.getCategoryList(true);
    setCategories(data);
    setLoading(false);
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
      header: "ID",
      accessorKey: "id",
      cell: (item: Category) => (
        <span className="text-[11px] font-mono text-charcoal/40">#{item.id.substring(0, 6)}</span>
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
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setSaving(true);
    
    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, formData, selectedFile || undefined);
    } else {
      await categoryService.createCategory(formData as Category, selectedFile || undefined);
    }
    
    await loadCategories();
    setIsDialogOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await categoryService.deleteCategory?.(id);
    await loadCategories();
    setDeleteId(null);
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
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AdminFormInput 
              label="Category Name"
              value={formData.name || ""}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Living Room"
              required
            />
            <ImageUpload 
              label="Category Image"
              value={formData.image}
              onChange={(val, file) => {
                setFormData({ ...formData, image: val });
                if (file) setSelectedFile(file);
              }}
            />
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-9 rounded-xl border border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-9 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl">
              <Save size={16} className="mr-2" />
              {saving ? "Saving..." : "Save"}
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
