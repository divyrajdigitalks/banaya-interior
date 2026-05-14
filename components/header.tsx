"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Search, User, LogOut, Package } from "lucide-react";
import { MegaMenu } from "./mega-menu";
import { useStore } from "@/context/StoreContext";
import { useUser } from "@/context/UserContext";

interface HeaderProps {
  variant?: "dark" | "light" | "transparent";
}

export function Header({ variant = "dark" }: HeaderProps) {
  const pathname = usePathname();
  const { cart, wishlist } = useStore();
  const { user, logout } = useUser();
  
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

  const interiorNavLinks = [
    { name: "HOME", href: "/interiors" },
    { name: "ABOUT US", href: "/interiors/about" },
    { name: "SERVICES", href: "/interiors#services" },
    { name: "PROJECTS", href: "/interiors/projects" },
    { name: "COST CALCULATOR", href: "/interiors/cost-calculator" },
    { name: "PROCESS", href: "/interiors#process" },
    { name: "BLOG", href: "#" },
    { name: "CONTACT US", href: "#contact" },
  ];

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar / Bonus Claim */}
    <motion.div 
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className="bg-[#020e23] py-2 px-4 text-center"
>
  <p className="text-[11px] md:text-xs font-bold tracking-tight text-white flex items-center justify-center gap-2">
    
    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
    
    {isInteriorsPage 
      ? 'Free Consultation Available | Book Now & Get Expert Advice for Your Dream Home!' 
      : 'Claim Your Exclusive Royal Bonus - Limited Time Offer'
    }
    
    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
    
  </p>
</motion.div>

      <header className={`transition-all duration-500 bg-[#fdf9f3] border-b border-primary/5 shadow-sm`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 md:h-24 gap-8">
            {/* Left: Logo Only */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Logo variant="dark" className="scale-90 md:scale-100 cursor-pointer" asChild />
              </Link>
            </div>

            {/* Center: Search Bar (Hidden on interiors page) */}
            <div className={`flex-1 max-w-xl hidden md:block ${isInteriorsPage ? '!hidden' : ''}`}>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search for masterpieces..."
                  className="w-full bg-white border border-primary/10 rounded-full py-3 px-6 pl-12 text-sm text-primary focus:outline-none focus:border-gold/50 focus:bg-white transition-all placeholder:text-primary/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-gold transition-colors" size={18} />
              </div>
            </div>

            {/* Right: Icons & Nav Links */}
            <div className="flex items-center justify-end gap-6 md:gap-8 flex-shrink-0">
              <div className="hidden lg:flex items-center gap-6">
                {isInteriorsPage && interiorNavLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-[10px] font-black tracking-widest text-primary/60 hover:text-gold transition-colors whitespace-nowrap"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {!isInteriorsPage && (
              <div className="flex items-center gap-8 text-primary">
                  {user ? (
                    <div className="flex items-center gap-6">
                      <Link 
                        href="/profile" 
                        className="relative group flex flex-col items-center gap-1.5 transition-all duration-300 hover:text-gold"
                      >
                        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-[10px] font-black border border-gold/20 uppercase">
                          {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </div>
                        <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase max-w-[60px] truncate">{user.name || user.username || 'User'}</span>
                      </Link>

                      <Link 
                        href="/profile/orders" 
                        className="relative group hover:text-gold transition-all duration-300 flex flex-col items-center gap-1.5"
                      >
                        <Package size={20} strokeWidth={1.5} />
                        <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase">Orders</span>
                      </Link>

                      <button 
                        onClick={logout}
                        className="relative group hover:text-gold transition-all duration-300 flex flex-col items-center gap-1.5"
                      >
                        <LogOut size={20} strokeWidth={1.5} />
                        <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      className={`relative group hover:text-gold transition-all duration-300 flex flex-col items-center gap-1.5`}
                    >
                      <User size={22} strokeWidth={1.5} />
                      <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase">Login</span>
                    </Link>
                  )}

                  <Link 
                    href="/wishlist" 
                    className={`relative group hover:text-gold transition-all duration-300 flex flex-col items-center gap-1.5`}
                  >
                    <div className="relative">
                      <Heart size={22} strokeWidth={1.5} />
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-primary text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#fdf9f3]">
                          {wishlist.length}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase">Wishlist</span>
                  </Link>
                  
                  <Link 
                    href="/cart" 
                    className={`relative group hover:text-gold transition-all duration-300 flex flex-col items-center gap-1.5`}
                  >
                    <div className="relative">
                      <ShoppingBag size={22} strokeWidth={1.5} />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-primary text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#fdf9f3]">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase">Cart</span>
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>
      {showMegaMenu && <MegaMenu />}
    </div>
  );
}
