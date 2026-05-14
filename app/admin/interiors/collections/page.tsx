"use client";

import { useState, useEffect } from "react";
import { Search, Library, Edit3, Trash2, Plus } from "lucide-react";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { collectionService, type Collection } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function InteriorCollectionsPage() {
  const { showSuccess, showError } = useAdminToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState<Partial<Collection>>({ name: "", description: "", image: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await collectionService.getCollectionList(true);
      setCollections(data);
    } catch (error) {
      showError("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCollections(); }, []);

  const columns = [
    {
      header: "Collection",
      accessorKey: "name",
      cell: (item: Collection) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            {item.image ? (
              <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-charcoal/5 flex items-center justify-center">
                <Library size={20} className="text-charcoal/30" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
          </div>
        </div>
      )
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (item: Collection) => (
        <p className="text-[11px] text-charcoal/50 line-clamp-2 max-w-xs leading-relaxed font-medium">
          {item.description || "No description"}
        </p>
      )
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item: Collection) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-10 h-10  flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            className="w-10 h-10  flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (collection: Collection | null = null) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({ 
        name: collection.name, 
        description: collection.description || "", 
        image: collection.image
      });
      setSelectedFile(null);
    } else {
      setEditingCollection(null);
      setFormData({ name: "", description: "", image: "" });
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
      if (editingCollection) {
        await collectionService.updateCollection(editingCollection.id, formData, selectedFile || undefined);
        showSuccess("Collection updated successfully!");
      } else {
        await collectionService.createCollection(formData as Collection, selectedFile || undefined);
        showSuccess("Collection created successfully!");
      }
      
      await loadCollections();
      setIsDialogOpen(false);
    } catch (error) {
      showError(editingCollection ? "Failed to update collection" : "Failed to create collection");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await collectionService.deleteCollection(id);
      showSuccess("Collection deleted successfully!");
      await loadCollections();
    } catch (error) {
      showError("Failed to delete collection");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 pt-8  mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-[500px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={20} />
          <Input 
            placeholder="Search interior collections..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-16 h-16 bg-white border-charcoal/5 rounded-[2rem] focus:ring-gold/20 focus:border-gold transition-all shadow-2xl shadow-charcoal/5 text-base"
          />
        </div>

        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full lg:w-auto bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase p-4 rounded-lg] shadow-2xl flex items-center gap-4 group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-8 h-8 bg-gold/20 flex items-center justify-center text-gold group-hover:rotate-90 transition-transform duration-500">
            <Plus size={18} />
          </div>
          New Interior Collection
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-charcoal/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-charcoal/30 text-sm font-medium">
            Loading collections...
          </div>
        ) : (
          <AdminTable columns={columns} data={filteredCollections} />
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto border-none shadow-2xl">
          <DialogHeader className="pb-8 border-b border-charcoal/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Library size={24} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-charcoal">
                  {editingCollection ? "Refine" : "New"} <span className="text-gold font-bold">Interior Series</span>
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Interior Curation</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-10">
            <AdminFormInputEnhanced 
              label="Collection Name"
              value={formData.name || ""}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. The Heritage Interiors"
              required
              error={formErrors.name}
            />

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40 ml-1">Collection Narrative</Label>
              <textarea 
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the soul of this interior collection..."
                className="w-full h-32 p-5 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all text-sm font-medium leading-relaxed resize-none"
              />
            </div>

            <div className="h-40">
              <ImageUpload 
                label="Collection Cover Image"
                value={formData.image}
                onChange={(val, file) => {
                  setFormData({ ...formData, image: val });
                  if (file) setSelectedFile(file);
                }}
              />
            </div>
          </div>

          <DialogFooter className="pt-8 border-t border-charcoal/5 flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="flex-1 h-16 rounded-2xl border-charcoal/10 font-bold text-charcoal/60 hover:bg-charcoal/5 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-16 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-charcoal/10 transition-all active:scale-95"
            >
              {saving ? "Saving..." : "Save Interior Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[3rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-4">
            <AlertDialogCancel className="flex-1 h-16 rounded-2xl border-charcoal/10 font-bold text-charcoal/60">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 h-16 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}