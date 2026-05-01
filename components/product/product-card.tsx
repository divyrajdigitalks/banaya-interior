"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  tag?: string;
  rating?: number;
  reviewsCount?: number;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice,
  image, 
  hoverImage, 
  category, 
  tag,
  rating = 4.5,
  reviewsCount = 120
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    addToCart({
      id,
      name,
      price,
      image,
      category
    });
    
    setTimeout(() => setIsAdding(false), 2000);
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

  return (
    <Link href={`/product/${id}`} className="group block">
      <motion.div 
        whileHover={{ y: -8 }}
        className="flex flex-col gap-4 bg-white p-3 rounded-2xl border border-primary/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#fdf9f3]">
          {discount && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#e87d3e] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
                {discount}% off
              </span>
            </div>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white shadow-md"
          >
            <Heart className="h-4 w-4" />
          </button>
          
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={isHovered && hoverImage ? hoverImage : image}
              alt={name}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-2 px-1 pb-2">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gold uppercase tracking-[0.2em]">{category}</span>
            <h3 className="text-sm font-bold text-primary line-clamp-1 group-hover:text-gold transition-colors duration-500">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-primary">₹{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-xs text-primary/20 line-through">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 bg-gold/5 px-2 py-1 rounded-lg border border-gold/10">
              <Star className="h-2.5 w-2.5 fill-gold text-gold" />
              <span className="text-[10px] font-bold text-gold">{rating}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-3.5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gold transition-all duration-500 disabled:opacity-50 shadow-xl shadow-primary/5 group/btn relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAdding ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Added to Sanctuary
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" /> Acquire Piece
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
