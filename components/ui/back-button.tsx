"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
}

export function BackButton({ className = "", fallbackPath = "/shop" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={handleBack}
      className={`group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-gold transition-all duration-500 ${className}`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 group-hover:bg-gold/10 group-hover:text-gold transition-all duration-500">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-500" />
      </div>
      <span>Back</span>
    </motion.button>
  );
}
