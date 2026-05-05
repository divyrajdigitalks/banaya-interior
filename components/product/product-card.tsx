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
        className="flex flex-col gap-4 bg-[#fdf9f3] p-4 rounded-3xl border border-primary/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-inner">
          {discount && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#e87d3e] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-wider">
                {discount}% OFF
              </span>
            </div>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:bg-[#4F3D31] hover:text-white shadow-xl"
          >
            <Heart className="h-4.5 w-4.5" />
          </button>
          
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={isHovered && hoverImage ? hoverImage : image}
              alt={name}
              fill
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4 px-1 pb-2">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">{category}</span>
            <h3 className="text-base font-bold text-[#4F3D31] line-clamp-1 group-hover:text-gold transition-colors duration-500">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-[#4F3D31]">₹{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-sm text-[#4F3D31]/20 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-primary/5 shadow-sm">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span className="text-[11px] font-black text-gold">{rating}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-5 bg-gold text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#4F3D31] transition-all duration-700 disabled:opacity-50 shadow-2xl shadow-primary/5 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isAdding ? (
                  <>
                    <Check className="h-4 w-4" /> ADDED TO SANCTUARY
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> ACQUIRE PIECE
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
