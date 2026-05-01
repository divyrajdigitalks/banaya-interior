"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-primary"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #c9a962 1px, transparent 1px),
              linear-gradient(-45deg, #c9a962 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
      </div>

      {/* Logo */}
      <div className={`absolute top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <Logo variant="light" />
      </div>

      {/* Decorative Floating Elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#c9a962]/20 rounded-full pointer-events-none transition-transform duration-700"
        style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/10 rounded-full pointer-events-none transition-transform duration-700"
        style={{ transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)` }}
      />

      {/* Center Vertical Line */}
      <div className={`absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a962]/50 to-transparent z-30 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

      {/* Split Screen */}
      <div className="flex h-full">
        {/* Left Side - Interiors */}
        <Link
          href="/interiors"
          className={`group relative flex-1 transition-all duration-700 ease-out cursor-pointer ${
            hoveredSide === "right" ? "flex-[0.35]" : hoveredSide === "left" ? "flex-[0.65]" : ""
          }`}
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80')`,
              transform: `scale(${hoveredSide === "left" ? 1.1 : 1.05}) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          />
          
          {/* Overlay with animated gradient */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            hoveredSide === "left" 
              ? 'bg-gradient-to-r from-primary/60 via-primary/40 to-transparent' 
              : 'bg-primary/50'
          }`} />

          {/* Decorative corner accent */}
          <div className={`absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#c9a962] transition-all duration-500 ${hoveredSide === "left" ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />

          {/* Content */}
          <div className={`relative z-20 flex flex-col justify-end h-full p-8 md:p-12 lg:p-16 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            {/* Section Label */}
            <span className={`text-[#c9a962] text-xs tracking-[0.3em] uppercase mb-4 transition-all duration-500 ${hoveredSide === "left" ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-50'}`}>
              Interior Design Studio
            </span>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 leading-[1.1]">
              <span className={`inline-block transition-all duration-500 ${hoveredSide === "left" ? 'translate-x-0' : ''}`}>
                Banaya
              </span>
              <br />
              <span className={`inline-block italic transition-all duration-500 delay-100 ${hoveredSide === "left" ? 'translate-x-4' : ''}`}>
                Interiors
              </span>
            </h2>

            {/* Description - only visible on hover */}
            <p className={`text-white/70 text-sm md:text-base max-w-md mb-8 font-light leading-relaxed transition-all duration-500 ${hoveredSide === "left" ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Where architecture breathes and every room tells its story. Crafting spaces that inspire and endure.
            </p>

            {/* CTA */}
            <div className={`flex items-center gap-4 transition-all duration-500 ${hoveredSide === "left" ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-2'}`}>
              <span className="text-white text-xs tracking-[0.2em] uppercase">Explore</span>
              <div className={`w-12 h-px bg-[#c9a962] transition-all duration-500 ${hoveredSide === "left" ? 'w-20' : 'w-12'}`} />
              <ArrowRight className={`w-4 h-4 text-[#c9a962] transition-transform duration-500 ${hoveredSide === "left" ? 'translate-x-2' : ''}`} />
            </div>
          </div>

          {/* Large background text */}
          <div className={`absolute bottom-20 left-0 font-serif text-[15vw] text-white/[0.03] leading-none pointer-events-none transition-all duration-700 ${hoveredSide === "left" ? 'opacity-100' : 'opacity-0'}`}>
            SPACES
          </div>
        </Link>

        {/* Right Side - Decor */}
        <Link
          href="/decor"
          className={`group relative flex-1 transition-all duration-700 ease-out cursor-pointer ${
            hoveredSide === "left" ? "flex-[0.35]" : hoveredSide === "right" ? "flex-[0.65]" : ""
          }`}
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80')`,
              transform: `scale(${hoveredSide === "right" ? 1.1 : 1.05}) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          />
          
          {/* Overlay with animated gradient */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            hoveredSide === "right" 
              ? 'bg-gradient-to-l from-primary/60 via-primary/40 to-transparent' 
              : 'bg-primary/50'
          }`} />

          {/* Decorative corner accent */}
          <div className={`absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[#c9a962] transition-all duration-500 ${hoveredSide === "right" ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />

          {/* Content */}
          <div className={`relative z-20 flex flex-col justify-end h-full p-8 md:p-12 lg:p-16 text-right items-end transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
            {/* Section Label */}
            <span className={`text-[#c9a962] text-xs tracking-[0.3em] uppercase mb-4 transition-all duration-500 ${hoveredSide === "right" ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-50'}`}>
              Handcrafted Collection
            </span>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 leading-[1.1]">
              <span className={`inline-block transition-all duration-500 ${hoveredSide === "right" ? 'translate-x-0' : ''}`}>
                Banaya
              </span>
              <br />
              <span className={`inline-block italic transition-all duration-500 delay-100 ${hoveredSide === "right" ? '-translate-x-4' : ''}`}>
                Décor
              </span>
            </h2>

            {/* Description - only visible on hover */}
            <p className={`text-white/70 text-sm md:text-base max-w-md mb-8 font-light leading-relaxed transition-all duration-500 ${hoveredSide === "right" ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Objects chosen with intention. Spaces curated with soul. Handcrafted wooden pieces that tell stories.
            </p>

            {/* CTA */}
            <div className={`flex items-center gap-4 transition-all duration-500 ${hoveredSide === "right" ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'}`}>
              <ArrowRight className={`w-4 h-4 text-[#c9a962] rotate-180 transition-transform duration-500 ${hoveredSide === "right" ? '-translate-x-2' : ''}`} />
              <div className={`w-12 h-px bg-[#c9a962] transition-all duration-500 ${hoveredSide === "right" ? 'w-20' : 'w-12'}`} />
              <span className="text-white text-xs tracking-[0.2em] uppercase">Discover</span>
            </div>
          </div>

          {/* Large background text */}
          <div className={`absolute bottom-20 right-0 font-serif text-[15vw] text-white/[0.03] leading-none pointer-events-none transition-all duration-700 ${hoveredSide === "right" ? 'opacity-100' : 'opacity-0'}`}>
            OBJECTS
          </div>
        </Link>
      </div>

      {/* Bottom Info Bar */}
      <div className={`absolute bottom-0 left-0 right-0 z-40 flex justify-between items-center px-8 py-6 bg-gradient-to-t from-primary/80 to-transparent transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
        <div className="text-white/50 text-xs tracking-wider">
          <span className="text-[#c9a962]">Est.</span> 2020
        </div>
        <div className="flex gap-8">
          <span className="text-white/50 text-xs tracking-wider hover:text-[#c9a962] transition-colors cursor-pointer">Instagram</span>
          <span className="text-white/50 text-xs tracking-wider hover:text-[#c9a962] transition-colors cursor-pointer">LinkedIn</span>
          <span className="text-white/50 text-xs tracking-wider hover:text-[#c9a962] transition-colors cursor-pointer">Contact</span>
        </div>
        <div className="text-white/50 text-xs tracking-wider">
          Surat, <span className="text-[#c9a962]">India</span>
        </div>
      </div>
    </div>
  );
}
