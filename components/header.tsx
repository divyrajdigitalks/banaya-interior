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
      ? "bg-white/80 backdrop-blur-md border-b border-primary/5" 
      : "bg-primary/95 backdrop-blur-md border-b border-white/5";
  
  const textColor = variant === "light" ? "text-primary" : "text-white";
  const logoVariant = variant === "light" ? "dark" : "light";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center h-24">
          {/* Desktop Navigation - Hidden as per request */}
          {/* <nav className="hidden lg:flex items-center gap-10">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold transition-all duration-300 relative group ${
                  pathname === link.href ? "text-gold" : `${textColor}/60 hover:text-gold`
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-500 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </nav> */}

          {/* Center Logo */}
          <Link href="/" className="relative">
            <Logo variant={logoVariant} />
          </Link>

          {/* Desktop Navigation - Hidden as per request */}
          {/* <nav className="hidden lg:flex items-center gap-10">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold transition-all duration-300 relative group ${
                  pathname === link.href ? "text-gold" : `${textColor}/60 hover:text-gold`
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-500 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </nav> */}

          {/* Mobile Menu Placeholder - Hidden */}
          {/* <div className="lg:hidden">
          </div> */}
        </div>
      </div>
    </header>
  );
}
