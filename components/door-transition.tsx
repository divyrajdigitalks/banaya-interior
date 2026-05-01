"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function DoorTransition() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex overflow-hidden bg-background/10 backdrop-blur-sm">
          {/* Left Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1], delay: 0.5 }}
            className="w-1/2 h-full bg-primary relative flex items-center justify-end"
          >
            {/* Door Panel Detail */}
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gold/30 shadow-[0_0_15px_rgba(201,169,98,0.3)]" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gold/10" />
          </motion.div>
          
          {/* Right Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1], delay: 0.5 }}
            className="w-1/2 h-full bg-primary relative flex items-center justify-start"
          >
            {/* Door Panel Detail */}
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gold/30 shadow-[0_0_15px_rgba(201,169,98,0.3)]" />
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gold/10" />
          </motion.div>

          {/* Center Logo/Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.3em" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 rounded-full border border-gold/20 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                <span className="text-gold text-4xl font-serif italic">B</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-gold text-4xl md:text-5xl font-serif tracking-[0.3em] uppercase font-light">
                  Banaya
                </h1>
                <div className="h-px w-12 bg-gold/40" />
                <p className="text-gold/60 text-[10px] uppercase tracking-[0.5em]">
                  Royal Living
                </p>
              </div>
            </motion.div>
          </div>

          {/* Golden Flash on Open */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 bg-gold pointer-events-none mix-blend-overlay"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
