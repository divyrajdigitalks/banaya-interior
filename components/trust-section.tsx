"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCcw, Clock } from "lucide-react";

const trustItems = [
  { 
    icon: Truck, 
    title: "White Glove", 
    desc: "Professional placement at your doorstep with premium care and setup service." 
  },
  { 
    icon: ShieldCheck, 
    title: "10Y Warranty", 
    desc: "Crafted for durability and backed by a long-term trusted warranty." 
  },
  { 
    icon: RefreshCcw, 
    title: "30-Day Return", 
    desc: "Try with confidence and return easily within 30 days." 
  },
  { 
    icon: Clock, 
    title: "Concierge", 
    desc: "Dedicated support team ready to assist whenever needed." 
  },
];

export function TrustSection() {
  return (
    <section className="relative py-16 bg-primary text-white overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[10vw] font-serif font-black italic whitespace-nowrap">
          TRUST
        </span>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {trustItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group text-center lg:text-left space-y-3 p-5 rounded-xl border border-gold/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-gold/30 transition-all duration-700"
            >
              <div className="relative h-12 w-12 bg-gold/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 border border-gold/20 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-700">
                <item.icon className="h-5 w-5 text-gold stroke-[1.5]" />
                
                {/* Floating corner dots */}
                <div className="absolute -top-1 -right-1 w-1 h-1 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-serif font-bold text-gold">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              {/* Decorative line */}
              <div className="w-6 h-[1px] bg-gold/30 group-hover:w-full transition-all duration-700 mx-auto lg:mx-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
