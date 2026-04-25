"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  tag?: string;
}

export function ProductCard({ id, name, price, image, hoverImage, category, tag }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAdding, setIsAdding] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    // In a real app, you'd call your cart context here
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <motion.div
      className="group relative flex flex-col bg-transparent perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      animate={{
        rotateY: mousePos.x * 5,
        rotateX: -mousePos.y * 5,
        scale: isHovered ? 1.01 : 1,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-warm-cream shadow-sm transition-all duration-700 group-hover:shadow-xl group-hover:shadow-charcoal/5">
        {tag && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span className="bg-charcoal text-gold text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-gold/20 shadow-lg backdrop-blur-md">
              {tag}
            </span>
          </div>
        )}
        
        <button className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-gold hover:text-white border border-charcoal/5 shadow-md">
          <Heart className="h-3.5 w-3.5" />
        </button>
        
        <Link href={`/product/${id}`} className="block w-full h-full">
          <Image
            src={isHovered && hoverImage ? hoverImage : image}
            alt={name}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-out scale-100 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-charcoal/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </Link>

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
          <button 
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full bg-white text-charcoal py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gold hover:text-white transition-all shadow-xl border border-gold/10 disabled:bg-gold disabled:text-white overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="check"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  Added
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to Cart
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-4 space-y-1.5 px-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[7px] text-gold uppercase tracking-[0.3em] font-black">{category}</span>
            <div className="h-px w-5 bg-gold/20" />
          </div>
          <Link href={`/product/${id}`} className="group/title inline-flex items-center gap-2">
            <h3 className="text-base font-serif font-black text-charcoal group-hover/title:text-gold transition-colors duration-500 leading-tight">
              {name}
            </h3>
            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-500 text-gold" />
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-charcoal font-black tracking-tighter text-lg">
            ₹{price.toLocaleString()}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-gold/10" />
            ))}
          </div>
        </div>
        
        <div className="h-[1.5px] w-0 group-hover:w-full bg-gradient-to-r from-gold via-gold/30 to-transparent transition-all duration-1000 ease-out" />
      </div>
    </motion.div>
  );
}
