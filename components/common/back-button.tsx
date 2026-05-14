"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
  onClick?: () => void;
}

export function BackButton({ label = "Back", className = "", onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-[10px] font-black text-gold uppercase tracking-widest hover:gap-3 transition-all ${className}`}
    >
      <ArrowLeft size={14} /> {label}
    </button>
  );
}
