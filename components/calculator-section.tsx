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
  Frame, Square, Paintbrush, Zap, Wind
} from "lucide-react";
import {
  BHK_OPTIONS, FURNITURE_ITEMS, GENERAL_SERVICES,
  BRAND_OPTIONS, DETAILED_FURNITURE, BASIC_REQUIREMENTS
} from "@/lib/data/calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ─── Schema ─────────────────────────────────────────────────────────────────── */
const schema = z.object({
  propertyType: z.string().optional(),
  requirementType: z.enum(["full_home", "specific_area"]).optional(),
  carpetArea: z.string().optional(),
  rooms: z.array(z.string()).optional(),
  material: z.string().optional(),
  finish: z.string().optional(),
  brand: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  city: z.string().min(2, "City is required"),
  serviceType: z.enum(["services", "interior", "homes"], { error: "Service type is required" }),
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

export function CalculatorSection() {
  const [step, setStep] = useState(0);
  const [estimate, setEstimate] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [serviceType, setServiceType] = useState<"services" | "interior" | "homes" | null>(null);
  const [reqType, setReqType] = useState<"full_home" | "specific_area">("full_home");
  const [selBHK, setSelBHK] = useState(BHK_OPTIONS[1].id);
  const [carpetArea, setCarpetArea] = useState("");
  const [selFurniture, setSelFurniture] = useState<string[]>([]);
  const [selFurnOpts, setSelFurnOpts] = useState<{ id: string; qty: number }[]>([]);
  const [selDetailed, setSelDetailed] = useState<{ id: string; qty: number }[]>([]);
  const [selBasic, setSelBasic] = useState<{ id: string; qty: number }[]>([]);
  const [selServices, setSelServices] = useState<{ id: string; qty: number }[]>([]);
  const [selBrand, setSelBrand] = useState(BRAND_OPTIONS[0].id);

  const SVC_ICONS: Record<string, any> = {
    "Wall Paint": Paintbrush,
    "Ceiling Work": Layers,
    "Electrical work with switch": Zap,
    "AC Piping": Wind,
  };

  const serviceCards = [
    { id: "services", title: "Services", sub: "Paint · Electrical · AC", desc: ["Wall Paint", "Ceiling Work", "Electrical", "AC Piping"], icon: Paintbrush },
    { id: "interior", title: "Interior", sub: "Kitchen · Wardrobes · Units", desc: ["Modular Kitchen", "Wardrobes", "TV Units", "Study Tables"], icon: LayoutGrid },
    { id: "homes", title: "Homes", sub: "Full Home · Renovation", desc: ["Full Home Interiors", "Renovations", "New Home Setup"], icon: Home },
  ];

  const { register, handleSubmit, formState: { errors } } = useForm<CF>({
    resolver: zodResolver(schema),
    defaultValues: { material: "Solid Teak Wood", finish: "Premium", city: "", requirementType: "full_home" },
  });

  /* estimate */
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

  /* handlers */
  const toggleSvc = (id: string) => setSelServices(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateSvcQty = (id: string, d: number) => setSelServices(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));

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
  const updateFurnQty = (id: string, d: number) => setSelFurnOpts(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));
  
  const toggleDet = (id: string) => setSelDetailed(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateDetQty = (id: string, d: number) => setSelDetailed(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));
  
  const toggleBasic = (id: string) => setSelBasic(p => p.find(x => x.id === id) ? p.filter(x => x.id !== id) : [...p, { id, qty: 1 }]);
  const updateBasicQty = (id: string, d: number) => setSelBasic(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));

  const next = () => setStep(p => Math.min(p + 1, 4));
  const back = () => setStep(p => Math.max(p - 1, 0));
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

  const progSteps = [
    { s: 1, n: "Requirements" },
    { s: 2, n: "Selection" },
    { s: 3, n: "Brand" },
    { s: 4, n: "Estimate" }
  ];

  /* ─── Card Component ─── */
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
    onUpdateQty: (d: number) => void;
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
            <QtyBtn onClick={() => onUpdateQty(-1)} icon={Minus} />
            <span className="font-bold w-6 text-center text-sm">{qty}</span>
            <QtyBtn onClick={() => onUpdateQty(1)} icon={Plus} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-8xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Cost Calculator</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Get an instant estimate for your interior and decor projects.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Main Content */}
          <div className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {serviceCards.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setServiceType(opt.id as any); next(); }}
                      className="group p-8 rounded-2xl border border-slate-100 bg-white hover:border-slate-900 hover:shadow-xl transition-all text-left flex flex-col gap-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                        <opt.icon size={24} className="text-slate-900 group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{opt.title}</h3>
                        <p className="text-sm text-slate-500">{opt.sub}</p>
                      </div>
                      <ul className="space-y-3 border-t border-slate-50 pt-6 flex-1">
                        {opt.desc.map((d, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            {d}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        Get Started <ChevronRight size={16} />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {step > 0 && step <= 4 && (
                <div className="space-y-8">
                  {/* Progress */}
                  <div className="p-4 rounded-xl border border-slate-100 flex items-center gap-4 overflow-x-auto">
                    {progSteps.map((item, idx) => (
                      <div key={item.s} className="flex items-center gap-4 shrink-0">
                        <button
                          onClick={() => item.s < step && setStep(item.s)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            step === item.s
                              ? "bg-slate-900 text-white"
                              : step > item.s
                              ? "bg-slate-100 text-slate-900"
                              : "bg-white text-slate-300 border border-slate-100"
                          }`}
                        >
                          {step > item.s ? <CheckCircle2 size={16} /> : item.s}
                        </button>
                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= item.s ? "text-slate-900" : "text-slate-300"}`}>
                          {item.n}
                        </span>
                        {idx < 3 && <div className={`w-8 h-px ${step > item.s ? "bg-slate-900" : "bg-slate-100"}`} />}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Step 1: Requirements */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {serviceType === "homes" ? "Select items" : "Project scope"}
                          </h3>
                          <p className="text-slate-500">Tell us what you need for your space.</p>
                        </div>

                        {serviceType === "homes" ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {FURNITURE_ITEMS.map((item) => {
                              const active = selFurniture.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggleFurn(item.id)}
                                  className={`p-4 rounded-xl border transition-all text-center space-y-3 ${
                                    active ? "border-slate-900 bg-slate-50" : "border-slate-100 bg-white"
                                  }`}
                                >
                                  <div className="aspect-square rounded-lg overflow-hidden relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    {active && (
                                      <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                        <CheckCircle2 className="text-slate-900" size={24} />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs font-bold uppercase tracking-wide block">{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-8">
                            <div className="flex p-1 bg-slate-50 rounded-lg w-fit">
                              {["full_home", "specific_area"].map((rt) => (
                                <button
                                  key={rt}
                                  onClick={() => setReqType(rt as any)}
                                  className={`px-6 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                                    reqType === rt ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                                  }`}
                                >
                                  {rt === "full_home" ? "Full Home" : "Specific Area"}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Select BHK</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {BHK_OPTIONS.map((opt) => {
                                  const active = selBHK === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      onClick={() => setSelBHK(opt.id)}
                                      className={`p-4 rounded-xl border transition-all text-center space-y-3 ${
                                        active ? "border-slate-900 bg-slate-50" : "border-slate-100 bg-white"
                                      }`}
                                    >
                                      <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                                        {active && (
                                          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                            <CheckCircle2 className="text-slate-900" size={20} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-xs font-bold uppercase tracking-wide block">{opt.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Carpet Area (sq ft)</label>
                              <Input
                                type="number"
                                value={carpetArea}
                                onChange={(e) => setCarpetArea(e.target.value)}
                                placeholder="e.g. 1200"
                                className="max-w-xs"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-4 pt-4">
                          <Button variant="outline" onClick={back} className="px-8">Back</Button>
                          <Button onClick={next} className="flex-1 bg-slate-900 text-white">Next Step</Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Customization */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {serviceType === "services" ? "Choose services" : "Customize items"}
                          </h3>
                          <p className="text-slate-500">Refine your selection and quantities.</p>
                        </div>

                        <div className="space-y-12">
                          {serviceType === "homes" && selFurniture.map((furnId) => {
                            const furn = FURNITURE_ITEMS.find(f => f.id === furnId);
                            if (!furn) return null;
                            return (
                              <div key={furnId} className="space-y-6">
                                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-[0.2em] border-l-4 border-slate-900 pl-4">
                                  {furn.name}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div key={area} className="space-y-6">
                              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-[0.2em] flex items-center gap-6">
                                {area} <div className="h-px bg-slate-100 flex-1" />
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                          {serviceType === "services" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          )}
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button variant="outline" onClick={back} className="px-8">Back</Button>
                          <Button onClick={next} className="flex-1 bg-slate-900 text-white">Next Step</Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Brand */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">Brand Choice</h3>
                          <p className="text-slate-500">Select the quality of materials.</p>
                        </div>

                        {serviceType === "interior" && (
                          <div className="space-y-6">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Additional Requirements</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        )}

                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Select Brand Level</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {BRAND_OPTIONS.map((opt) => {
                              const active = selBrand === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => setSelBrand(opt.id)}
                                  className={`p-4 rounded-xl border transition-all space-y-4 ${
                                    active ? "border-slate-900 bg-slate-50" : "border-slate-100 bg-white"
                                  }`}
                                >
                                  <div className="aspect-video rounded-lg overflow-hidden relative">
                                    <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                                    {active && (
                                      <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                        <CheckCircle2 className="text-slate-900" size={24} />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs font-bold uppercase tracking-widest block text-center">{opt.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button variant="outline" onClick={back} className="px-8">Back</Button>
                          <Button onClick={next} className="flex-1 bg-slate-900 text-white">Final Estimate</Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Contact */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">Your Details</h3>
                          <p className="text-slate-500">Please provide your contact info to get the detailed proposal.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Full Name</label>
                              <Input {...register("name")} placeholder="Your name" className={errors.name ? "border-red-500" : ""} />
                              {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Email Address</label>
                              <Input {...register("email")} placeholder="you@email.com" className={errors.email ? "border-red-500" : ""} />
                              {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Phone Number</label>
                              <Input {...register("phone")} placeholder="+91 00000 00000" className={errors.phone ? "border-red-500" : ""} />
                              {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">City</label>
                              <Input {...register("city")} placeholder="Your city" className={errors.city ? "border-red-500" : ""} />
                              {errors.city && <p className="text-[10px] text-red-500 font-bold">{errors.city.message}</p>}
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={back} className="px-8">Back</Button>
                            <Button type="submit" className="flex-1 bg-slate-900 text-white">Submit & Get Quote</Button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-96 sticky top-8">
            <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="space-y-8 relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-4">
                    Estimated Investment
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-400">₹</span>
                    <motion.span
                      key={estimate}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-6xl font-bold tracking-tight"
                    >
                      {Math.round(estimate).toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4">*Approximate cost based on selection</p>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="space-y-5">
                  {[
                    { icon: Layers, k: "Service", v: serviceType || "—" },
                    { icon: Home, k: "Type", v: reqType === "full_home" ? "Full Home" : "Specific Area" },
                    {
                      icon: Armchair, k: "Items",
                      v: serviceType === "services" ? `${selServices.reduce((s, i) => s + i.qty, 0)} Units`
                        : serviceType === "homes" ? `${selFurnOpts.reduce((s, i) => s + i.qty, 0)} Units`
                        : `${selDetailed.reduce((s, i) => s + i.qty, 0)} Units`
                    },
                    { icon: Layers, k: "Brand", v: BRAND_OPTIONS.find(b => b.id === selBrand)?.name || "—" },
                  ].map((row) => (
                    <div key={row.k} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-slate-400 uppercase tracking-widest font-bold">
                        <row.icon size={14} />
                        {row.k}
                      </div>
                      <span className="font-bold text-white uppercase">{row.v}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 py-6 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <Download size={18} /> Download Quote
                </Button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 text-white/5 text-[150px] font-bold italic pointer-events-none select-none">
                B
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-12 max-w-md w-full text-center space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto border-2 border-slate-900">
                <CheckCircle2 size={40} className="text-slate-900" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900">Thank You!</h2>
                <p className="text-slate-500 leading-relaxed">
                  We have received your requirements. Our designer will contact you within 24 hours with a detailed proposal.
                </p>
              </div>
              <Button
                onClick={() => setSubmitted(false)}
                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-bold uppercase tracking-widest"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
