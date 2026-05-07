"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminFormTextareaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function AdminFormTextarea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  rows = 4,
  className = ""
}: AdminFormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide text-charcoal/60 uppercase">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} 
        disabled={disabled}
        rows={rows}
        className={`min-h-[80px] bg-white border border-charcoal/10 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-y ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      />
    </div>
  );
}
