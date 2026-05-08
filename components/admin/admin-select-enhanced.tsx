"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  onValidate?: (value: string) => string | null;
}

export function AdminSelectEnhanced({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder = "Select an option", 
  required = false,
  disabled = false,
  className = "",
  error,
  onValidate
}: AdminSelectProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateField = (val: string) => {
    if (required && (!val || val.trim() === "")) {
      return `${label} is required`;
    }
    if (onValidate) {
      return onValidate(val);
    }
    return null;
  };

  useEffect(() => {
    if (touched) {
      const validationError = validateField(value);
      setInternalError(validationError);
    }
  }, [value, touched, required, onValidate]);

  const handleOpenChange = (open: boolean) => {
    if (!open && !touched) {
      setTouched(true);
      const validationError = validateField(value);
      setInternalError(validationError);
    }
  };

  const displayError = error || internalError;

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide text-charcoal/60 uppercase">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        onOpenChange={handleOpenChange}
        disabled={disabled}
      >
        <SelectTrigger className={`h-10 bg-white border transition-all ${
          displayError 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
            : 'border-charcoal/10 focus:ring-2 focus:ring-gold/30 focus:border-gold'
        } rounded-xl text-sm ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-charcoal/10">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-sm hover:bg-gold/10 focus:bg-gold/10"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {displayError && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {displayError}
        </p>
      )}
    </div>
  );
}