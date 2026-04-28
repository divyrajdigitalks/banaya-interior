"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, Download, CheckCircle2, ChevronRight, Plus, Minus,
  Home, LayoutGrid, Armchair, Layers, Building, Building2, Hotel,
  Sofa, Utensils, Bed, Baby, Coffee, Columns2, PanelLeft, Lamp,
  Frame, Square, Paintbrush, Zap, Wind, X
} from "lucide-react";
import {
  BHK_OPTIONS, FURNITURE_ITEMS, GENERAL_SERVICES,
  BRAND_OPTIONS, DETAILED_FURNITURE, BASIC_REQUIREMENTS
} from "@/lib/data/calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Schema ─────────────────────────────────────────────────────────────────── */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  city: z.string().min(2, "City is required"),
});

type CF = z.infer<typeof schema>;

const QtyBtn = ({ onClick, icon: Icon }: { onClick: () => void; icon: any }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-8 h-8 rounded-md border border-slate-200 text-slate-400 flex items-center justify-center hover:border-slate-400 hover:text-slate-600 transition-all bg-white"
  >
    <Icon size={12} />
  </button>
);

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

/* ─── Card Component ─── */
const BrandSelection = ({ selBrand, setSelBrand }: { selBrand: string; setSelBrand: (id: string) => void }) => (
  <div className="space-y-8">
    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
      Brand Level <div className="h-px bg-slate-100 flex-1" />
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {BRAND_OPTIONS.map((opt) => {
        const active = selBrand === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setSelBrand(opt.id)}
            className={`p-6 rounded-3xl border transition-all space-y-6 text-left ${
              active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"
            }`}
          >
            <div className="aspect-video rounded-2xl overflow-hidden relative bg-slate-50">
              <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
              {active && (
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                  <CheckCircle2 className="text-slate-900" size={32} />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-900">{opt.name}</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {opt.multiplier === 1 ? "Standard Pricing" : `${Math.round((opt.multiplier - 1) * 100)}% Premium`}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const FinalEstimateForm = ({ register, handleSubmit, onSubmit, errors, back, estimate }: any) => (
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
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Full Name</label>
          <Input {...register("name")} placeholder="Your name" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.name ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.name && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.name.message}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Email Address</label>
          <Input {...register("email")} placeholder="you@email.com" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.email ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.email && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.email.message}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Phone Number</label>
          <Input {...register("phone")} placeholder="+91 00000 00000" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.phone ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.phone && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.phone.message}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">City</label>
          <Input {...register("city")} placeholder="Your city" className={`h-14 px-6 rounded-2xl bg-slate-50/50 border-none font-bold ${errors.city ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-slate-900"}`} />
          {errors.city && <p className="text-[10px] text-red-500 font-bold tracking-widest">{errors.city.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-12 pb-8">
        <Button type="button" variant="outline" onClick={back} className="px-10 py-8 rounded-2xl font-bold uppercase tracking-widest border-slate-200">Back</Button>
        <Button type="submit" className="flex-1 bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl">Submit & Get Detailed Quote</Button>
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
          <p className="text-sm font-bold text-slate-600">₹{item.price.toLocaleString()}{item.unit === "sqft" ? "/sqft" : ""}</p>
        </div>
        <ToggleSwitch on={isSelected} onClick={onToggle} />
      </div>
    </div>
    
    {isSelected && (
      <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-xl flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
          {item.unit === "sqft" ? "Square Ft" : "Quantity"}
        </span>
        <div className="flex items-center gap-3">
          {item.unit === "sqft" ? (
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
          ) : (
            <>
              <QtyBtn onClick={() => onUpdateQty(qty - 1)} icon={Minus} />
              <span className="font-bold w-6 text-center text-sm">{qty}</span>
              <QtyBtn onClick={() => onUpdateQty(qty + 1)} icon={Plus} />
            </>
          )}
        </div>
      </div>
    )}
  </div>
);

export function CalculatorSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [serviceType, setServiceType] = useState<"services" | "interior" | "homes" | null>(null);
  
  // Selection States
  const [reqType, setReqType] = useState<"full_home" | "specific_area">("full_home");
  const [selBHK, setSelBHK] = useState(BHK_OPTIONS[1].id);
  const [carpetArea, setCarpetArea] = useState("");
  const [selFurniture, setSelFurniture] = useState<string[]>([]);
  const [selFurnOpts, setSelFurnOpts] = useState<{ id: string; qty: number }[]>([]);
  const [selDetailed, setSelDetailed] = useState<{ id: string; qty: number }[]>([]);
  const [selBasic, setSelBasic] = useState<{ id: string; qty: number }[]>([]);
  const [selServices, setSelServices] = useState<{ id: string; qty: number }[]>([]);
  const [selBrand, setSelBrand] = useState(BRAND_OPTIONS[0].id);

  const serviceCards = [
    { id: "services", title: "Services", sub: "Paint · Electrical · AC", desc: ["Wall Paint", "Ceiling Work", "Electrical", "AC Piping"], icon: Paintbrush },
    { id: "interior", title: "Interior", sub: "Kitchen · Wardrobes · Units", desc: ["Modular Kitchen", "Wardrobes", "TV Units", "Study Tables"], icon: LayoutGrid },
    { id: "homes", title: "Homes", sub: "Full Home · Renovation", desc: ["Full Home Interiors", "Renovations", "New Home Setup"], icon: Home },
  ];

  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<CF>({
    resolver: zodResolver(schema),
  });

  /* Estimate Calculation */
  useEffect(() => {
    let total = 0;
    if (serviceType === "homes") {
      selFurnOpts.forEach(o => {
        FURNITURE_ITEMS.forEach(item => {
          if (item.options) {
            const f = item.options.find(x => x.id === o.id);
            if (f) total += f.price * o.qty;
          } else if (item.id === o.id) {
            total += (item.price || 0) * o.qty;
          }
        });
      });
    } else if (serviceType === "interior") {
      if (reqType === "full_home") {
        const b = BHK_OPTIONS.find(b => b.id === selBHK);
        if (b) total += b.price;
      }
      selDetailed.forEach(d => {
        Object.values(DETAILED_FURNITURE).flat().forEach((f: any) => {
          if (f.id === d.id) total += f.price * d.qty;
        });
      });
      selBasic.forEach(b => {
        const r = BASIC_REQUIREMENTS.find(r => r.id === b.id);
        if (r) total += r.price * b.qty;
      });
      total += (parseInt(carpetArea) || 0) * 100;
    } else if (serviceType === "services") {
      selServices.forEach(s => {
        const g = GENERAL_SERVICES.find(item => item.id === s.id);
        if (g) total += g.price * s.qty;
      });
    }
    const mult = BRAND_OPTIONS.find(b => b.id === selBrand)?.multiplier || 1;
    setEstimate(total * mult);
  }, [selBHK, selFurnOpts, selDetailed, selBasic, carpetArea, serviceType, selServices, selBrand, reqType]);

  const resetAll = () => {
    setStep(1);
    setEstimate(0);
    setSubmitted(false);
    setReqType("full_home");
    setSelBHK(BHK_OPTIONS[1].id);
    setCarpetArea("");
    setSelFurniture([]);
    setSelFurnOpts([]);
    setSelDetailed([]);
    setSelBasic([]);
    setSelServices([]);
    setSelBrand(BRAND_OPTIONS[0].id);
    resetForm();
  };

  const handleOpen = (type: "services" | "interior" | "homes") => {
    setServiceType(type);
    resetAll();
    // If services, we can skip BHK if we want, but let's keep it consistent
    // or better, let's make it smarter.
    setIsOpen(true);
  };

  /* handlers */
  const toggleSvc = (id: string) => setSelServices(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateSvcQty = (id: string, d: number | string) => setSelServices(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, typeof d === "string" ? (parseInt(d) || 0) : d) } : x));

  const toggleFurn = (id: string) => {
    setSelFurniture(prev => {
      if (prev.includes(id)) {
        const f = FURNITURE_ITEMS.find(f => f.id === id);
        if (f) {
          const ids = f.options?.map(o => o.id) || [id];
          setSelFurnOpts(o => o.filter(x => !ids.includes(x.id)));
        }
        return prev.filter(f => f !== id);
      }
      const f = FURNITURE_ITEMS.find(f => f.id === id);
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
    const max = serviceType === "homes" ? 5 : (serviceType === "services" ? 3 : 4);
    setStep(p => Math.min(p + 1, max));
  };
  const back = () => setStep(p => Math.max(p - 1, 1));
  const onSubmit = () => setSubmitted(true);

  const handleDownload = () => {
    const txt = `BANAYA — QUOTE\n${"─".repeat(30)}\nService: ${serviceType}\nEstimate: ₹${Math.round(estimate).toLocaleString()}\nBrand: ${BRAND_OPTIONS.find(b => b.id === selBrand)?.name}\n\nContact: hello@banaya.com`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })),
      download: `Banaya_Quote_${Date.now()}.txt`
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getSteps = () => {
    if (serviceType === "services") return [
      { s: 1, n: "Services" },
      { s: 2, n: "Quality" },
      { s: 3, n: "Estimate" }
    ];
    if (serviceType === "homes") return [
      { s: 1, n: "Scope" },
      { s: 2, n: "Refine" },
      { s: 3, n: "Detailed" },
      { s: 4, n: "Quality" },
      { s: 5, n: "Estimate" }
    ];
    return [
      { s: 1, n: "Scope" },
      { s: 2, n: "Detailed" },
      { s: 3, n: "Quality" },
      { s: 4, n: "Estimate" }
    ];
  };

  const progSteps = getSteps();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-8xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Cost Calculator</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Get an instant estimate for your interior and decor projects. Choose a service below to start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceCards.map((opt) => (
            <div
              key={opt.id}
              className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-slate-900 hover:shadow-2xl transition-all flex flex-col gap-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <opt.icon size={28} className="text-slate-900 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{opt.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{opt.sub}</p>
              </div>
              <ul className="space-y-4 flex-1">
                {opt.desc.map((d, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors" />
                    {d}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleOpen(opt.id as any)}
                className="w-full bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white py-6 rounded-2xl font-bold uppercase tracking-widest transition-all shadow-sm"
              >
                Calculate Now
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-7xl h-[95vh] md:h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
            <DialogHeader className="p-6 md:p-8 border-b border-slate-50 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    {serviceCards.find(c => c.id === serviceType)?.title} Calculator
                  </DialogTitle>
                  <p className="text-sm text-slate-500 mt-1">Fill in the details to get your estimate</p>
                </div>
                {/* Selection Counter Badge */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    {serviceType === "services" ? selServices.length 
                      : serviceType === "homes" ? selFurnOpts.length 
                      : (selDetailed.length + selBasic.length)} Items Selected
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-4 mt-8 overflow-x-auto pb-2 no-scrollbar">
                {progSteps.map((item, idx) => (
                  <div key={item.s} className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => item.s < step && setStep(item.s)}
                      disabled={item.s > step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === item.s
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

            <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
              <div className="flex flex-col lg:flex-row gap-12 items-start pb-20">
                {/* Multi-step Form Content */}
                <div className="flex-1 w-full min-w-0">
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
                            {serviceType === "homes" ? "Select project scope" : (serviceType === "services" ? "Select services" : "Project scope")}
                          </h3>
                          <p className="text-slate-500">
                            {serviceType === "services" ? "Select the services you need for your project." : "Let's start with the basics of your project."}
                          </p>
                        </div>

                        {serviceType === "homes" ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {FURNITURE_ITEMS.map((item) => {
                              const active = selFurniture.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggleFurn(item.id)}
                                  className={`p-4 rounded-2xl border transition-all text-center space-y-4 ${
                                    active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-100 bg-white"
                                  }`}
                                >
                                  <div className="aspect-square rounded-xl overflow-hidden relative bg-slate-50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                        ) : serviceType === "services" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {GENERAL_SERVICES.map((opt) => {
                              const sel = selServices.find(s => s.id === opt.id);
                              return (
                                <ItemCard 
                                  key={opt.id}
                                  item={opt}
                                  isSelected={!!sel}
                                  onToggle={() => toggleSvc(opt.id)}
                                  onUpdateQty={(d) => updateSvcQty(opt.id, d)}
                                  qty={sel?.qty || 1}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-10">
                            <div className="flex p-1.5 bg-slate-50 rounded-2xl w-fit">
                              {["full_home", "specific_area"].map((rt) => (
                                <button
                                  key={rt}
                                  onClick={() => setReqType(rt as any)}
                                  className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    reqType === rt ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100" : "text-slate-400"
                                  }`}
                                >
                                  {rt === "full_home" ? "Full Home" : "Specific Area"}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-6">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Select BHK Configuration</label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {BHK_OPTIONS.map((opt) => {
                                  const active = selBHK === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      onClick={() => setSelBHK(opt.id)}
                                      className={`p-4 rounded-2xl border transition-all text-center space-y-4 ${
                                        active ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-lg" : "border-slate-100 bg-white"
                                      }`}
                                    >
                                      <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-50">
                                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                                        {active && (
                                          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                            <CheckCircle2 className="text-slate-900" size={20} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-600">{opt.name}</span>
                                    </button>
                                  );
                                })}
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
                            {serviceType === "services" ? "Quality Level" : (serviceType === "homes" ? "Refine items" : "Detailed Selection")}
                          </h3>
                          <p className="text-slate-500">
                            {serviceType === "services" ? "Select the material quality level for your project." : "Refine your selection and adjust quantities."}
                          </p>
                        </div>

                        {serviceType === "services" ? (
                          <BrandSelection selBrand={selBrand} setSelBrand={setSelBrand} />
                        ) : (
                          <div className="space-y-16">
                            {serviceType === "homes" && selFurniture.map((furnId) => {
                              const furn = FURNITURE_ITEMS.find(f => f.id === furnId);
                              if (!furn) return null;
                              return (
                                <div key={furnId} className="space-y-8">
                                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                    {furn.name} <div className="h-px bg-slate-100 flex-1" />
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {furn.options ? furn.options.map((opt) => {
                                      const sel = selFurnOpts.find(o => o.id === opt.id);
                                      return (
                                        <ItemCard 
                                          key={opt.id}
                                          item={opt}
                                          isSelected={!!sel}
                                          onToggle={() => toggleFurnOpt(opt.id)}
                                          onUpdateQty={(d) => updateFurnQty(opt.id, d)}
                                          qty={sel?.qty || 1}
                                        />
                                      );
                                    }) : (
                                      <ItemCard 
                                        item={furn}
                                        isSelected={true}
                                        onToggle={() => {}}
                                        onUpdateQty={(d) => updateFurnQty(furn.id, d)}
                                        qty={selFurnOpts.find(o => o.id === furn.id)?.qty || 1}
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {serviceType === "interior" && Object.entries(DETAILED_FURNITURE).map(([area, items]) => (
                              <div key={area} className="space-y-8">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                  {area} <div className="h-px bg-slate-100 flex-1" />
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {(items as any[]).map((item) => {
                                    const sel = selDetailed.find(f => f.id === item.id);
                                    return (
                                      <ItemCard 
                                        key={item.id}
                                        item={item}
                                        isSelected={!!sel}
                                        onToggle={() => toggleDet(item.id)}
                                        onUpdateQty={(d) => updateDetQty(item.id, d)}
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
                        {serviceType === "services" ? (
                          <FinalEstimateForm 
                            register={register} 
                            handleSubmit={handleSubmit} 
                            onSubmit={onSubmit} 
                            errors={errors} 
                            back={back} 
                            estimate={estimate} 
                          />
                        ) : (
                          <>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900">
                                {serviceType === "homes" ? "Detailed Selection" : "Quality Level"}
                              </h3>
                              <p className="text-slate-500">
                                {serviceType === "homes" ? "Select additional detailed items for your home." : "Select the material quality level for your project."}
                              </p>
                            </div>

                            {serviceType === "homes" ? (
                              <div className="space-y-16">
                                {Object.entries(DETAILED_FURNITURE).map(([area, items]) => (
                                  <div key={area} className="space-y-8">
                                    <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                      {area} <div className="h-px bg-slate-100 flex-1" />
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                      {(items as any[]).map((item) => {
                                        const sel = selDetailed.find(f => f.id === item.id);
                                        return (
                                          <ItemCard 
                                            key={item.id}
                                            item={item}
                                            isSelected={!!sel}
                                            onToggle={() => toggleDet(item.id)}
                                            onUpdateQty={(d) => updateDetQty(item.id, d)}
                                            qty={sel?.qty || 1}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                                <div className="space-y-8">
                                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-6">
                                    Additional Requirements <div className="h-px bg-slate-100 flex-1" />
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {BASIC_REQUIREMENTS.map((item) => {
                                      const sel = selBasic.find(b => b.id === item.id);
                                      return (
                                        <ItemCard 
                                          key={item.id}
                                          item={item}
                                          isSelected={!!sel}
                                          onToggle={() => toggleBasic(item.id)}
                                          onUpdateQty={(d) => updateBasicQty(item.id, d)}
                                          qty={sel?.qty || 1}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <BrandSelection selBrand={selBrand} setSelBrand={setSelBrand} />
                            )}

                            <div className="flex gap-4 pt-12 pb-8">
                              <Button variant="outline" onClick={back} className="px-10 py-8 rounded-2xl font-bold uppercase tracking-widest border-slate-200">Back</Button>
                              <Button onClick={next} className="flex-1 bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl">
                                {serviceType === "homes" ? "Next Step" : "Final Estimate"} <ChevronRight size={18} className="ml-2" />
                              </Button>
                            </div>
                          </>
                        )}
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
                        {serviceType === "interior" ? (
                          <FinalEstimateForm 
                            register={register} 
                            handleSubmit={handleSubmit} 
                            onSubmit={onSubmit} 
                            errors={errors} 
                            back={back} 
                            estimate={estimate} 
                          />
                        ) : (
                          <>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900">Quality Level</h3>
                              <p className="text-slate-500">Select the material quality level for your project.</p>
                            </div>
                            <BrandSelection selBrand={selBrand} setSelBrand={setSelBrand} />
                            <div className="flex gap-4 pt-12 pb-8">
                              <Button variant="outline" onClick={back} className="px-10 py-8 rounded-2xl font-bold uppercase tracking-widest border-slate-200">Back</Button>
                              <Button onClick={next} className="flex-1 bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl">
                                Final Estimate <ChevronRight size={18} className="ml-2" />
                              </Button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}

                    {step === 5 && serviceType === "homes" && (
                      <motion.div
                        key="step5"
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
                          estimate={estimate} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sidebar Summary */}
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
                          { icon: Layers, k: "Service", v: serviceCards.find(c => c.id === serviceType)?.title || "—" },
                          { icon: Home, k: "Scope", v: reqType === "full_home" ? "Full Home" : "Specific Area" },
                          {
                            icon: Armchair, k: "Items",
                            v: serviceType === "services" ? `${selServices.reduce((s, i) => s + i.qty, 0)} Units`
                              : serviceType === "homes" ? `${selFurnOpts.reduce((s, i) => s + i.qty, 0)} Units`
                              : `${selDetailed.reduce((s, i) => s + i.qty, 0)} Units`
                          },
                          { icon: Layers, k: "Brand", v: BRAND_OPTIONS.find(b => b.id === selBrand)?.name || "—" },
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

                    {/* Decorative element */}
                    <div className="absolute -bottom-16 -right-16 text-white/5 text-[200px] font-bold italic pointer-events-none select-none">
                      B
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-16 max-w-xl w-full text-center space-y-10 shadow-2xl"
            >
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto border-2 border-slate-900">
                <CheckCircle2 size={48} className="text-slate-900" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900">Request Received!</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Thank you for your interest. Our design consultant will reach out to you within 24 hours to discuss your project in detail.
                </p>
              </div>
              <Button
                onClick={() => { setSubmitted(false); setIsOpen(false); }}
                className="w-full bg-slate-900 text-white py-8 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl"
              >
                Back to Website
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
