"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light"; // dark = black logo, light = white logo
  className?: string;
  asChild?: boolean; // When true, renders without Link wrapper
}

export function Logo({ variant = "dark", className = "", asChild = false }: LogoProps) {
  const isWhite = variant === "light";

  const logoImage = (
    <Image
      src="/logo.png"
      alt="Banayaa Logo"
      width={80}
      height={80}
      style={{
        // width: "auto",
        // height: "auto",
        filter: isWhite ? "brightness(0) invert(1)" : "none",
      }}
      priority
    />
  );

  if (asChild) {
    return <div className={`flex items-center ${className}`}>{logoImage}</div>;
  }

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {logoImage}
    </Link>
  );
}