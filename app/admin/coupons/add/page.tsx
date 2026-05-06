"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Ticket, Percent, Banknote, Calendar, Clock, Info, Layout, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminFormInput } from "@/components/admin/form-input";
import { motion } from "framer-motion";

export default function AddCouponPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    code: "",
    discountType: "Percentage",
    value: "",
    expiryDate: "",
    minOrder: "",
    usageLimit: "",
    isActive: true,
    description: "",
    userType: "All"
  });

  const handleSave = () => {
    if (!formData.code || !formData.value || !formData.expiryDate) {
      alert("Please fill all required fields");
      return;
    }
    console.log("Saving coupon:", formData);
    router.push("/admin/coupons");
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Promo Coupon</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Promo Engine</span>
              </div>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Discount Code</span>
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
            <Save size={20} className="text-blue-400" />
            Generate Coupon
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <Ticket size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Coupon Identity</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Code and Type Configuration</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Unique Coupon Code</Label>
                <input 
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. WELCOME10"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none text-2xl font-black tracking-[0.1em] placeholder:normal-case placeholder:tracking-normal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Discount Type</Label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Discount Value</Label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      {formData.discountType === "Percentage" ? <Percent size={18} /> : <Banknote size={18} />}
                    </div>
                    <input 
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder={formData.discountType === "Percentage" ? "10" : "500"}
                      className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500/50 transition-all outline-none text-xl font-black"
                    />
                  </div>
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
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                <Layout size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Usage Rules</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Constraints and Requirements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Minimum Order Value (₹)</Label>
                <input 
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="e.g. 1000"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-emerald-500/50 transition-all outline-none text-lg font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Usage Limit (Per User)</Label>
                <input 
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="e.g. 1"
                  className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-emerald-500/50 transition-all outline-none text-lg font-bold"
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
                <h2 className="text-xl font-black text-slate-900">Additional Info</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Internal or External Notes</p>
              </div>
            </div>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this coupon for? (e.g. First time customer offer)"
              className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-slate-300 transition-all outline-none text-base font-medium leading-relaxed resize-none"
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
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Validity</h3>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expiry Date</Label>
              <input 
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-purple-500/50 transition-all outline-none text-sm font-bold"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200/60 space-y-8"
          >
            <div className="flex items-center gap-4 pb-2 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <UserCheck size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Target Audience</h3>
            </div>
            <select 
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-orange-500/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="All">All Customers</option>
              <option value="New">First-time Users Only</option>
              <option value="VIP">VIP / Repeat Customers</option>
              <option value="Special">Special Segment</option>
            </select>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 p-10 rounded-[32px] shadow-2xl space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />
            
            <div className="flex items-center gap-3 text-blue-400 relative z-10">
              <Sparkles size={20} className="animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.25em]">Ready to Save?</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
              Double check the <span className="text-white font-bold">Discount Value</span> and <span className="text-white font-bold">Code</span> before confirming.
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
