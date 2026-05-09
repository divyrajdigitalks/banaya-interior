"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { buildImageUrl } from "@/lib/api";

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
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

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

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
        category
      });
    }
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

  return (
    <Link href={`/product/${id}`} className="group block">
      <motion.div 
        whileHover={{ y: -5 }}
        className="flex flex-col h-full gap-2 bg-[#fdf9f3] p-2 rounded-xl border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white flex-shrink-0">
          {discount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-[#e87d3e] text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg uppercase">
                {discount}% OFF
              </span>
            </div>
          )}

          <button 
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isInWishlist(id) ? "bg-red-500 text-white" : "bg-white/80 backdrop-blur-md text-primary/40 hover:text-red-500"
            } shadow-lg`}
          >
            <Heart size={14} className={isInWishlist(id) ? "fill-white" : ""} />
          </button>

          
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={isHovered && hoverImage ? (hoverImage.startsWith('http') ? hoverImage : buildImageUrl(hoverImage)) : (image.startsWith('http') ? image : buildImageUrl(image))}
              alt={name}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 gap-1 px-0.5 min-h-[90px]">
          <div className="space-y-0.5">
            <span className="text-[7px] font-black text-gold uppercase tracking-widest">{category}</span>
            <h3 className="text-[10px] font-bold text-[#4F3D31] line-clamp-1 h-4 group-hover:text-gold transition-colors duration-500">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-[#4F3D31]">₹{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-[9px] text-[#4F3D31]/20 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-full border border-primary/5">
              <Star className="h-2 w-2 fill-gold text-gold" />
              <span className="text-[8px] font-black text-gold">{rating}</span>
            </div>
          </div>

          <div className="pt-0.5">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-2 bg-[#4F3D31] text-white text-[7px] font-black uppercase tracking-widest rounded-md hover:bg-gold transition-all duration-700 disabled:opacity-50 group/btn relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAdding ? <Check className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                {isAdding ? "ADDED" : "ADD TO CART"}
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
