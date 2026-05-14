"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { interiorServicesService, type InteriorService } from "@/lib/api";

export function ServicesSection() {
  const [activeWord, setActiveWord] = useState("Sanctuary");
  const [services, setServices] = useState<InteriorService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await interiorServicesService.getServicesList();
      // Only show services that are marked as available/active
      setServices(data.filter(s => s.available));
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCalculator = (type: "services" | "interior" | "homes") => {
    window.dispatchEvent(new CustomEvent("open-calculator", { detail: { type } }));
  };

  if (loading) {
    return (
      <section className="bg-background py-24">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-primary font-black leading-tight"
          >
            Estimate your <br />
            <span className="font-bold text-gold transition-all duration-700 uppercase">
              {activeWord}.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary/50 max-w-xl mx-auto text-lg font-light leading-relaxed"
          >
            Select a bespoke service to receive a meticulous estimate. Our smart logic ensures transparency and precision for your investment.
          </motion.p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col h-full"
              onMouseEnter={() => setActiveWord(service.title)}
              onMouseLeave={() => setActiveWord("Sanctuary")}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-[2.5rem] shadow-2xl bg-warm-cream/20">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />

                {/* Floating Index */}
                <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-black">
                  0{index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow space-y-4 px-2">
                <h3 className="font-serif text-3xl text-primary font-black leading-tight group-hover:text-gold transition-colors duration-500 uppercase">
                  {service.title}
                </h3>
                <p className="text-[#5a5a5a] text-base font-light leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 px-2">
                <button
                  onClick={() => openCalculator(service.calculatorType)}
                  className={`group/btn relative w-full py-6 rounded-full text-xs font-bold tracking-widest overflow-hidden transition-all duration-700 shadow-xl ${service.available
                    ? "bg-gold text-white hover:shadow-gold/20"
                    : "bg-background text-primary/20 border border-primary/5 cursor-not-allowed shadow-none"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {service.available ? (
                      <>
                        Begin Calculation
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </>
                    ) : (
                      "Locked"
                    )}
                  </span>

                  {service.available && (
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
