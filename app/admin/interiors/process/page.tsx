"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit3, Trash2, Plus, ArrowLeft, Save, Search as SearchIcon, PenTool, Hammer, PackageCheck, Heart } from "lucide-react";
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
import { AdminCard } from "@/components/admin/admin-card";
import { processService, type ProcessStep } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

const ICON_OPTIONS = [
  { id: "Search", icon: SearchIcon, label: "Consultation" },
  { id: "PenTool", icon: PenTool, label: "Design" },
  { id: "Hammer", icon: Hammer, label: "Execution" },
  { id: "PackageCheck", icon: PackageCheck, label: "Handover" },
  { id: "Heart", icon: Heart, label: "After Sales" },
];

export default function InteriorProcessPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [formData, setFormData] = useState<Partial<ProcessStep>>({ iconId: "Search", step: "", title: "", desc: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadProcessSteps();
  }, []);

  const loadProcessSteps = async () => {
    setLoading(true);
    try {
      const data = await processService.getProcessStepList(true);
      setProcessSteps(data);
    } catch (error) {
      showError("Failed to load process steps");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const formState = {
      step: { value: formData.step, rules: ValidationRules.required },
      title: { value: formData.title, rules: ValidationRules.name },
      desc: { value: formData.desc, rules: ValidationRules.required },
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const columns = [
    {
      header: "Step",
      accessorKey: "step",
      cell: (item: ProcessStep) => (
        <span className="font-black text-gold bg-gold/5 px-3 py-1 rounded-full border border-gold/10 text-xs">
          {item.step}
        </span>
      )
    },
    {
      header: "Process Info",
      accessorKey: "title",
      cell: (item: ProcessStep) => {
        const Icon = ICON_OPTIONS.find(i => i.id === item.iconId)?.icon || SearchIcon;
        return (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal/60 border border-charcoal/10">
              <Icon size={18} />
            </div>
            <div>
              <p className="font-bold text-charcoal">{item.title}</p>
              <p className="text-[10px] text-charcoal/40 font-medium line-clamp-1">{item.desc}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: ProcessStep) => (
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

  const handleOpenDialog = (step: ProcessStep | null = null) => {
    if (step) {
      setEditingStep(step);
      setFormData({ 
        iconId: step.iconId, 
        step: step.step, 
        title: step.title, 
        desc: step.desc 
      });
    } else {
      setEditingStep(null);
      const nextStepNum = (processSteps.length + 1).toString().padStart(2, '0');
      setFormData({ iconId: "Search", step: nextStepNum, title: "", desc: "" });
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
      if (editingStep) {
        await processService.updateProcessStep(editingStep.id, formData);
        showSuccess("Process step updated successfully!");
      } else {
        await processService.createProcessStep(formData as ProcessStep);
        showSuccess("Process step created successfully!");
      }
      
      setIsDialogOpen(false);
      setTimeout(() => {
        loadProcessSteps();
      }, 500);
    } catch (error) {
      showError(editingStep ? "Failed to update process step" : "Failed to create process step");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await processService.deleteProcessStep(id);
      showSuccess("Process step deleted successfully!");
      setTimeout(() => {
        loadProcessSteps();
      }, 500);
    } catch (error) {
      showError("Failed to delete process step");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredSteps = processSteps.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.step.includes(searchQuery)
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
            <h1 className="text-xl font-semibold text-charcoal">Design Process</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage design process steps</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input 
              placeholder="Search process steps..." 
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
            Add Step
          </Button>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredSteps} />
      </AdminCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingStep ? "Edit Process Step" : "Add Process Step"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AdminFormInputEnhanced 
              label="Step Number"
              value={formData.step || ""}
              onChange={(val) => setFormData({ ...formData, step: val })}
              placeholder="e.g. 01"
              required
              error={formErrors.step}
            />
            <AdminFormInputEnhanced 
              label="Title"
              value={formData.title || ""}
              onChange={(val) => setFormData({ ...formData, title: val })}
              placeholder="e.g. Consultation"
              required
              error={formErrors.title}
            />
            <AdminFormInputEnhanced 
              label="Description"
              value={formData.desc || ""}
              onChange={(val) => setFormData({ ...formData, desc: val })}
              placeholder="Briefly explain this step..."
              required
              textarea
              error={formErrors.desc}
            />
            <div className="space-y-3">
              <p className="text-xs font-medium text-charcoal/60">Choose Icon</p>
              <div className="grid grid-cols-5 gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, iconId: opt.id })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      formData.iconId === opt.id 
                        ? 'bg-gold/10 border-gold text-gold shadow-inner' 
                        : 'bg-charcoal/5 border-transparent text-charcoal/40 hover:bg-charcoal/10'
                    }`}
                  >
                    <opt.icon size={20} />
                    <span className="text-[7px] font-black uppercase tracking-widest text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
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
            <AlertDialogTitle>Delete Process Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this process step? This action cannot be undone.
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
