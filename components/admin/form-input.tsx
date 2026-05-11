"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminFormInputProps {
  label: string;
  value: string | number;
  onChange: (val: any) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hideLabel?: boolean;
}

export function AdminFormInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  required = false,
  disabled = false,
  className = "",
  hideLabel = false
}: AdminFormInputProps) {
  return (
    <div className="space-y-2">
      {!hideLabel && (
        <Label className="text-xs font-semibold tracking-wide text-charcoal/60 uppercase">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input 
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder} 
        disabled={disabled}
        className={`h-10 bg-white border border-charcoal/10 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      />
    </div>
  );
}
