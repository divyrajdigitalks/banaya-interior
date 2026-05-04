"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminFormInputProps {
  label: string;
  value: string | number;
  onChange: (val: any) => void;
  placeholder?: string;
  type?: string;
}

export function AdminFormInput({ label, value, onChange, placeholder, type = "text" }: AdminFormInputProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold tracking-tight text-charcoal/40">{label}</Label>
      <Input 
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder} 
        className="h-14 bg-charcoal/5 border-transparent rounded-2xl focus:bg-white focus:ring-gold/20 focus:border-gold transition-all"
      />
    </div>
  );
}
