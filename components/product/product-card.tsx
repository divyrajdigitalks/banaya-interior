"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
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
  category?: string | { id: string; name: string };
  categoryId?: string;
  tag?: string;
  rating?: number;
  reviewsCount?: string | number;
  stock?: number;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice,
  image, 
  hoverImage, 
  category,
  categoryId,
  tag,
  rating = 4.8,
  reviewsCount = "4.2k",
  stock
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  const isOutOfStock = stock !== undefined && stock <= 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    if (isOutOfStock) return;
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
    <Link href={`/product/${id}`} className="group block h-full">
      <motion.div 
        className="flex flex-col h-full bg-[#FDF9F3] rounded-[2rem] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgba(60,42,30,0.12)] transition-all duration-700 relative group/card border border-transparent hover:border-[#C9A962]/30"
      >
        {/* Image Area - More Compact aspect ratio */}
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white flex-shrink-0">
          {/* Wishlist Button */}
          <button 
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
              isInWishlist(id) 
                ? "bg-[#C9A962] text-white" 
                : "bg-white/90 backdrop-blur-sm text-[#3C2A1E]/30 hover:text-[#C9A962]"
            }`}
          >
            <Heart size={14} className={isInWishlist(id) ? "fill-white" : ""} />
          </button>

          {/* Product Image */}
          <Image
            src={isHovered && hoverImage ? (hoverImage.startsWith('http') ? hoverImage : buildImageUrl(hoverImage)) : (image.startsWith('http') ? image : buildImageUrl(image))}
            alt={name}
            fill
            className="object-cover transition-transform duration-[2s] ease-out group-hover/card:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />

          {/* Out of Stock / Low Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-[1.5rem] flex items-center justify-center z-20">
              <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">Out of Stock</span>
            </div>
          )}
          {isLowStock && (
            <div className="absolute bottom-10 left-3 z-20">
              <span className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">Only {stock} left</span>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-all duration-500 ${i === 0 ? "bg-white w-3" : "bg-white/40"}`} />
            ))}
          </div>
        </div>

        {/* Content Area - Compact & Royal Colors */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-serif font-black text-[#3C2A1E] tracking-tight truncate leading-tight">
                {name}
              </h3>
              <div className="flex items-center gap-1 bg-[#F1F9F7] px-1.5 py-0.5 rounded-full border border-[#E0F2F1] shrink-0">
                <Star className="h-2.5 w-2.5 fill-[#00897B] text-[#00897B]" />
                <span className="text-[8px] font-bold text-[#00897B]">{rating}</span>
                <div className="w-px h-2 bg-[#00897B]/20" />
                <span className="text-[8px] font-bold text-[#00897B]/60">{reviewsCount}</span>
              </div>
            </div>
            {/* <p className="text-[10px] text-[#C9A962] font-black uppercase tracking-widest line-clamp-1">
              {typeof category === 'object' ? category.name : (category || categoryId || "Bespoke Decor")}
            </p> */}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#3C2A1E]">₹{price.toLocaleString()}</span>
            {originalPrice && (
              <>
                <span className="text-[10px] text-[#3C2A1E]/20 line-through font-bold">₹{originalPrice.toLocaleString()}</span>
                <span className="text-[10px] font-black text-[#C9A962] uppercase">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="mt-auto pt-1">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding || isOutOfStock}
              className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-700 relative overflow-hidden shadow-lg shadow-[#3C2A1E]/5 group/btn ${
                isOutOfStock ? "bg-primary/20 text-primary/40 cursor-not-allowed" :
                isAdding ? "bg-emerald-500 text-white" : "bg-[#3C2A1E] text-white hover:bg-[#C9A962] hover:text-[#3C2A1E]"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isOutOfStock ? "Out of Stock" : isAdding ? "Added" : "Add to Cart"}
                {!isAdding && !isOutOfStock && <ShoppingBag size={12} className="group-hover/btn:translate-x-1 transition-transform" />}
              </span>
              {!isOutOfStock && <div className="absolute inset-0 bg-[#C9A962] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
