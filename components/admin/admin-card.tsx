"use client";

import { ReactNode } from "react";

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminCard({ title, subtitle, icon, children, className = "" }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-charcoal/5 shadow-sm overflow-hidden ${className}`}>
      {(title || icon) && (
        <div className="px-6 py-4 border-b border-charcoal/5 bg-warm-cream/30">
          <div className="flex items-center gap-3">
            {icon && <div className="text-gold">{icon}</div>}
            <div>
              {title && <h3 className="text-sm font-semibold text-charcoal">{title}</h3>}
              {subtitle && <p className="text-xs text-charcoal/40 mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
