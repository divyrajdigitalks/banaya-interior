"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Layout, Sparkles, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminFormInput } from "@/components/admin/form-input";
import { motion } from "framer-motion";
import { heroService, type DecorHeroData } from "@/lib/api/services/hero.service";
import { useAdminToast } from "@/hooks/use-admin-toast";

export default function DecorHeroAdmin() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<DecorHeroData>>({
    topLabel: "",
    headingLine1: "",
    headingLine2: "",
    description: "",
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
    rightHeading: "",
    rightQuote: "",
    features: ["", "", "", ""]
  });

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    setLoading(true);
    try {
      const response = await heroService.getDecorHero();
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
      const response = await heroService.updateDecorHero(formData);
      if (response.success) {
        showSuccess("Decor Hero Section updated successfully!");
        setFormData(response.data);
      } else {
        showError(response.error || "Failed to update hero section");
      }
    } catch (error) {
      showError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Main Content */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Left Side Content</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary Hero Text</p>
              </div>
            </div>

            <div className="space-y-8">
              <AdminFormInput
                label="Est. Label"
                value={formData.topLabel || ""}
                onChange={(val) => setFormData({ ...formData, topLabel: val })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Hero Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdminFormInput
                  label="CTA 1 Button"
                  value={formData.cta1Text || ""}
                  onChange={(val) => setFormData({ ...formData, cta1Text: val })}
                />
                <AdminFormInput
                  label="CTA 2 Button"
                  value={formData.cta2Text || ""}
                  onChange={(val) => setFormData({ ...formData, cta2Text: val })}
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                <ListChecks size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Right Side Features</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quality Highlights</p>
              </div>
            </div>

            <div className="space-y-8">
              <AdminFormInput
                label="Right Heading"
                value={formData.rightHeading || ""}
                onChange={(val) => setFormData({ ...formData, rightHeading: val })}
              />

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Quote Text</Label>
                <textarea 
                  value={formData.rightQuote}
                  onChange={(e) => setFormData({ ...formData, rightQuote: e.target.value })}
                  className="w-full h-24 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-orange-500/5 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Feature List (4 Items)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.features?.map((feature, i) => (
                    <AdminFormInput
                      key={i}
                      label={`Feature ${i + 1}`}
                      value={feature}
                      onChange={(val) => updateFeature(i, val)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: CTA Links */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Layout size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">CTA Links</h3>
            </div>
            
            <div className="space-y-6">
              <AdminFormInput
                label="CTA 1 Link"
                value={formData.cta1Link || ""}
                onChange={(val) => setFormData({ ...formData, cta1Link: val })}
                placeholder="/shop"
              />
              <AdminFormInput
                label="CTA 2 Link"
                value={formData.cta2Link || ""}
                onChange={(val) => setFormData({ ...formData, cta2Link: val })}
                placeholder="/decor"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 p-10 rounded-[32px] shadow-2xl shadow-slate-200 space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="flex items-center gap-3 text-gold relative z-10">
              <Layout size={20} />
              <h3 className="text-xs font-black uppercase tracking-[0.25em]">Live Preview</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
              Changes will take effect globally across the Decor section of the site.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Save Button at bottom */}
      <div className="mt-12 flex justify-end">
        <Button 
          onClick={handleSave}
          className="h-16 bg-slate-900 hover:bg-black text-white font-bold text-base px-16 rounded-[2rem] shadow-2xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save size={24} className="text-gold" />
          Update Decor Hero
        </Button>
      </div>
    </div>
  );
}
