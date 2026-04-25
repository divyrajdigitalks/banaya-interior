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
        <div className="fixed inset-0 z-[9999] pointer-events-none flex overflow-hidden">
          {/* Left Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            className="w-1/2 h-full bg-slate-900 flex items-center justify-end"
          >
            <div className="w-px h-1/4 bg-white/20 mr-4" />
          </motion.div>
          
          {/* Right Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            className="w-1/2 h-full bg-slate-900 flex items-center justify-start"
          >
            <div className="w-px h-1/4 bg-white/20 ml-4" />
          </motion.div>

          {/* Center Logo or Text */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-white text-6xl font-black tracking-[0.3em] uppercase italic">
              Banaya
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
