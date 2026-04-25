"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light"; // dark = black logo, light = white logo
  className?: string;
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const isWhite = variant === "light";

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      
      <Image
        src="/logo.png"
        alt="Banayaa Logo"
        width={120}
        height={120}
        style={{
          filter: isWhite ? "brightness(0) invert(1)" : "none",
        }}
        priority
      />

    </Link>
  );
}