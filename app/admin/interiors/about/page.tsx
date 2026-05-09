"use client";

import { useState, useEffect } from "react";
import { Search, Edit3, Trash2, Plus, Save, ArrowLeft, Award, Users, Clock, Shield, Palette, Home, Star, Heart, CheckCircle, Zap, Settings, List, Image as ImageIcon, Sparkles, ShieldCheck, Truck } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { aboutService, type AboutSection, type AboutSectionSettings } from "@/lib/api";
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
  { id: "Sparkles", icon: Sparkles, label: "Sparkles" },
  { id: "ShieldCheck", icon: ShieldCheck, label: "Shield Check" },
  { id: "Truck", icon: Truck, label: "Truck" },
];


const SECTION_TYPES = [
  { value: "hero", label: "Hero Section" },
  { value: "story", label: "Story Section" },
  { value: "values", label: "Values Section" },
  { value: "team", label: "Team Section" },
  { value: "stats", label: "Stats Section" },
];

interface AboutSectionSettings {
  title: string;
  subtitle: string;
  description: string;
  primaryImage: string;
  secondaryImage: string;
  circularImage: string;
  statsValue: string;
  statsLabel: string;
  features: any[];
  isActive: boolean;
}

export default function AboutAdminPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [loading, setLoading] = useState(true);
  
  // Section settings states
  const [sectionSettings, setSectionSettings] = useState<AboutSectionSettings>({
    title: "Design with Purpose. Executed with Precision.",
    subtitle: "Our philosophy and approach",
    description: "Banaya Interiors transforms spaces into legacies. We don't just design rooms; we curate experiences that resonate with your heritage and aspirations.",
    primaryImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    circularImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
    statsValue: "20+",
    statsLabel: "Bespoke Sanctuaries Crafted",
    features: [],
    isActive: true
  });
  const [sectionImageFiles, setSectionImageFiles] = useState<{
    primaryImage?: File;
    secondaryImage?: File;
    circularImage?: File;
  }>({});
  const [savingSection, setSavingSection] = useState(false);
  const [loadingSection, setLoadingSection] = useState(true);

  useEffect(() => {
    loadSectionSettings();
  }, []);

  const loadSectionSettings = async () => {
    setLoadingSection(true);
    try {
      const data = await aboutService.getSectionSettings();
      console.log('Loaded about section settings:', data);
      setSectionSettings(data);
    } catch (error) {
      console.error('Failed to load section settings:', error);
      showError("Failed to load section settings");
    } finally {
      setLoadingSection(false);
    }
  };

  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      console.log('Saving about section settings...');
      
      const updatedSettings = await aboutService.updateSectionSettings(sectionSettings, sectionImageFiles);
      
      console.log('Settings saved successfully:', updatedSettings);
      
      setSectionSettings(updatedSettings);
      setSectionImageFiles({});
      
      showSuccess("Section settings updated successfully!");
      
    } catch (error) {
      console.error('Save error:', error);
      showError("Failed to save section settings");
    } finally {
      setSavingSection(false);
    }
  };

  const addFeature = () => {
    const newFeature = { title: "", description: "", iconId: "CheckCircle" };
    setSectionSettings({ 
      ...sectionSettings, 
      features: [...(sectionSettings.features || []), newFeature] 
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = sectionSettings.features?.filter((_, i) => i !== index) || [];
    setSectionSettings({ ...sectionSettings, features: updatedFeatures });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updatedFeatures = [...(sectionSettings.features || [])];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setSectionSettings({ ...sectionSettings, features: updatedFeatures });
  };

  if (loadingSection) {
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
            <h1 className="text-xl font-semibold text-charcoal">About Section Management</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage section settings and content</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Content Settings */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-charcoal">Content Settings</h3>
                
                <AdminFormInputEnhanced 
                  label="Section Title"
                  value={sectionSettings.title}
                  onChange={(val) => setSectionSettings({ ...sectionSettings, title: val })}
                  placeholder="e.g. Design with Purpose. Executed with Precision."
                />
                
                <AdminFormInputEnhanced 
                  label="Section Subtitle"
                  value={sectionSettings.subtitle}
                  onChange={(val) => setSectionSettings({ ...sectionSettings, subtitle: val })}
                  placeholder="e.g. Our philosophy and approach"
                />
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-charcoal">Description</Label>
                  <Textarea
                    value={sectionSettings.description}
                    onChange={(e) => setSectionSettings({ ...sectionSettings, description: e.target.value })}
                    placeholder="Detailed description of your company"
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <AdminFormInputEnhanced 
                    label="Stats Value"
                    value={sectionSettings.statsValue}
                    onChange={(val) => setSectionSettings({ ...sectionSettings, statsValue: val })}
                    placeholder="e.g. 20+"
                  />
                  
                  <AdminFormInputEnhanced 
                    label="Stats Label"
                    value={sectionSettings.statsLabel}
                    onChange={(val) => setSectionSettings({ ...sectionSettings, statsLabel: val })}
                    placeholder="e.g. Projects Completed"
                  />
                </div>

                {/* Key Features Section */}
                <div className="space-y-4 pt-6 border-t border-charcoal/5">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-charcoal flex items-center gap-2">
                      <Sparkles size={18} className="text-gold" />
                      Key Features
                    </Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addFeature}
                      className="h-8 rounded-lg border-gold/20 text-gold hover:bg-gold/5"
                    >
                      <Plus size={14} className="mr-1" /> Add Feature
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {sectionSettings.features?.map((feature, index) => (
                      <div key={index} className="p-4 bg-charcoal/5 rounded-xl border border-charcoal/10 space-y-3 relative group">
                        <button 
                          onClick={() => removeFeature(index)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-medium text-charcoal/60">Icon</Label>
                            <Select 
                              value={feature.iconId} 
                              onValueChange={(val) => updateFeature(index, "iconId", val)}
                            >
                              <SelectTrigger className="h-9 bg-white">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent>
                                {ICON_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.id} value={opt.id}>
                                    <div className="flex items-center gap-2">
                                      <opt.icon size={14} />
                                      <span>{opt.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-medium text-charcoal/60">Feature Title</Label>
                            <input
                              value={feature.title}
                              onChange={(e) => updateFeature(index, "title", e.target.value)}
                              placeholder="e.g. Artisanal Mastery"
                              className="w-full h-9 px-3 bg-white border border-charcoal/10 rounded-lg text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-medium text-charcoal/60">Description</Label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, "description", e.target.value)}
                            placeholder="Brief description of this feature"
                            className="w-full h-16 p-3 bg-white border border-charcoal/10 rounded-lg text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {(!sectionSettings.features || sectionSettings.features.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-charcoal/5 rounded-2xl">
                        <p className="text-xs text-charcoal/30">No features added yet. Click 'Add Feature' to start.</p>
                      </div>
                    )}
                  </div>
                </div>
                
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
                
                <Button 
                  onClick={handleSaveSection}
                  disabled={savingSection}
                  className="w-full h-10 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl"
                >
                  <Save size={16} className="mr-2" />
                  {savingSection ? "Saving..." : "Save Section Settings"}
                </Button>
              </div>
            </div>
            
            {/* Right Column - Image Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-charcoal">Image Settings</h3>
              
              {/* Primary Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-charcoal flex items-center gap-2">
                  <ImageIcon size={16} />
                  Primary Image (Left Top)
                </Label>
                {sectionSettings.primaryImage && (
                  <div className="mb-3">
                    <img 
                      src={sectionSettings.primaryImage.startsWith('http') ? sectionSettings.primaryImage : buildImageUrl(sectionSettings.primaryImage)} 
                      alt="Primary image preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <div className="min-h-[100px]">
                  <ImageUpload 
                    label=""
                    value={""}
                    onChange={(val, file) => {
                      if (file) {
                        setSectionImageFiles({ ...sectionImageFiles, primaryImage: file });
                      } else if (val) {
                        setSectionSettings({ ...sectionSettings, primaryImage: val });
                      }
                    }}
                    onRemove={() => {
                      setSectionImageFiles({ ...sectionImageFiles, primaryImage: undefined });
                      setSectionSettings({ ...sectionSettings, primaryImage: "" });
                    }}
                  />
                </div>
              </div>
              
              {/* Secondary Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-charcoal flex items-center gap-2">
                  <ImageIcon size={16} />
                  Secondary Image (Right Top)
                </Label>
                {sectionSettings.secondaryImage && (
                  <div className="mb-3">
                    <img 
                      src={sectionSettings.secondaryImage.startsWith('http') ? sectionSettings.secondaryImage : buildImageUrl(sectionSettings.secondaryImage)} 
                      alt="Secondary image preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <div className="min-h-[100px]">
                  <ImageUpload 
                    label=""
                    value={""}
                    onChange={(val, file) => {
                      if (file) {
                        setSectionImageFiles({ ...sectionImageFiles, secondaryImage: file });
                      } else if (val) {
                        setSectionSettings({ ...sectionSettings, secondaryImage: val });
                      }
                    }}
                    onRemove={() => {
                      setSectionImageFiles({ ...sectionImageFiles, secondaryImage: undefined });
                      setSectionSettings({ ...sectionSettings, secondaryImage: "" });
                    }}
                  />
                </div>
              </div>
              
              {/* Circular Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-charcoal flex items-center gap-2">
                  <ImageIcon size={16} />
                  Circular Image (Right Bottom)
                </Label>
                {sectionSettings.circularImage && (
                  <div className="mb-3">
                    <img 
                      src={sectionSettings.circularImage.startsWith('http') ? sectionSettings.circularImage : buildImageUrl(sectionSettings.circularImage)} 
                      alt="Circular image preview" 
                      className="w-24 h-24 object-cover rounded-full border mx-auto"
                    />
                  </div>
                )}
                <div className="min-h-[100px]">
                  <ImageUpload 
                    label=""
                    value={""}
                    onChange={(val, file) => {
                      if (file) {
                        setSectionImageFiles({ ...sectionImageFiles, circularImage: file });
                      } else if (val) {
                        setSectionSettings({ ...sectionSettings, circularImage: val });
                      }
                    }}
                    onRemove={() => {
                      setSectionImageFiles({ ...sectionImageFiles, circularImage: undefined });
                      setSectionSettings({ ...sectionSettings, circularImage: "" });
                    }}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">💡 Image Guidelines</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Primary & Secondary: 500x600px (3:4 ratio)</li>
                  <li>• Circular: 300x300px (1:1 ratio)</li>
                  <li>• Format: JPG, PNG, WebP</li>
                  <li>• Max file size: 2MB each</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}