"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Layout, Image as ImageIcon, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { AdminFormInput } from "@/components/admin/form-input";
import { motion } from "framer-motion";
import { heroService, type InteriorHeroData } from "@/lib/api/services/hero.service";
import { useAdminToast } from "@/hooks/use-admin-toast";

export default function InteriorHeroAdmin() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<InteriorHeroData>>({
    backgroundImage: "",
    topLabel: "",
    headingLine1: "",
    headingLine2: "",
    description: "",
    cta1Text: "",
    cta2Text: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    setLoading(true);
    try {
      const response = await heroService.getInteriorHero();
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      showError("Failed to load hero data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await heroService.updateInteriorHero(formData, selectedFile);
      if (response.success) {
        showSuccess("Interior Hero Section updated successfully!");
        setFormData(response.data);
        setSelectedFile(undefined);
      } else {
        showError(response.error || "Failed to update hero section");
      }
    } catch (error) {
      showError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Hero Content</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Text and Copy</p>
              </div>
            </div>

            <div className="space-y-6">
              <AdminFormInput
                label="Top Label"
                value={formData.topLabel || ""}
                onChange={(val) => setFormData({ ...formData, topLabel: val })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormInput
                  label="Heading Line 1"
                  value={formData.headingLine1 || ""}
                  onChange={(val) => setFormData({ ...formData, headingLine1: val })}
                />
                <AdminFormInput
                  label="Heading Line 2 (Gold)"
                  value={formData.headingLine2 || ""}
                  onChange={(val) => setFormData({ ...formData, headingLine2: val })}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Main Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-40 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormInput
                  label="Primary CTA Button"
                  value={formData.cta1Text || ""}
                  onChange={(val) => setFormData({ ...formData, cta1Text: val })}
                />
                <AdminFormInput
                  label="Secondary CTA Button"
                  value={formData.cta2Text || ""}
                  onChange={(val) => setFormData({ ...formData, cta2Text: val })}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Media & Preview */}
        <div className="lg:col-span-5 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Background Media</h3>
            </div>
            
            <div className="space-y-6">
              <ImageUpload 
                label="Hero Background Image"
                value={formData.backgroundImage}
                onChange={(val, file) => {
                  if (file) {
                    setSelectedFile(file);
                  } else {
                    setFormData({ ...formData, backgroundImage: val });
                  }
                }}
                onRemove={() => {
                  setFormData({ ...formData, backgroundImage: "" });
                  setSelectedFile(undefined);
                }}
              />
              
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                <Info size={20} className="text-blue-500 shrink-0" />
                <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
                  Use high-resolution images (1920x1080) for the best visual experience. The background will have a dark overlay applied automatically.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Live Preview Hint */}
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 p-10 rounded-[32px] shadow-2xl shadow-slate-200 space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="flex items-center gap-3 text-gold relative z-10">
              <Layout size={20} />
              <h3 className="text-xs font-black uppercase tracking-[0.25em]">Design Tip</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
              Keep your headings short and punchy for maximum impact. Heading line 2 will be highlighted in <span className="text-gold font-bold">Banaya Gold</span>.
            </p>
          </motion.div> */}
        </div>
      </div>

      {/* Save Button at bottom */}
      <div className="mt-12 flex justify-end">
        <Button 
          onClick={handleSave}
          className="h-16 bg-slate-900 hover:bg-black text-white font-bold text-base px-16 rounded-[2rem] shadow-2xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save size={24} className="text-gold" />
          Update Hero Section
        </Button>
      </div>
    </div>
  );
}
