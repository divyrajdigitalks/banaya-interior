"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Search, User, ShoppingCart } from "lucide-react";
import { MegaMenu } from "./mega-menu";
import { useStore } from "@/context/StoreContext";

interface HeaderProps {
  variant?: "dark" | "light" | "transparent";
}

export function Header({ variant = "dark" }: HeaderProps) {
  const pathname = usePathname();
  const { cart } = useStore();
  
  const bgClass = variant === "transparent" 
    ? "bg-transparent" 
    : variant === "light" 
      ? "bg-background/80 backdrop-blur-md border-b border-primary/5" 
      : "bg-primary/95 backdrop-blur-md border-b border-white/5";
  
  const textColor = variant === "light" ? "text-primary" : "text-white";
  const iconColor = variant === "light" ? "text-primary" : "text-white";
  const logoVariant = variant === "light" ? "dark" : "light";

  const isInteriorsPage = pathname.startsWith("/interiors");
  const showMegaMenu = pathname.includes("/shop") || pathname.includes("/product");

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar / Bonus Claim */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gold py-2 px-4 text-center"
      >
        <p className="text-[11px] md:text-xs font-bold tracking-tight text-primary flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Claim Your Exclusive Royal Bonus - Limited Time Offer
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </p>
      </motion.div>

      <header className={`transition-all duration-500 ${bgClass}`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left: Empty div to balance the layout */}
            <div className="flex-1 lg:flex hidden items-center gap-10">
              {/* Optional: Add minimal nav if needed later, currently empty to focus on center logo and right icons */}
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0">
              <Logo variant={logoVariant} className="scale-90 md:scale-100" />
            </div>

            {/* Right: Shop, Wishlist & Cart Icons */}
            <div className="flex items-center justify-end gap-6 md:gap-10 flex-1">
              {!isInteriorsPage && (
                <>
                  <Link 
                    href="/wishlist" 
                    className={`relative group ${iconColor} hover:text-gold transition-colors duration-300 flex items-center gap-2`}
                  >
                    <Heart size={20} strokeWidth={1.5} />
                    <span className="text-[11px] font-bold tracking-tight hidden sm:block">Wishlist</span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  
                  <Link 
                    href="/cart" 
                    className={`relative group ${iconColor} hover:text-gold transition-colors duration-300 flex items-center gap-2`}
                  >
                    <div className="relative">
                      <ShoppingBag size={20} strokeWidth={1.5} />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold text-primary text-[8px] font-bold rounded-full flex items-center justify-center border border-primary/10">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold tracking-tight hidden sm:block">Cart</span>
                  </Link>

                  <Link 
                    href="/shop" 
                    className={`relative group ${iconColor} hover:text-gold transition-colors duration-300 flex items-center gap-2`}
                  >
                    <div className="relative">
                      <ShoppingCart size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight hidden sm:block">Shop</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mega Menu Navigation Bar - Only for Decor/Shop */}
        {showMegaMenu && (
          <div className="hidden lg:block">
            <MegaMenu />
          </div>
        )}
      </header>
    </div>
  );
}
