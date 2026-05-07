"use client";

import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function AdminSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select option",
  required = false,
  disabled = false,
  className = ""
}: AdminSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide text-charcoal/60 uppercase">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full h-10 px-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}