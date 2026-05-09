"use client";

import { useState, useEffect } from "react";
import { Search, Edit3, Trash2, Plus, Save, ArrowLeft, Award, Users, Clock, Shield, Palette, Home, Star, Heart, CheckCircle, Zap, Settings, List, Image as ImageIcon, User, Wallet, ShieldCheck, Headphones, Sparkles, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { whyChooseService, type WhyChooseItem, type WhyChooseSectionSettings } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

const ICON_OPTIONS = [
  { id: "Award", icon: Award, label: "Award" },
  { id: "Users", icon: Users, label: "Users" },
  { id: "Clock", icon: Clock, label: "Clock" },
  { id: "Shield", icon: Shield, label: "Shield" },
  { id: "Palette", icon: Palette, label: "Palette" },
  { id: "Home", icon: Home, label: "Home" },
  { id: "Star", icon: Star, label: "Star" },
  { id: "Heart", icon: Heart, label: "Heart" },
  { id: "CheckCircle", icon: CheckCircle, label: "Check" },
  { id: "Zap", icon: Zap, label: "Zap" },
  { id: "User", icon: User, label: "User" },
  { id: "Wallet", icon: Wallet, label: "Wallet" },
  { id: "ShieldCheck", icon: ShieldCheck, label: "Shield Check" },
  { id: "Headphones", icon: Headphones, label: "Headphones" },
  { id: "Sparkles", icon: Sparkles, label: "Sparkles" },
  { id: "Truck", icon: Truck, label: "Truck" },
];

interface SectionSettings {
  title: string;
  subtitle: string;
  sectionImage: string;
  isActive: boolean;
}

export default function WhyChooseAdminPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [whyChooseItems, setWhyChooseItems] = useState<WhyChooseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");
  
  // Item management states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WhyChooseItem | null>(null);
  const [formData, setFormData] = useState<Partial<WhyChooseItem>>({ title: "", description: "", iconId: "Award", isActive: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Section settings states
  const [sectionSettings, setSectionSettings] = useState<WhyChooseSectionSettings>({
    title: "Why Choose Banaya Interiors?",
    subtitle: "The Banaya Advantage",
    sectionImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: true
  });
  const [sectionImageFile, setSectionImageFile] = useState<File | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [loadingSection, setLoadingSection] = useState(true);

  useEffect(() => {
    loadWhyChooseItems();
    loadSectionSettings();
  }, []);

  const loadSectionSettings = async () => {
    setLoadingSection(true);
    try {
      const data = await whyChooseService.getSectionSettings();
      console.log('Loaded section settings:', data);
      setSectionSettings(data);
    } catch (error) {
      console.error('Failed to load section settings:', error);
      showError("Failed to load section settings");
    } finally {
      setLoadingSection(false);
    }
  };

  const loadWhyChooseItems = async () => {
    setLoading(true);
    try {
      const data = await whyChooseService.getWhyChooseList(true);
      setWhyChooseItems(data);
    } catch (error) {
      showError("Failed to load why choose items");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Item",
      accessorKey: "title",
      cell: (item: WhyChooseItem) => {
        const IconComponent = ICON_OPTIONS.find(i => i.id === item.iconId)?.icon || Award;
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
              <p className="text-[11px] text-charcoal/40 line-clamp-1">{item.description}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (item: WhyChooseItem) => (
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
      cell: (item: WhyChooseItem) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id || item._id); }}
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
      description: { value: formData.description, rules: ValidationRules.required }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (item: WhyChooseItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        iconId: item.iconId,
        isActive: item.isActive
      });
      setSelectedFile(null);
    } else {
      setEditingItem(null);
      setFormData({ title: "", description: "", iconId: "Award", isActive: true });
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
        const itemId = editingItem.id || editingItem._id;
        await whyChooseService.updateWhyChooseItem(itemId, formData, selectedFile || undefined);
        showSuccess("Why choose item updated successfully!");
      } else {
        await whyChooseService.createWhyChooseItem(formData as any, selectedFile || undefined);
        showSuccess("Why choose item created successfully!");
      }
      
      await loadWhyChooseItems();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Save error:', error);
      showError(editingItem ? "Failed to update why choose item" : "Failed to create why choose item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await whyChooseService.deleteWhyChooseItem(id);
      showSuccess("Why choose item deleted successfully!");
      await loadWhyChooseItems();
    } catch (error) {
      showError("Failed to delete why choose item");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredItems = whyChooseItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || loadingSection) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40">Loading...</p>
      </div>
    );
  }

  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      console.log('Saving section settings...');
      
      const updatedSettings = await whyChooseService.updateSectionSettings(sectionSettings, sectionImageFile || undefined);
      
      console.log('Settings saved successfully:', updatedSettings);
      
      // Update state with backend response
      setSectionSettings(updatedSettings);
      setSectionImageFile(null);
      
      showSuccess("Section settings updated successfully!");
      
    } catch (error) {
      console.error('Save error:', error);
      showError("Failed to save section settings");
    } finally {
      setSavingSection(false);
    }
  };

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
            <h1 className="text-xl font-semibold text-charcoal">Why Choose Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage section settings and features</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Section Settings
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <List size={16} />
              Features
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <AdminFormInputEnhanced 
                  label="Section Title"
                  value={sectionSettings.title}
                  onChange={(val) => setSectionSettings({ ...sectionSettings, title: val })}
                  placeholder="e.g. Why Choose Banaya Interiors?"
                />
                
                <AdminFormInputEnhanced 
                  label="Section Subtitle"
                  value={sectionSettings.subtitle}
                  onChange={(val) => setSectionSettings({ ...sectionSettings, subtitle: val })}
                  placeholder="e.g. The Banaya Advantage"
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sectionActive"
                    checked={sectionSettings.isActive}
                    onChange={(e) => setSectionSettings({ ...sectionSettings, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <Label htmlFor="sectionActive" className="text-sm font-medium text-charcoal">
                    Section Active (visible on website)
                  </Label>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveSection}
                    disabled={savingSection}
                    className="flex-1 h-10 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl"
                  >
                    <Save size={16} className="mr-2" />
                    {savingSection ? "Saving..." : "Save Section Settings"}
                  </Button>
                </div>
                
                
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-charcoal flex items-center gap-2">
                    <ImageIcon size={16} />
                    Section Image
                  </Label>
                  
                  {/* Current Image Preview */}
                  {sectionSettings.sectionImage && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Current Section Image:</p>
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <img 
                          src={sectionSettings.sectionImage} 
                          alt="Current section image" 
                          className="w-full h-full object-cover"
                          key={sectionSettings.sectionImage}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-medium">Current Image</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="min-h-[200px]">
                    <ImageUpload 
                      label="Upload New Section Image"
                      value={""} // Empty value for direct upload
                      onChange={(val, file) => {
                        console.log('Image upload - val:', val, 'file:', file);
                        if (file) {
                          setSectionImageFile(file);
                          console.log('New image file selected:', file.name);
                        } else if (val && typeof val === 'string') {
                          setSectionSettings({ ...sectionSettings, sectionImage: val });
                        }
                      }}
                      onRemove={() => {
                        setSectionImageFile(null);
                        setSectionSettings({ ...sectionSettings, sectionImage: "" });
                        console.log('Image removed');
                      }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-2">💡 Image Guidelines</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Recommended size: 420x525px (4:5 aspect ratio)</li>
                    <li>• Format: JPG, PNG, WebP</li>
                    <li>• Max file size: 2MB</li>
                    <li>• High-quality interior design images work best</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
                <input 
                  placeholder="Search features..." 
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
                Add Feature
              </Button>
            </div>
            
            <AdminTable columns={columns} data={filteredItems} />
          </TabsContent>
        </Tabs>
      </AdminCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingItem ? "Edit Why Choose Item" : "Add Why Choose Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AdminFormInputEnhanced 
              label="Feature Title"
              value={formData.title || ""}
              onChange={(val) => setFormData({ ...formData, title: val })}
              placeholder="e.g. Personalized Designs"
              required
              error={formErrors.title}
            />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-charcoal">Description *</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this advantage"
                className="min-h-[80px] resize-none"
              />
              {formErrors.description && (
                <p className="text-xs text-red-500">{formErrors.description}</p>
              )}
            </div>
            
              <div className="space-y-2">
                <Label className="text-sm font-medium text-charcoal">Icon</Label>
                <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, iconId: opt.id })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          formData.iconId === opt.id 
                            ? 'bg-gold/10 border-gold text-gold' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent size={18} />
                        <span className="text-xs font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            <div className="min-h-[120px]">
              <ImageUpload 
                label="Custom Icon Image (Optional)"
                value={editingItem?.image}
                onChange={(val, file) => {
                  if (file) {
                    setSelectedFile(file);
                  } else if (val === null || val === '') {
                    // Handle image removal
                    setSelectedFile(null);
                  }
                }}
                onRemove={() => {
                  setSelectedFile(null);
                  // If editing, we should also clear the existing image
                  if (editingItem) {
                    setFormData({ ...formData, image: '' });
                  }
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <Label htmlFor="isActive" className="text-sm font-medium text-charcoal">
                Active (visible on website)
              </Label>
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
            <AlertDialogTitle>Delete Why Choose Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this why choose item? This action cannot be undone.
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