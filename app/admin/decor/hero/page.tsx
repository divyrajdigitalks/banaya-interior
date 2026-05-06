"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Layout, Video, Sparkles, ListChecks, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminFormInput } from "@/components/admin/form-input";
import { motion } from "framer-motion";

export default function DecorHeroAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    videoSrc: "/loop.mp4",
    topLabel: "Est. Since 2020",
    headingLine1: "Banaya",
    headingLine2: "Decor",
    description: "Masterfully handcrafted wooden serving treasures designed for the most distinguished dining experiences.",
    cta1Text: "Shop Collection",
    cta2Text: "View Lookbook",
    rightHeading: "Uncompromising quality and detail",
    rightQuote: "Elevate every culinary ritual with our signature heritage-fit tray collection.",
    features: [
      "100% Sustainable Acacia Wood",
      "Heritage Artisan Craftsmanship",
      "Food-Safe Royal Finish",
      "Modular Interlock Design"
    ]
  });

  const handleSave = () => {
    console.log("Saving Decor Hero:", formData);
    alert("Decor Hero Section updated successfully!");
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
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Est. Label</Label>
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
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Hero Description</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">CTA 1 Button</Label>
                  <input 
                    value={formData.cta1Text}
                    onChange={(e) => setFormData({ ...formData, cta1Text: e.target.value })}
                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">CTA 2 Button</Label>
                  <input 
                    value={formData.cta2Text}
                    onChange={(e) => setFormData({ ...formData, cta2Text: e.target.value })}
                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-bold"
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
                <h2 className="text-xl font-black text-slate-900">Right Side Features</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quality Highlights</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Right Heading</Label>
                <input 
                  value={formData.rightHeading}
                  onChange={(e) => setFormData({ ...formData, rightHeading: e.target.value })}
                  className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-orange-500/50 transition-all outline-none text-sm font-bold"
                />
              </div>

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
                  {formData.features.map((feature, i) => (
                    <input 
                      key={i}
                      value={feature}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-sm font-bold"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Media */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Video size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Background Video</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Video Source Path</Label>
                <input 
                  value={formData.videoSrc}
                  onChange={(e) => setFormData({ ...formData, videoSrc: e.target.value })}
                  placeholder="/loop.mp4"
                  className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-purple-500/50 transition-all outline-none text-sm font-bold"
                />
              </div>
              
              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex gap-4">
                <Info size={20} className="text-purple-500 shrink-0" />
                <p className="text-[13px] text-purple-700 font-medium leading-relaxed">
                  Provide the local path or URL to the MP4 video. Recommended format: H.264, muted, looping.
                </p>
              </div>
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
              Changes will take effect globally across the Decor section of the site. Ensure the video path is correct to avoid a black screen.
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
