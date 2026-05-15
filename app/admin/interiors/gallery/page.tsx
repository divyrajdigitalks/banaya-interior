"use client";

import { useState, useEffect } from "react";
import { Search, GalleryHorizontal, Edit3, Trash2, Plus, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { galleryService, type GalleryImage } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";

export default function InteriorGalleryPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({ title: "", subtitle: "", src: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getGalleryList(true);
      setGallery(data);
    } catch (error) {
      showError("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Gallery Item",
      accessorKey: "title",
      cell: (item: GalleryImage) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-xl overflow-hidden border border-charcoal/10 bg-charcoal/5">
            <img src={buildImageUrl(item.src)} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">{item.title}</p>
            {item.subtitle && (
              <p className="text-[11px] text-charcoal/40">{item.subtitle}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: "ID",
      accessorKey: "id",
      cell: (item: GalleryImage) => (
        <span className="text-[11px] font-mono text-charcoal/40">#{item.id.substring(0, 6)}</span>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: GalleryImage) => (
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
      src: {
        value: formData.src || (selectedFile ? 'file' : ''),
        rules: ValidationRules.required
      }
    };

    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (item: GalleryImage | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        subtitle: item.subtitle,
        src: item.src,
      });
      setSelectedFile(null);
    } else {
      setEditingItem(null);
      setFormData({ title: "", subtitle: "", src: "" });
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
        await galleryService.updateGalleryImage(editingItem.id, formData, selectedFile || undefined);
        showSuccess("Gallery item updated successfully!");
      } else {
        await galleryService.createGalleryImage(formData as GalleryImage, selectedFile || undefined);
        showSuccess("Gallery item created successfully!");
      }

      await loadGallery();
      setIsDialogOpen(false);
    } catch (error) {
      showError(editingItem ? "Failed to update gallery item" : "Failed to create gallery item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await galleryService.deleteGalleryImage(id);
      showSuccess("Gallery item deleted successfully!");
      await loadGallery();
    } catch (error) {
      showError("Failed to delete gallery item");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredGallery = gallery.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <h1 className="text-xl font-semibold text-charcoal">Gallery Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage your interior gallery items</p>
          </div>
        </div>
      </div>

      <AdminSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search gallery..."
        actionLabel="Add Item"
        onAction={() => handleOpenDialog()}
        ActionIcon={Plus}
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredGallery} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AdminFormInputEnhanced
              label="Title"
              value={formData.title || ""}
              onChange={(val) => setFormData({ ...formData, title: val })}
              placeholder="e.g. Elegant Living Space"
              required
              error={formErrors.title}
            />
            <AdminFormInputEnhanced
              label="Subtitle"
              value={formData.subtitle || ""}
              onChange={(val) => setFormData({ ...formData, subtitle: val })}
              placeholder="e.g. Modern luxury interior design"
            />
            <div className="min-h-[120px]">
              <ImageUpload
                label="Gallery Image"
                value={formData.src}
                onChange={(val, file) => {
                  setFormData({ ...formData, src: val });
                  if (file) setSelectedFile(file);
                }}
                error={formErrors.src}
              />
            </div>
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
            <AlertDialogTitle>Delete Gallery Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this gallery item? This action cannot be undone.
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
