"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, ShieldCheck, Heart, Info, Layout, Phone, ListChecks, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { motion } from "framer-motion";

export default function DecorFeaturesAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    backgroundText: "CRAFTSMANSHIP",
    mainImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    badge1: { icon: "Sparkles", title: "Artisanal Craft", subtitle: "Hand-carved items" },
    badge2: { icon: "ShieldCheck", title: "Food Safe", subtitle: "Natural Finish" },
    topLabel: "The Art of Living",
    headingLine1: "Handcrafted",
    headingLine2: "Soulful",
    description: "Discover objects that transcend utility, each carved by master artisans to bring warmth and heritage into your home. 100% natural, scratch-proof, and designed to last generations.",
    quickFeatures: [
      { label: "Material", value: "Premium Teak" },
      { label: "Finish", value: "Organic Oil" },
      { label: "Durability", value: "Lifetime" },
      { label: "Safe", value: "100% Food Safe" },
    ],
    phone: "+91 88558 17434"
  });

  const handleSave = () => {
    console.log("Saving Decor Features:", formData);
    alert("Decor Features Section updated successfully!");
  };

  const updateQuickFeature = (index: number, field: 'label' | 'value', val: string) => {
    const newFeatures = [...formData.quickFeatures];
    newFeatures[index] = { ...newFeatures[index], [field]: val };
    setFormData({ ...formData, quickFeatures: newFeatures });
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Text & Content */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
                <Layout size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Main Content</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Text and Headings</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Section Top Label</Label>
                <input 
                  value={formData.topLabel}
                  onChange={(e) => setFormData({ ...formData, topLabel: e.target.value })}
                  className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Heading Line 1</Label>
                  <input 
                    value={formData.headingLine1}
                    onChange={(e) => setFormData({ ...formData, headingLine1: e.target.value })}
                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-xl font-black"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Heading Line 2 (Gold)</Label>
                  <input 
                    value={formData.headingLine2}
                    onChange={(e) => setFormData({ ...formData, headingLine2: e.target.value })}
                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-xl font-black text-gold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Main Description</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
                  <input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-bold"
                  />
                </div>
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
                <h2 className="text-xl font-black text-slate-900">Quick Features</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Specifications Grid</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.quickFeatures.map((item, i) => (
                <div key={i} className="space-y-4 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</Label>
                    <input 
                      value={item.label}
                      onChange={(e) => updateQuickFeature(i, 'label', e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-white focus:border-gold/50 transition-all outline-none text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</Label>
                    <input 
                      value={item.value}
                      onChange={(e) => updateQuickFeature(i, 'value', e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-white focus:border-gold/50 transition-all outline-none text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Media & Badges */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Visual Assets</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Background Decorative Text</Label>
                <input 
                  value={formData.backgroundText}
                  onChange={(e) => setFormData({ ...formData, backgroundText: e.target.value })}
                  className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-bold uppercase tracking-widest"
                />
              </div>

              <ImageUpload 
                label="Main Product Showcase"
                value={formData.mainImage}
                onChange={(val) => setFormData({ ...formData, mainImage: val })}
              />
            </div>
          </motion.div>

          {/* Floating Badges Config */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Floating Badges</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Badge 1 (Top Left)</p>
                <div className="space-y-3">
                  <input 
                    value={formData.badge1.title}
                    onChange={(e) => setFormData({ ...formData, badge1: { ...formData.badge1, title: e.target.value } })}
                    placeholder="Title"
                    className="w-full h-12 px-5 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-xs font-bold"
                  />
                  <input 
                    value={formData.badge1.subtitle}
                    onChange={(e) => setFormData({ ...formData, badge1: { ...formData.badge1, subtitle: e.target.value } })}
                    placeholder="Subtitle"
                    className="w-full h-12 px-5 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Badge 2 (Bottom Right)</p>
                <div className="space-y-3">
                  <input 
                    value={formData.badge2.title}
                    onChange={(e) => setFormData({ ...formData, badge2: { ...formData.badge2, title: e.target.value } })}
                    placeholder="Title"
                    className="w-full h-12 px-5 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-xs font-bold"
                  />
                  <input 
                    value={formData.badge2.subtitle}
                    onChange={(e) => setFormData({ ...formData, badge2: { ...formData.badge2, subtitle: e.target.value } })}
                    placeholder="Subtitle"
                    className="w-full h-12 px-5 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-end">
        <Button 
          onClick={handleSave}
          className="h-16 bg-slate-900 hover:bg-black text-white font-bold text-base px-16 rounded-[2rem] shadow-2xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save size={24} className="text-gold" />
          Update Features Section
        </Button>
      </div>
    </div>
  );
}
