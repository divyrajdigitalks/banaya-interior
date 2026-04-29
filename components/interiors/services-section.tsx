"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const services = [
  {
    id: "full-home",
    calculatorType: "homes",
    title: "Full Home Interior",
    description: "Complete estimation journey with a structured and accurate questionnaire for your entire sanctuary.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    available: true,
  },
  {
    id: "kitchen",
    calculatorType: "interior",
    title: "Interior",
    description: "Smart modular kitchen estimator designed for the heart of your home.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    available: true,
  },
  {
    id: "wardrobe",
    calculatorType: "interior",
    title: "Service",
    description: "Bespoke wardrobe estimation flow crafted for your personal collection.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    available: true,
  },
];

export function ServicesSection() {
  const [activeWord, setActiveWord] = useState("Sanctuary");
  const openCalculator = (type: "services" | "interior" | "homes") => {
    window.dispatchEvent(new CustomEvent("open-calculator", { detail: { type } }));
  };

  return (
    <section className="py-32 bg-warm-cream/20">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.5em] text-gold font-black uppercase block"
          >
            Estimation Suite
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-charcoal font-black leading-tight"
          >
            Estimate your <br />
            <span className="italic font-light text-gold transition-all duration-700">
              {activeWord}.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/50 max-w-xl mx-auto text-lg font-light leading-relaxed"
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
              <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-[2.5rem] shadow-2xl">
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
                <h3 className="font-serif text-3xl text-charcoal font-black leading-tight group-hover:text-gold transition-colors duration-500">
                  {service.title}
                </h3>
                <p className="text-charcoal/40 text-base font-light leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 px-2">
                <button
                  onClick={() => openCalculator(service.calculatorType as "services" | "interior" | "homes")}
                  className={`group/btn relative w-full py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-700 shadow-xl ${
                    service.available
                      ? "bg-charcoal text-white hover:shadow-gold/20"
                      : "bg-white text-charcoal/20 border border-charcoal/5 cursor-not-allowed shadow-none"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {service.available ? (
                      <>
                        Begin Calculation <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </>
                    ) : (
                      "Locked"
                    )}
                  </span>
                  {service.available && (
                    <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />
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
