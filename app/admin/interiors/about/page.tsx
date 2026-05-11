"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Save, ArrowLeft, Award, Users, Clock, Shield, Palette, Home, Star, Heart, CheckCircle, Zap, Image as ImageIcon, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminCard } from "@/components/admin/admin-card";
import { aboutService, type AboutSectionSettings } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";

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
  const [sectionSettings, setSectionSettings] = useState<AboutSectionSettings>({
    title: "Design with Purpose. Executed with Precision.",
    subtitle: "Our philosophy and approach",
    description: "Banaya Interiors transforms spaces into legacies.",
    primaryImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    circularImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
    statsValue: "20+",
    statsLabel: "Bespoke Sanctuaries Crafted",
    features: [],
    isActive: true,
  });
  const [sectionImageFiles, setSectionImageFiles] = useState<{
    primaryImage?: File;
    secondaryImage?: File;
    circularImage?: File;
  }>({});
  const [savingSection, setSavingSection] = useState(false);
  const [loadingSection, setLoadingSection] = useState(true);

  useEffect(() => { loadSectionSettings(); }, []);

  const loadSectionSettings = async () => {
    setLoadingSection(true);
    try {
      const data = await aboutService.getSectionSettings();
      setSectionSettings(data);
    } catch {
      showError("Failed to load section settings");
    } finally {
      setLoadingSection(false);
    }
  };

  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      const updated = await aboutService.updateSectionSettings(sectionSettings, sectionImageFiles);
      setSectionSettings(updated);
      setSectionImageFiles({});
      showSuccess("Saved successfully!");
    } catch {
      showError("Failed to save");
    } finally {
      setSavingSection(false);
    }
  };

  const set = (key: keyof AboutSectionSettings, val: any) =>
    setSectionSettings((p) => ({ ...p, [key]: val }));

  const addFeature = () =>
    set("features", [...(sectionSettings.features || []), { title: "", description: "", iconId: "CheckCircle" }]);

  const removeFeature = (i: number) =>
    set("features", sectionSettings.features.filter((_, idx) => idx !== i));

  const updateFeature = (i: number, field: string, val: string) => {
    const arr = [...sectionSettings.features];
    arr[i] = { ...arr[i], [field]: val };
    set("features", arr);
  };

  const imgSrc = (url: string) =>
    url.startsWith("http") ? url : buildImageUrl(url);

  if (loadingSection) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-xs text-charcoal/40">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-4 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()} className="h-8 w-8 rounded-lg bg-white border border-charcoal/10 p-0">
            <ArrowLeft size={16} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-base font-semibold text-charcoal">About Section</h1>
            <p className="text-[11px] text-charcoal/40">Manage content and images</p>
          </div>
        </div>
        <Button onClick={handleSaveSection} disabled={savingSection} className="h-8 px-4 bg-charcoal hover:bg-charcoal/90 text-white rounded-lg text-xs">
          <Save size={13} className="mr-1.5" />
          {savingSection ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Basic Info */}
          <AdminCard>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Content</p>
              <AdminFormInputEnhanced
                label="Title"
                value={sectionSettings.title}
                onChange={(v) => set("title", v)}
                placeholder="Section title"
              />
              <AdminFormInputEnhanced
                label="Subtitle"
                value={sectionSettings.subtitle}
                onChange={(v) => set("subtitle", v)}
                placeholder="Section subtitle"
              />
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-charcoal/60">Description</Label>
                <Textarea
                  value={sectionSettings.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Company description"
                  className="min-h-[72px] resize-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AdminFormInputEnhanced
                  label="Stats Value"
                  value={sectionSettings.statsValue}
                  onChange={(v) => set("statsValue", v)}
                  placeholder="e.g. 20+"
                />
                <AdminFormInputEnhanced
                  label="Stats Label"
                  value={sectionSettings.statsLabel}
                  onChange={(v) => set("statsLabel", v)}
                  placeholder="e.g. Projects Completed"
                />
              </div>
            </div>
          </AdminCard>

          {/* Key Features */}
          <AdminCard>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-gold" /> Key Features
                </p>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}
                  className="h-7 px-2.5 rounded-lg border-gold/20 text-gold hover:bg-gold/5 text-xs">
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>

              {sectionSettings.features?.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-charcoal/5 rounded-xl">
                  <p className="text-xs text-charcoal/30">No features yet. Click Add to start.</p>
                </div>
              )}

              <div className="space-y-2">
                {sectionSettings.features?.map((feature, index) => (
                  <div key={index} className="p-3 bg-charcoal/[0.03] rounded-xl border border-charcoal/8 space-y-2 relative group">
                    <button onClick={() => removeFeature(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center bg-red-50 text-red-400 border border-red-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                      <Trash2 size={11} />
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-8">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-charcoal/50">Icon</Label>
                        <Select value={feature.iconId} onValueChange={(v) => updateFeature(index, "iconId", v)}>
                          <SelectTrigger className="h-8 bg-white text-xs">
                            <SelectValue placeholder="Icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                <div className="flex items-center gap-2">
                                  <opt.icon size={13} /><span className="text-xs">{opt.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-charcoal/50">Title</Label>
                        <input value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)}
                          placeholder="Feature title"
                          className="w-full h-8 px-2.5 bg-white border border-charcoal/10 rounded-lg text-xs focus:ring-1 focus:ring-gold/30 focus:border-gold outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-medium text-charcoal/50">Description</Label>
                      <textarea value={feature.description} onChange={(e) => updateFeature(index, "description", e.target.value)}
                        placeholder="Brief description"
                        className="w-full h-14 p-2.5 bg-white border border-charcoal/10 rounded-lg text-xs focus:ring-1 focus:ring-gold/30 focus:border-gold outline-none resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>

          {/* Active toggle */}
          <AdminCard>
            <div className="flex items-center gap-2.5">
              <input type="checkbox" id="sectionActive" checked={sectionSettings.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="rounded border-gray-300 text-gold focus:ring-gold w-4 h-4" />
              <Label htmlFor="sectionActive" className="text-sm text-charcoal cursor-pointer">
                Section Active <span className="text-charcoal/40 font-normal">(visible on website)</span>
              </Label>
            </div>
          </AdminCard>
        </div>

        {/* Right: Images */}
        <div className="space-y-4">
          <AdminCard>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Images</p>

              {/* Primary */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-charcoal/60 flex items-center gap-1">
                  <ImageIcon size={11} /> Primary <span className="text-charcoal/30">(Left Top)</span>
                </Label>
                {sectionSettings.primaryImage && (
                  <img src={imgSrc(sectionSettings.primaryImage)} alt="Primary"
                    className="w-full h-24 object-cover rounded-lg border border-charcoal/10" />
                )}
                <ImageUpload label="" value=""
                  onChange={(val, file) => {
                    if (file) setSectionImageFiles((p) => ({ ...p, primaryImage: file }));
                    else if (val) set("primaryImage", val);
                  }}
                  onRemove={() => {
                    setSectionImageFiles((p) => ({ ...p, primaryImage: undefined }));
                    set("primaryImage", "");
                  }}
                />
              </div>

              <div className="border-t border-charcoal/5" />

              {/* Secondary */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-charcoal/60 flex items-center gap-1">
                  <ImageIcon size={11} /> Secondary <span className="text-charcoal/30">(Right Top)</span>
                </Label>
                {sectionSettings.secondaryImage && (
                  <img src={imgSrc(sectionSettings.secondaryImage)} alt="Secondary"
                    className="w-full h-24 object-cover rounded-lg border border-charcoal/10" />
                )}
                <ImageUpload label="" value=""
                  onChange={(val, file) => {
                    if (file) setSectionImageFiles((p) => ({ ...p, secondaryImage: file }));
                    else if (val) set("secondaryImage", val);
                  }}
                  onRemove={() => {
                    setSectionImageFiles((p) => ({ ...p, secondaryImage: undefined }));
                    set("secondaryImage", "");
                  }}
                />
              </div>

              <div className="border-t border-charcoal/5" />

              {/* Circular */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-charcoal/60 flex items-center gap-1">
                  <ImageIcon size={11} /> Circular <span className="text-charcoal/30">(Right Bottom)</span>
                </Label>
                {sectionSettings.circularImage && (
                  <div className="flex justify-center">
                    <img src={imgSrc(sectionSettings.circularImage)} alt="Circular"
                      className="w-16 h-16 object-cover rounded-full border border-charcoal/10" />
                  </div>
                )}
                <ImageUpload label="" value=""
                  onChange={(val, file) => {
                    if (file) setSectionImageFiles((p) => ({ ...p, circularImage: file }));
                    else if (val) set("circularImage", val);
                  }}
                  onRemove={() => {
                    setSectionImageFiles((p) => ({ ...p, circularImage: undefined }));
                    set("circularImage", "");
                  }}
                />
              </div>
            </div>
          </AdminCard>

          {/* Guidelines */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[11px] font-semibold text-blue-700 mb-1">💡 Guidelines</p>
            <ul className="text-[10px] text-blue-600 space-y-0.5">
              <li>• Primary & Secondary: 500×600px</li>
              <li>• Circular: 300×300px</li>
              <li>• JPG, PNG, WebP · Max 2MB</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
