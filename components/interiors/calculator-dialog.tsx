"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, Download, CheckCircle2, ChevronRight,
  Home, LayoutGrid, Armchair, Layers,
  Paintbrush, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculatorService, type CalculatorItem, type BrandOption, type CalculatorData, inquiryService } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { toast } from "sonner";

/* ─── Schema ─────────────────────────────────────────────────────────────────── */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  city: z.string().min(2, "City is required"),
});

type CF = z.infer<typeof schema>;

const ToggleSwitch = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-12 h-6 rounded-full relative transition-colors flex items-center px-1 ${on ? "bg-slate-900" : "bg-slate-200"}`}
  >
    <div
      className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${on ? "translate-x-6" : "translate-x-0"}`}
    />
  </button>
);

/* ─── Components ─── */
const BrandSelection = ({ brands, selBrand, setSelBrand }: { brands: BrandOption[]; selBrand: string; setSelBrand: (id: string) => void }) => (
  <div className="space-y-8">
    <label className="text-xs font-semibold text-slate-400 flex items-center gap-6">
      Brand level <div className="h-px bg-slate-100 flex-1" />
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {brands.map((opt) => {
        const active = selBrand === opt._id;
        return (
          <button
            key={opt._id}
            onClick={() => setSelBrand(opt._id)}
            className={`p-6 rounded-3xl border transition-all space-y-6 text-left ${active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"
              }`}
          >
            <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-50">
              <img src={opt.image ? buildImageUrl(opt.image) : ""} alt={opt.name} className="w-full h-full object-cover" />
              {active && (
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                  <CheckCircle2 className="text-slate-900" size={32} />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold block text-slate-900">{opt.name}</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {opt.multiplier === 1 ? "Standard Pricing" : `${Math.round((opt.multiplier - 1) * 100)}% Premium`}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const FinalEstimateForm = ({ register, handleSubmit, onSubmit, errors, back, isSubmitting }: any) => (
  <div className="space-y-10">
    <div className="space-y-2 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto border-2 border-slate-900 mb-8">
        <Calculator size={32} className="text-slate-900" />
      </div>
      <h3 className="text-3xl font-bold text-slate-900">Your Estimate is Ready</h3>
      <p className="text-slate-500">Fill in your details to receive the detailed proposal and lock in this pricing.</p>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 rounded-3xl border border-slate-100 bg-white shadow-xl">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400">Full name</label>
          <Input {...register("name")} placeholder="Your name" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.name ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.name && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.name.message}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400">Email address</label>
          <Input {...register("email")} placeholder="you@email.com" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.email ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.email && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.email.message}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400">Phone number</label>
          <Input {...register("phone")} placeholder="+91 00000 00000" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.phone ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.phone && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.phone.message}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400">City</label>
          <Input {...register("city")} placeholder="Your city" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.city ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.city && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.city.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-12 pb-8">
        <Button type="button" variant="outline" onClick={back} disabled={isSubmitting} className="px-10 py-8 rounded-2xl font-bold uppercase tracking-widest border-slate-200">Back</Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-widest shadow-xl">
          {isSubmitting ? "Submitting..." : "Submit & Get Detailed Quote"}
        </Button>
      </div>
    </form>
  </div>
);

const ItemCard = ({
  item,
  isSelected,
  onToggle,
  onUpdateQty,
  qty
}: {
  item: any;
  isSelected: boolean;
  onToggle: () => void;
  onUpdateQty: (d: number | string) => void;
  qty: number;
}) => (
  <div className={`rounded-xl border transition-all flex flex-col ${isSelected ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-100 bg-white"}`}>
    <div className="p-5 space-y-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">{item.name}</h4>
        </div>
        <ToggleSwitch on={isSelected} onClick={onToggle} />
      </div>
    </div>

    {isSelected && (
      <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-xl flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">
          Enter sq.ft / units
        </span>
        <div className="flex items-center gap-3">
          <div className="relative w-24">
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => onUpdateQty(e.target.value)}
              className="w-full h-8 bg-white border border-slate-200 rounded-md px-2 text-sm font-bold focus:outline-none focus:border-slate-900 text-center"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    )}
  </div>
);

export function CalculatorDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState<"services" | "interior" | "homes" | null>(null);

  const [data, setData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(false);

  // Selection States
  const [reqType, setReqType] = useState<"full_home" | "specific_area">("full_home");
  const [selBHK, setSelBHK] = useState<string | null>(null);
  const [carpetArea, setCarpetArea] = useState("");
  const [selFurniture, setSelFurniture] = useState<string[]>([]);
  const [selFurnOpts, setSelFurnOpts] = useState<{ id: string; qty: number }[]>([]);
  const [selDetailed, setSelDetailed] = useState<{ id: string; qty: number }[]>([]);
  const [selBasic, setSelBasic] = useState<{ id: string; qty: number }[]>([]);
  const [selServices, setSelServices] = useState<{ id: string; qty: number }[]>([]);
  const [selBrand, setSelBrand] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<CF>({
    resolver: zodResolver(schema),
  });

  const fetchData = async (type: string) => {
    setLoading(true);
    try {
      const res = await calculatorService.getCalculatorData(type);
      setData(res);
      if (res.bhkOptions.length > 0 && !selBHK) setSelBHK(res.bhkOptions[0]._id);
      if (res.brandOptions.length > 0 && !selBrand) setSelBrand(res.brandOptions[0]._id);
    } catch (err) {
      console.error("Failed to fetch calculator data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onOpenCalculator = (event: Event) => {
      const customEvent = event as CustomEvent<{ type?: "services" | "interior" | "homes" }>;
      const type = customEvent.detail?.type;
      if (!type) return;
      setServiceType(type);
      resetAll();
      setIsOpen(true);
      fetchData(type);
    };

    window.addEventListener("open-calculator", onOpenCalculator);
    return () => window.removeEventListener("open-calculator", onOpenCalculator);
  }, []);

  // Handle scope change - reset selBHK to first available option
  useEffect(() => {
    if (!data) return;
    if (reqType === "full_home") {
      if (data.bhkOptions.length > 0) setSelBHK(data.bhkOptions[0]._id);
    } else {
      if (data.roomOptions.length > 0) setSelBHK(data.roomOptions[0]._id);
    }
  }, [reqType, data]);

  /* Estimate Calculation */
  useEffect(() => {
    if (!data) return;
    let total = 0;
    if (serviceType === "homes") {
      selFurnOpts.forEach(o => {
        const item = data.furnitureItems.find(i => i._id === o.id) ||
          data.furnitureItems.flatMap(i => i.options || []).find((opt: any) => opt._id === o.id);
        if (item) total += (item as any).price * o.qty;
      });
    } else if (serviceType === "interior" || serviceType === "services") {
      if (reqType === "full_home") {
        const b = data.bhkOptions.find(b => b._id === selBHK);
        if (b) total += b.price;
      } else {
        const r = data.roomOptions.find(r => r._id === selBHK);
        if (r) total += r.price;
      }

      if (serviceType === "interior") {
        selDetailed.forEach(d => {
          const item = Object.values(data.detailedFurniture).flat().find(f => f._id === d.id);
          if (item) total += item.price * d.qty;
        });
        selBasic.forEach(b => {
          const r = data.basicRequirements.find(r => r._id === b.id);
          if (r) total += r.price * b.qty;
        });
        total += (parseInt(carpetArea) || 0) * 100;
      } else {
        // serviceType === "services"
        selServices.forEach(s => {
          const g = data.generalServices.find(item => item._id === s.id);
          if (g) total += g.price * s.qty;
        });
      }
    }
    const brand = data.brandOptions.find(b => b._id === selBrand);
    const mult = brand?.multiplier || 1;
    setEstimate(total * mult);
  }, [selBHK, selFurnOpts, selDetailed, selBasic, carpetArea, serviceType, selServices, selBrand, reqType, data]);

  const resetAll = () => {
    setStep(1);
    setEstimate(0);
    setSubmitted(false);
    setReqType("full_home");
    setCarpetArea("");
    setSelFurniture([]);
    setSelFurnOpts([]);
    setSelDetailed([]);
    setSelBasic([]);
    setSelServices([]);
    resetForm();
  };

  /* handlers */
  const toggleSvc = (id: string) => setSelServices(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateSvcQty = (id: string, d: number | string) => setSelServices(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, typeof d === "string" ? (parseInt(d) || 0) : d) } : x));

  const toggleFurn = (id: string) => {
    setSelFurniture(prev => {
      if (prev.includes(id)) {
        const f = data?.furnitureItems.find(f => f._id === id);
        if (f) {
          const ids = f.options?.map((o: any) => o._id) || [id];
          setSelFurnOpts(o => o.filter(x => !ids.includes(x.id)));
        }
        return prev.filter(f => f !== id);
      }
      const f = data?.furnitureItems.find(f => f._id === id);
      if (f && !f.options) setSelFurnOpts(o => [...o, { id, qty: 1 }]);
      return [...prev, id];
    });
  };
  const toggleFurnOpt = (id: string) => setSelFurnOpts(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateFurnQty = (id: string, d: number | string) => setSelFurnOpts(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, typeof d === "string" ? (parseInt(d) || 0) : d) } : x));

  const toggleDet = (id: string) => setSelDetailed(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateDetQty = (id: string, d: number | string) => setSelDetailed(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, typeof d === "string" ? (parseInt(d) || 0) : d) } : x));

  const toggleBasic = (id: string) => setSelBasic(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateBasicQty = (id: string, d: number | string) => setSelBasic(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, typeof d === "string" ? (parseInt(d) || 0) : d) } : x));

  const next = () => {
    setStep(p => Math.min(p + 1, 4));
  };
  const back = () => setStep(p => Math.max(p - 1, 1));
  
  const onSubmit = async (formData: CF) => {
     setIsSubmitting(true);
     try {
       const selectedItems = serviceType === "homes" 
         ? selFurnOpts.map(o => ({
             id: o.id,
             qty: o.qty,
             name: data?.furnitureItems.find(i => i._id === o.id)?.name || 
                   data?.furnitureItems.flatMap(i => i.options || []).find((opt: any) => opt._id === o.id)?.name || 
                   'Unknown Item'
           }))
         : serviceType === "interior" 
           ? [
               ...selDetailed.map(o => ({
                 id: o.id,
                 qty: o.qty,
                 name: Object.values(data?.detailedFurniture || {}).flat().find(f => f._id === o.id)?.name || 'Unknown Item'
               })),
               ...selBasic.map(o => ({
                 id: o.id,
                 qty: o.qty,
                 name: data?.basicRequirements.find(r => r._id === o.id)?.name || 'Unknown Item'
               }))
             ] 
           : selServices.map(o => ({
               id: o.id,
               qty: o.qty,
               name: data?.generalServices.find(item => item._id === o.id)?.name || 'Unknown Item'
             }));

       const inquiryData = {
         ...formData,
         service: serviceType === "homes" ? "Full Home Interior" : serviceType === "interior" ? "Interior Design" : "Home Services",
         estimateDetails: {
           estimate,
           brand: data?.brandOptions.find(b => b._id === selBrand)?.name,
           reqType,
           selBHK: data?.bhkOptions.find(b => b._id === selBHK)?.name || data?.roomOptions.find(b => b._id === selBHK)?.name,
           items: selectedItems,
           carpetArea
         }
       };

      const result = await inquiryService.submitInquiry(inquiryData);
      if (result) {
        setSubmitted(true);
        toast.success("Inquiry submitted successfully!");
      } else {
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    const txt = `BANAYA — QUOTE\n${"─".repeat(30)}\nService: ${serviceType}\nEstimate: ₹${Math.round(estimate).toLocaleString()}\nBrand: ${data?.brandOptions.find(b => b._id === selBrand)?.name}\n\nContact: hello@banaya.com`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })),
      download: `Banaya_Quote_${Date.now()}.txt`
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getSteps = () => {
    return [
      { s: 1, n: "Scope" },
      { s: 2, n: "Services" },
      { s: 3, n: "Quality" },
      { s: 4, n: "Estimate" }
    ];
  };

  const progSteps = getSteps();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[98vw] max-w-[98vw] sm:w-[95vw] sm:max-w-[95vw] lg:max-w-[1400px] h-[96vh] max-h-[96vh] flex flex-col p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2rem]">
        <DialogHeader className="p-6 md:p-8 border-b border-slate-50 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                {serviceType === "services" ? "Services" : serviceType === "interior" ? "Interior" : "Homes"} Calculator
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">Fill in the details to get your estimate</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {serviceType === "services" ? selServices.length
                  : serviceType === "homes" ? selFurnOpts.length
                    : (selDetailed.length + selBasic.length)} Items Selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 overflow-x-auto pb-2 no-scrollbar">
            {progSteps.map((item, idx) => (
              <div key={item.s} className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => item.s < step && setStep(item.s)}
                  disabled={item.s > step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === item.s
                    ? "bg-slate-900 text-white ring-4 ring-slate-100"
                    : step > item.s
                      ? "bg-slate-100 text-slate-900"
                      : "bg-white text-slate-300 border border-slate-100"
                    }`}
                >
                  {step > item.s ? <CheckCircle2 size={16} /> : item.s}
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= item.s ? "text-slate-900" : "text-slate-300"}`}>
                  {item.n}
                </span>
                {idx < progSteps.length - 1 && <div className={`w-12 h-px ${step > item.s ? "bg-slate-900" : "bg-slate-100"}`} />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
          <div className="flex flex-col lg:flex-row gap-12 items-start pb-20">
            <div className="flex-1 w-full min-w-0">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {serviceType === "homes" ? "Select project scope" : "Project scope"}
                        </h3>
                        <p className="text-slate-500">
                          Let's start with the basics of your project.
                        </p>
                      </div>

                      {serviceType === "homes" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {data?.furnitureItems.map((item) => {
                            const active = selFurniture.includes(item._id);
                            return (
                              <button
                                key={item._id}
                                onClick={() => toggleFurn(item._id)}
                                className={`p-4 rounded-2xl border transition-all text-center space-y-4 ${active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-100 bg-white"
                                  }`}
                              >
                                <div className="aspect-square rounded-xl overflow-hidden relative bg-slate-50">
                                  <img src={item.image ? buildImageUrl(item.image) : ""} alt={item.name} className="w-full h-full object-cover" />
                                  {active && (
                                    <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                      <CheckCircle2 className="text-slate-900" size={24} />
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-600">{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (serviceType === "services" || serviceType === "interior") ? (
                        <div className="space-y-10">
                          <div className="flex p-1.5 bg-slate-50 rounded-2xl w-fit">
                            {["full_home", "specific_area"].map((rt) => (
                              <button
                                key={rt}
                                onClick={() => setReqType(rt as any)}
                                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${reqType === rt ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100" : "text-slate-400"
                                  }`}
                              >
                                {rt === "full_home" ? "Full Home" : "Specific Area"}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                              {reqType === "full_home" ? "Select BHK Configuration" : "Select Areas / Rooms"}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {reqType === "full_home" ? (
                                data?.bhkOptions.map((opt) => {
                                  const active = selBHK === opt._id;
                                  return (
                                    <button
                                      key={opt._id}
                                      onClick={() => setSelBHK(opt._id)}
                                      className={`p-4 rounded-2xl border transition-all text-center space-y-4 ${active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-lg" : "border-slate-100 bg-white"
                                        }`}
                                    >
                                      <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-50">
                                        <img src={opt.image ? buildImageUrl(opt.image) : ""} alt={opt.name} className="w-full h-full object-cover" />
                                        {active && (
                                          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                            <CheckCircle2 className="text-slate-900" size={20} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-600">{opt.name}</span>
                                    </button>
                                  );
                                })
                              ) : (
                                data?.roomOptions.map((opt) => {
                                  const active = selBHK === opt._id;
                                  return (
                                    <button
                                      key={opt._id}
                                      onClick={() => setSelBHK(opt._id)}
                                      className={`p-4 rounded-2xl border transition-all text-center space-y-4 ${active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-lg" : "border-slate-100 bg-white"
                                        }`}
                                    >
                                      <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-50">
                                        <img src={opt.image ? buildImageUrl(opt.image) : ""} alt={opt.name} className="w-full h-full object-cover" />
                                        {active && (
                                          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                            <CheckCircle2 className="text-slate-900" size={20} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-600">{opt.name}</span>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Carpet Area (Square Feet)</label>
                            <div className="relative max-w-xs">
                              <Input
                                type="number"
                                value={carpetArea}
                                onChange={(e) => setCarpetArea(e.target.value)}
                                placeholder="e.g. 1200"
                                className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                              />
                              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SQ FT</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-10">
                          {/* Fallback or other types */}
                        </div>
                      )}

                      <div className="flex gap-4 pt-12 pb-8">
                        <Button onClick={next} className="w-full bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all">
                          Next Step <ChevronRight size={18} className="ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {serviceType === "services" ? "Select Services" : (serviceType === "homes" ? "Refine items" : "Detailed Selection")}
                        </h3>
                        <p className="text-slate-500">
                          {serviceType === "services" ? "Choose the specific services you need for your project." : "Refine your selection and adjust quantities."}
                        </p>
                      </div>

                      {serviceType === "services" ? (
                        <div className="space-y-16">
                          {data && Object.entries(data.detailedFurniture)
                            .filter(([area]) => {
                              if (serviceType === "services") return true;
                              if (reqType === "full_home") return true;
                              const selectedRoom = data.roomOptions.find(r => r._id === selBHK);
                              return area === selectedRoom?.name;
                            })
                            .map(([area, items]) => (
                              <div key={area} className="space-y-8">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                  {area} <div className="h-px bg-slate-100 flex-1" />
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {(items as any[]).map((item) => {
                                    const sel = selServices.find(s => s.id === item._id);
                                    return (
                                      <ItemCard
                                        key={item._id}
                                        item={item}
                                        isSelected={!!sel}
                                        onToggle={() => toggleSvc(item._id)}
                                        onUpdateQty={(d) => updateSvcQty(item._id, d)}
                                        qty={sel?.qty || 1}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="space-y-16">
                          {serviceType === "homes" && selFurniture.map((furnId) => {
                            const furn = data?.furnitureItems.find(f => f._id === furnId);
                            if (!furn) return null;
                            return (
                              <div key={furnId} className="space-y-8">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                  {furn.name} <div className="h-px bg-slate-100 flex-1" />
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {furn.options ? (furn.options as any[]).map((opt) => {
                                    const sel = selFurnOpts.find(o => o.id === opt._id);
                                    return (
                                      <ItemCard
                                        key={opt._id}
                                        item={opt}
                                        isSelected={!!sel}
                                        onToggle={() => toggleFurnOpt(opt._id)}
                                        onUpdateQty={(d) => updateFurnQty(opt._id, d)}
                                        qty={sel?.qty || 1}
                                      />
                                    );
                                  }) : (
                                    <ItemCard
                                      item={furn}
                                      isSelected={true}
                                      onToggle={() => { }}
                                      onUpdateQty={(d) => updateFurnQty(furn._id, d)}
                                      qty={selFurnOpts.find(o => o.id === furn._id)?.qty || 1}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {serviceType === "interior" && data && Object.entries(data.detailedFurniture)
                            .filter(([area]) => {
                              if (reqType === "full_home") return true;
                              const selectedRoom = data.roomOptions.find(r => r._id === selBHK);
                              return area === selectedRoom?.name;
                            })
                            .map(([area, items]) => (
                              <div key={area} className="space-y-8">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                  {area} <div className="h-px bg-slate-100 flex-1" />
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {(items as any[]).map((item) => {
                                    const sel = selDetailed.find(f => f.id === item._id);
                                    return (
                                      <ItemCard
                                        key={item._id}
                                        item={item}
                                        isSelected={!!sel}
                                        onToggle={() => toggleDet(item._id)}
                                        onUpdateQty={(d) => updateDetQty(item._id, d)}
                                        qty={sel?.qty || 1}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      <div className="flex gap-4 pt-12 pb-8">
                        <Button variant="outline" onClick={back} className="px-10 py-8 rounded-2xl font-bold uppercase tracking-widest border-slate-200">Back</Button>
                        <Button onClick={next} className="flex-1 bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl">
                          {serviceType === "services" ? "Final Estimate" : "Next Step"} <ChevronRight size={18} className="ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Quality Level</h3>
                        <p className="text-slate-500">Select the material quality level for your project.</p>
                      </div>
                      <BrandSelection brands={data?.brandOptions || []} selBrand={selBrand || ""} setSelBrand={setSelBrand} />
                      <div className="flex gap-4 pt-12 pb-8">
                        <Button variant="outline" onClick={back} className="px-10 py-8 rounded-2xl font-bold uppercase tracking-widest border-slate-200">Back</Button>
                        <Button onClick={next} className="flex-1 bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl">
                          Final Estimate <ChevronRight size={18} className="ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <FinalEstimateForm
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        errors={errors}
                        back={back}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            <div className="w-full lg:w-[400px] lg:sticky lg:top-0 shrink-0">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="space-y-10 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-6">
                      Estimated Investment
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-slate-400">₹</span>
                      <motion.span
                        key={estimate}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-bold tracking-tight"
                      >
                        {Math.round(estimate).toLocaleString()}
                      </motion.span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-6 leading-relaxed">
                      *Final quote may vary based on site conditions and material choice.
                    </p>
                  </div>

                  <div className="h-px bg-slate-800" />

                  <div className="space-y-6">
                    {[
                      { icon: Layers, k: "Service", v: serviceType || "—" },
                      { icon: Home, k: "Scope", v: reqType === "full_home" ? "Full Home" : "Specific Area" },
                      {
                        icon: Armchair, k: "Items",
                        v: serviceType === "services" ? `${selServices.reduce((s, i) => s + i.qty, 0)} Units`
                          : serviceType === "homes" ? `${selFurnOpts.reduce((s, i) => s + i.qty, 0)} Units`
                            : (data?.bhkOptions.find(b => b._id === selBHK)?.name ||
                              data?.roomOptions.find(r => r._id === selBHK)?.name || "—")
                      },
                      { icon: Layers, k: "Brand", v: data?.brandOptions.find(b => b._id === selBrand)?.name || "—" },
                    ].map((row) => (
                      <div key={row.k} className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                          <row.icon size={16} />
                          {row.k}
                        </div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{row.v}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 py-8 rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all"
                  >
                    <Download size={20} /> Download PDF
                  </Button>
                </div>
                <div className="absolute -bottom-16 -right-16 text-white/5 text-[200px] font-bold italic pointer-events-none select-none">
                  B
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[110] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[3rem] p-10 md:p-16 max-w-xl w-full text-center space-y-10 shadow-2xl mx-4"
              >
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto border-2 border-slate-900">
                  <CheckCircle2 size={48} className="text-slate-900" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Request Received!</h2>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                    Thank you for your interest. Our design consultant will reach out to you within 24 hours to discuss your project in detail.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setIsOpen(false);
                    resetAll();
                  }}
                  className="w-full bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-colors"
                >
                  Back to Website
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
