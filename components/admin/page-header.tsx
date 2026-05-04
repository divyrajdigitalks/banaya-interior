"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}

export function AdminPageHeader({ title, subtitle, actionLabel, onAction }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-px bg-gold" />
          <span className="text-xs tracking-tight text-gold font-bold">{subtitle}</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-black text-charcoal leading-tight"
        >
          {title.split(' ')[0]} <span className="text-gold italic font-light">{title.split(' ').slice(1).join(' ')}</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button 
          onClick={onAction}
          className="bg-gold hover:bg-gold/90 text-charcoal font-bold px-8 py-6 rounded-2xl shadow-lg shadow-gold/20 flex items-center gap-3 group transition-all duration-500"
        >
          <Plus className="group-hover:rotate-90 transition-transform duration-500" />
          {actionLabel}
        </Button>
      </motion.div>
    </header>
  );
}
