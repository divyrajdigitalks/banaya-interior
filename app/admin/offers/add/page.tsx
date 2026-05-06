"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Calendar, Clock, Info, Tag, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminFormInput } from "@/components/admin/form-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { motion } from "framer-motion";

export default function AddOfferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    image: "",
    isActive: true,
    terms: "",
    offerType: "General"
  });

  const handleSave = () => {
    if (!formData.name || !formData.discount || !formData.image) {
      alert("Please fill all required fields");
      return;
    }
    console.log("Saving offer:", formData);
    router.push("/admin/offers");
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sticky top-0 z-40 bg-white/80 backdrop-blur-xl py-6 border-b border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all group"
          >
            <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Marketing Offer</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Marketing & Sales</span>
              </div>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Promotion</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex-1 sm:flex-none h-14 px-10 rounded-2xl border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
          >
            Discard
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 sm:flex-none h-14 bg-slate-900 hover:bg-black text-white font-bold text-sm px-12 rounded-2xl shadow-2xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={20} className="text-gold" />
            Publish Offer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">General Information</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Offer Identity and Messaging</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Offer Title</Label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Summer Collection Sale"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 focus:ring-8 focus:ring-gold/5 transition-all outline-none text-lg font-bold"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description / Subtitle</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the offer details to attract customers..."
                  className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-base font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Discount Text Badge</Label>
                  <div className="relative group">
                    <Tag size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" />
                    <input 
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="e.g. 40% OFF"
                      className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-base font-black text-gold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Offer Category</Label>
                  <select 
                    value={formData.offerType}
                    onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
                    className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-gold/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="General">General Sale</option>
                    <option value="Bundle">Bundle Deal</option>
                    <option value="Flash">Flash Sale</option>
                    <option value="Seasonal">Seasonal Promotion</option>
                  </select>
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
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Duration & Validity</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Time Constraints</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Start Date</Label>
                <input 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-base font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">End Date</Label>
                <input 
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-base font-bold"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-10"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-inner">
                <Info size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Fine Print</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Terms & Conditions</p>
              </div>
            </div>
            <textarea 
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              placeholder="Enter offer specific terms and conditions..."
              className="w-full h-40 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-slate-300 transition-all outline-none text-base font-medium leading-relaxed resize-none"
            />
          </motion.div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Offer Banner</h3>
            </div>
            <ImageUpload 
              label="Promotional Image"
              value={formData.image}
              onChange={(val) => setFormData({ ...formData, image: val })}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 p-10 rounded-[32px] shadow-2xl space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-gold/20 transition-all duration-700" />
            
            <div className="flex items-center gap-3 text-gold relative z-10">
              <Sparkles size={20} className="animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.25em]">Ready to Launch?</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
              Ensure the banner image is high quality and the duration is correct before publishing.
            </p>
            <div className="flex items-center gap-4 pt-2 relative z-10">
              <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`} />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-widest">{formData.isActive ? 'Active' : 'Paused'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
