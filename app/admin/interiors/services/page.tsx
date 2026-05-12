"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit3, Trash2, Plus, ArrowLeft, Save, Layout, CheckCircle2, XCircle } from "lucide-react";
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
import { interiorServicesService, type InteriorService } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";
import { AdminSelectEnhanced } from "@/components/admin/admin-select-enhanced";

export default function InteriorServicesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [services, setServices] = useState<InteriorService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<InteriorService | null>(null);
  const [formData, setFormData] = useState<Partial<InteriorService>>({ 
    title: "", 
    description: "", 
    calculatorType: "interior", 
    available: true,
    image: "" 
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await interiorServicesService.getServicesList(true);
      setServices(data);
    } catch (error) {
      showError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const formState = {
      title: { value: formData.title, rules: ValidationRules.name },
      description: { value: formData.description, rules: ValidationRules.required },
      calculatorType: { value: formData.calculatorType, rules: ValidationRules.required },
      image: { 
        value: formData.image || (selectedFile ? 'file' : ''), 
        rules: ValidationRules.required 
      }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const columns = [
    {
      header: "Service Info",
      accessorKey: "title",
      cell: (item: InteriorService) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            {item.image ? (
              <img src={buildImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-charcoal/5 flex items-center justify-center">
                <Layout size={16} className="text-charcoal/30" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.title}</p>
            <p className="text-[10px] text-charcoal/30 uppercase tracking-widest font-black">
              Type: {item.calculatorType}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "available",
      cell: (item: InteriorService) => (
        <div className="flex items-center gap-2">
          {item.available ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Available</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
              <XCircle size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Locked</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: InteriorService) => (
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

  const handleOpenDialog = (service: InteriorService | null = null) => {
    if (service) {
      setEditingService(service);
      setFormData({ 
        title: service.title, 
        description: service.description, 
        calculatorType: service.calculatorType, 
        available: service.available,
        image: service.image || "" 
      });
      setSelectedFile(null);
    } else {
      setEditingService(null);
      setFormData({ title: "", description: "", calculatorType: "interior", available: true, image: "" });
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
      if (editingService) {
        await interiorServicesService.updateService(editingService.id, formData, selectedFile || undefined);
        showSuccess("Service updated successfully!");
      } else {
        await interiorServicesService.createService(formData as InteriorService, selectedFile || undefined);
        showSuccess("Service created successfully!");
      }
      
      setIsDialogOpen(false);
      setTimeout(() => {
        loadServices();
      }, 500);
    } catch (error) {
      showError(editingService ? "Failed to update service" : "Failed to create service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await interiorServicesService.deleteService(id);
      showSuccess("Service deleted successfully!");
      setTimeout(() => {
        loadServices();
      }, 500);
    } catch (error) {
      showError("Failed to delete service");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Interiors
          </button>
          <h1 className="text-4xl font-serif font-black text-charcoal tracking-tight">Services Management</h1>
          <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-2">Manage dynamic interior services and calculators</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-charcoal text-white hover:bg-gold px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all group"
        >
          <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" /> Add New Service
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          {/* <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" /> */}
          <AdminFormInputEnhanced 
            label="Search"
            placeholder="Search services..." 
            value={searchQuery}
            onChange={(value) => setSearchQuery(value as string)}
            className="pl-11"
          />
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-charcoal/40">Loading services...</p>
        </div>
      ) : (
        <AdminTable 
          columns={columns} 
          data={filteredServices} 
          onRowClick={(item) => handleOpenDialog(item)}
        />
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-none rounded-3xl p-0">
          <DialogHeader className="p-8 border-b border-charcoal/5">
            <DialogTitle className="text-2xl font-serif font-black text-charcoal tracking-tight">
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <AdminFormInputEnhanced 
                  label="Service Title" 
                  value={formData.title || ""} 
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  placeholder="e.g. Full Home Interior"
                  error={formErrors.title}
                />
                
                <AdminSelectEnhanced 
                  label="Calculator Type"
                  value={formData.calculatorType || ""}
                  onChange={(val) => setFormData({ ...formData, calculatorType: val as any })}
                  options={[
                    { value: "homes", label: "Homes Calculator" },
                    { value: "interior", label: "Interior Calculator" },
                    { value: "services", label: "General Services" }
                  ]}
                  error={formErrors.calculatorType}
                />

                <AdminSelectEnhanced 
                  label="Availability"
                  value={formData.available ? "true" : "false"}
                  onChange={(val) => setFormData({ ...formData, available: val === "true" })}
                  options={[
                    { value: "true", label: "Available" },
                    { value: "false", label: "Locked (Coming Soon)" }
                  ]}
                />
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Service Image</label>
                <ImageUpload 
                  value={selectedFile ? URL.createObjectURL(selectedFile as Blob) : (formData.image ? buildImageUrl(formData.image) : "")}
                  onChange={(value, file) => {
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                  onFileSelect={(file) => setSelectedFile(file)}
                  error={formErrors.image}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[120px] p-6 rounded-2xl bg-warm-cream/30 border border-charcoal/5 text-xs font-bold text-charcoal focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                placeholder="Enter service description..."
              />
              {formErrors.description && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{formErrors.description}</p>}
            </div>
          </div>

          <DialogFooter className="p-8 border-t border-charcoal/5 bg-warm-cream/10">
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
              className="px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-charcoal text-white hover:bg-gold px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all"
            >
              {saving ? "Saving..." : <><Save size={16} className="mr-2" /> Save Service</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-none rounded-[2rem] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-serif font-black text-charcoal">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mt-4">
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-charcoal/5">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 text-white hover:bg-red-600 px-8 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
