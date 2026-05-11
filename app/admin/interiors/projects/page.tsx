"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Edit3, Trash2, Plus, ArrowLeft, Save, MapPin, Sparkles } from "lucide-react";
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
import { interiorService, type InteriorProject, type InteriorCategory } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "recharts";

export default function InteriorProjectsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [projects, setProjects] = useState<InteriorProject[]>([]);
  const [categories, setCategories] = useState<InteriorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<InteriorProject | null>(null);
  const [formData, setFormData] = useState<Partial<InteriorProject>>({ name: "", category: "", description: "", image: "", location: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        interiorService.getProjects(),
        interiorService.getCategories()
      ]);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name },
      category: { value: formData.category, rules: ValidationRules.required },
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
      header: "Project Info",
      accessorKey: "name",
      cell: (item: InteriorProject) => (
        <div className="flex items-center gap-4 max-w-md">
          <div className="w-20 h-14 rounded-2xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            {item.image ? (
              <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-charcoal/5 flex items-center justify-center">
                <Briefcase size={16} className="text-charcoal/30" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-charcoal truncate">{item.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10">
                {typeof item.category === 'object' ? item.category.name : item.category}
              </span>
              <span className="text-[9px] font-bold text-charcoal/30 flex items-center gap-1 uppercase tracking-widest">
                <MapPin size={10} /> {item.location || "Location N/A"}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "ID",
      accessorKey: "_id",
      cell: (item: InteriorProject) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">#{item._id.substring(0, 6)}</span>
      )
    },
    {
      header: "Actions",
      accessorKey: "_id",
      cell: (item: InteriorProject) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item._id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (project: InteriorProject | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({ 
        name: project.name, 
        category: typeof project.category === 'object' ? project.category._id : project.category, 
        description: project.description, 
        image: project.image || "", 
        location: project.location,
      });
      setSelectedFile(null);
    } else {
      setEditingProject(null);
      setFormData({ name: "", category: "", description: "", image: "", location: "" });
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
      if (editingProject) {
        await interiorService.updateProject(editingProject._id, formData, selectedFile || undefined);
        showSuccess("Project updated successfully!");
      } else {
        await interiorService.createProject(formData, selectedFile || undefined);
        showSuccess("Project created successfully!");
      }
      
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      showError(editingProject ? "Failed to update project" : "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await interiorService.deleteProject(id);
      showSuccess("Project deleted successfully!");
      loadData();
    } catch (error) {
      showError("Failed to delete project");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-xl font-semibold text-charcoal">Projects</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage interior projects</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input 
              placeholder="Search projects..." 
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
            Add Project
          </Button>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredProjects} />
      </AdminCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <AdminFormInputEnhanced 
                label="Project Title"
                value={formData.name || ""}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="e.g. Niseko Dining House"
                required
                error={formErrors.name}
              />
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-charcoal/40">Category</Label>
                <Select 
                  value={typeof formData.category === 'string' ? formData.category : typeof formData.category === 'object' ? formData.category?._id : undefined} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-charcoal/10 bg-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-charcoal/10 shadow-2xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id} className="text-sm font-medium">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">{formErrors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AdminFormInputEnhanced 
                label="Location"
                value={formData.location || ""}
                onChange={(val) => setFormData({ ...formData, location: val })}
                placeholder="e.g. Hokkaido, Japan"
              />
              <AdminFormInputEnhanced 
                label="Description"
                value={formData.description || ""}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Tell the story..."
              />
            </div>

            <ImageUpload 
              label="Project Image"
              value={formData.image}
              onChange={(val, file) => {
                setFormData({ ...formData, image: val });
                if (file) setSelectedFile(file);
              }}
              error={formErrors.image}
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
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
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
