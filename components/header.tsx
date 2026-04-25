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
        <div className="flex items-center justify-between h-20">
          {/* Left: Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 hover:text-gold relative group ${
                  pathname === link.href ? "text-gold" : textColor
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`} />
              </Link>
            ))}
          </nav>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Logo variant={logoVariant} />
            </Link>
          </div>

          {/* Right: Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 hover:text-gold relative group ${
                  pathname === link.href ? "text-gold" : textColor
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`} />
              </Link>
            ))}
            <Link 
              href="/contact" 
              className={`px-6 py-2 rounded-full border text-[9px] uppercase tracking-[0.2em] font-black transition-all duration-500 ${
                variant === 'light' 
                  ? 'border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white' 
                  : 'border-white/20 text-white hover:bg-white hover:text-charcoal'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button (Placeholder) */}
          <button className={`md:hidden p-2 ${textColor}`}>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="1.5" fill="currentColor"/>
              <rect y="5" width="15" height="1.5" fill="currentColor"/>
              <rect y="10" width="20" height="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
