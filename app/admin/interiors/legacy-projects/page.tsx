"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Edit3, Trash2, Plus, ArrowLeft, Save, MapPin, Sparkles, Settings, List } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { legacyProjectService, type LegacyProject, type LegacySettings } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function LegacyProjectsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  
  // Projects State
  const [projects, setProjects] = useState<LegacyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<LegacyProject | null>(null);
  const [formData, setFormData] = useState<Partial<LegacyProject>>({ name: "", description: "", image: "", location: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Settings State
  const [settings, setSettings] = useState<LegacySettings>({
    topLabel: "Portfolio of distinction",
    headingLine1: "Living",
    headingLine2: "Masterpieces.",
    description: "Each project is a unique dialogue between architecture and soul, meticulously crafted to reflect the essence of its inhabitants."
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await legacyProjectService.getProjects();
      if (res.success) setProjects(res.data);
    } catch (error) {
      showError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await legacyProjectService.getSettings();
      if (res.success) setSettings(res.data);
    } catch (error) {
      showError("Failed to load settings");
    }
  };

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name },
      location: { value: formData.location, rules: ValidationRules.required },
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
      cell: (item: LegacyProject) => (
        <div className="flex items-center gap-4 max-w-md">
          <div className="w-20 h-14 rounded-2xl overflow-hidden shadow-md border border-charcoal/5 flex-shrink-0">
            {item.image ? (
              <img src={item.image.startsWith('http') ? item.image : buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-charcoal/5 flex items-center justify-center">
                <Briefcase size={16} className="text-charcoal/30" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-charcoal truncate">{item.name}</p>
            <span className="text-[9px] font-bold text-charcoal/30 flex items-center gap-1 uppercase tracking-widest mt-0.5">
              <MapPin size={10} /> {item.location || "Location N/A"}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "ID",
      accessorKey: "_id",
      cell: (item: LegacyProject) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">#{item._id.substring(0, 6)}</span>
      )
    },
    {
      header: "Actions",
      accessorKey: "_id",
      cell: (item: LegacyProject) => (
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

  const handleOpenDialog = (project: LegacyProject | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({ 
        name: project.name, 
        description: project.description, 
        image: project.image || "", 
        location: project.location
      });
      setSelectedFile(null);
    } else {
      setEditingProject(null);
      setFormData({ name: "", description: "", image: "", location: "" });
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
        await legacyProjectService.updateProject(editingProject._id, formData, selectedFile || undefined);
        showSuccess("Project updated successfully!");
      } else {
        await legacyProjectService.createProject(formData, selectedFile || undefined);
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

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await legacyProjectService.updateSettings(settings);
      if (res.success) {
        setSettings(res.data);
        showSuccess("Settings updated successfully!");
      }
    } catch (error) {
      showError("Failed to update settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await legacyProjectService.deleteProject(id);
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
            <h1 className="text-xl font-semibold text-charcoal">Living Masterpieces</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage portfolio projects and section content</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="bg-white border border-charcoal/5 p-1 rounded-xl h-11 mb-6">
          <TabsTrigger value="projects" className="rounded-lg px-6 data-[state=active]:bg-gold data-[state=active]:text-white">
            <List size={14} className="mr-2" /> Projects
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg px-6 data-[state=active]:bg-gold data-[state=active]:text-white">
            <Settings size={14} className="mr-2" /> Section Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6 outline-none">
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
                className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-white rounded-xl h-10 px-6 shadow-lg shadow-gold/20"
              >
                <Plus size={18} className="mr-2" /> Add Project
              </Button>
            </div>
          </AdminCard>

          <AdminCard>
            <AdminTable 
              columns={columns} 
              data={filteredProjects} 
              loading={loading}
              onRowClick={(item) => handleOpenDialog(item)}
            />
          </AdminCard>
        </TabsContent>

        <TabsContent value="settings" className="outline-none">
          <AdminCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" /> Section Content
                </h3>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-gold hover:bg-gold/90 text-white rounded-xl h-10 px-6 shadow-lg shadow-gold/20"
                >
                  {savingSettings ? "Saving..." : <><Save size={18} className="mr-2" /> Save Settings</>}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormInputEnhanced 
                  label="Top Label"
                  value={settings.topLabel}
                  onChange={(val) => setSettings({ ...settings, topLabel: val })}
                  placeholder="e.g. Portfolio of distinction"
                />
                <div className="grid grid-cols-2 gap-4">
                  <AdminFormInputEnhanced 
                    label="Heading Line 1"
                    value={settings.headingLine1}
                    onChange={(val) => setSettings({ ...settings, headingLine1: val })}
                    placeholder="e.g. Living"
                  />
                  <AdminFormInputEnhanced 
                    label="Heading Line 2"
                    value={settings.headingLine2}
                    onChange={(val) => setSettings({ ...settings, headingLine2: val })}
                    placeholder="e.g. Masterpieces."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-charcoal">Description</Label>
                <Textarea 
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="Describe this section..."
                  className="min-h-[120px] bg-white border-charcoal/10 focus:ring-gold/30 focus:border-gold rounded-xl resize-none"
                />
              </div>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>

      {/* Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-[#fafafa] border-none shadow-2xl rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-white border-b border-charcoal/5">
            <DialogTitle className="text-2xl font-bold text-charcoal flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Briefcase className="text-gold" size={20} />
              </div>
              {editingProject ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <AdminFormInputEnhanced 
                  label="Project Name"
                  value={formData.name || ""}
                  onChange={(val) => setFormData({ ...formData, name: val })}
                  placeholder="e.g. Royal Villa Interior"
                  error={formErrors.name}
                />
                <AdminFormInputEnhanced 
                  label="Location"
                  value={formData.location || ""}
                  onChange={(val) => setFormData({ ...formData, location: val })}
                  placeholder="e.g. Mumbai, Maharashtra"
                  error={formErrors.location}
                />
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-charcoal">Description</Label>
                  <Textarea 
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the project..."
                    className="min-h-[100px] bg-white border-charcoal/10 focus:ring-gold/30 focus:border-gold rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-charcoal">Project Image</Label>
                  <ImageUpload 
                    value={formData.image || ""}
                    onChange={(val, file) => {
                      setFormData({ ...formData, image: val });
                      if (file) setSelectedFile(file);
                    }}
                    onRemove={() => {
                      setSelectedFile(null);
                      setFormData({ ...formData, image: "" });
                    }}
                    error={formErrors.image}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-white border-t border-charcoal/5 gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl px-6">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gold hover:bg-gold/90 text-white rounded-xl px-8 shadow-lg shadow-gold/20"
            >
              {saving ? "Saving..." : "Save Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem] bg-white border-none p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-charcoal">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal/60">
              This action cannot be undone. This will permanently delete the project from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-xl px-6 border-charcoal/10 hover:bg-charcoal/5">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="rounded-xl px-6 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
