"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface AdminFormInputProps {
  label: string;
  value: string | number;
  onChange: (val: any) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  onValidate?: (value: string | number) => string | null;
}

export function AdminFormInputEnhanced({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  required = false,
  disabled = false,
  className = "",
  error,
  onValidate
}: AdminFormInputProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateField = (val: string | number) => {
    if (required && (!val || val.toString().trim() === "")) {
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

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateField(value);
    setInternalError(validationError);
  };

  const displayError = error || internalError;

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide text-charcoal/60 uppercase">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input 
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder} 
        disabled={disabled}
        className={`h-10 bg-white border transition-all ${
          displayError 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
            : 'border-charcoal/10 focus:ring-2 focus:ring-gold/30 focus:border-gold'
        } rounded-xl text-sm focus:bg-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      />
      {displayError && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {displayError}
        </p>
      )}
    </div>
  );
}