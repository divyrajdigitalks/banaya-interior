"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface HeaderProps {
  variant?: "dark" | "light" | "transparent";
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Interiors", href: "/interiors" },
  { name: "Decor", href: "/decor" },
  { name: "Collections", href: "/collections" },
  { name: "Shop", href: "/shop" },
];

export function Header({ variant = "dark" }: HeaderProps) {
  const pathname = usePathname();
  
  const bgClass = variant === "transparent" 
    ? "bg-transparent" 
    : variant === "light" 
      ? "bg-white/80 backdrop-blur-md border-b border-charcoal/5" 
      : "bg-charcoal/95 backdrop-blur-md border-b border-white/5";
  
  const textColor = variant === "light" ? "text-charcoal" : "text-white";
  const logoVariant = variant === "light" ? "dark" : "light";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center h-20">
          {/* Logo Only Header */}
          <Link href="/">
            <Logo variant={logoVariant} />
          </Link>
        </div>
      </div>
    </header>
  );
}
