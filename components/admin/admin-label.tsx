"use client";

import { Label } from "@/components/ui/label";

interface AdminLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function AdminLabel({ children, required = false, className = "" }: AdminLabelProps) {
  return (
    <Label className={`text-xs font-semibold tracking-wide text-charcoal/60 uppercase ${className}`}>
      {children} {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );
}
