"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Palette, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Shop Inventory", icon: ShoppingBag, href: "/admin/shop" },
  { name: "Interior Design", icon: Palette, href: "/admin/interiors" },
  { name: "Decor Collection", icon: Sparkles, href: "/admin/decor" },
  { name: "Calculators", icon: Calculator, href: "/admin/calculators" },
  { name: "Inquiries", icon: Users, href: "/admin/inquiries" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsMobile(true);
      } else {
        setIsSidebarOpen(true);
        setIsMobile(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-warm-cream flex">
      {/* ── Sidebar ── */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed lg:sticky top-0 h-screen z-50 w-72 bg-charcoal text-white border-r border-white/5 flex flex-col shadow-2xl ${isMobile ? 'shadow-black/50' : ''}`}
          >
            {/* Sidebar Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <Link href="/admin">
                <Logo variant="light" />
              </Link>
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-hide">
              <p className="text-xs text-white/40 font-medium mb-4 ml-2">Main Menu</p>
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${
                      isActive 
                        ? "bg-gold text-charcoal shadow-lg shadow-gold/20 font-medium" 
                        : "text-white/50 hover:text-white hover:bg-white/5 font-normal"
                    }`}
                  >
                    <link.icon size={18} className={isActive ? "text-charcoal" : "text-white/30 group-hover:text-gold transition-colors"} />
                    <span className="text-sm">{link.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-charcoal"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-white/5 space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <Users size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-white/40">Super Admin</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/admin/login")}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-500 font-normal group"
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-charcoal/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-charcoal text-white rounded-2xl shadow-xl">
                <Menu size={20} />
              </button>
            )}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-charcoal/40 font-medium">Sanctuary</span>
              <ChevronRight size={12} className="text-charcoal/20" />
              <span className="text-xs text-charcoal font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
              <Input 
                placeholder="Search..." 
                className="bg-warm-cream/50 border-charcoal/5 rounded-full pl-11 pr-4 py-2 text-sm font-normal w-64 focus:ring-2 focus:ring-gold/5 focus:border-gold/20"
              />
            </div>
            <button className="p-3 hover:bg-warm-cream rounded-2xl transition-colors relative">
              <Bell size={20} className="text-charcoal" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-[1px] bg-charcoal/5 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-2xl bg-charcoal flex items-center justify-center text-white text-xs font-medium shadow-xl">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide bg-warm-cream/30">
          {children}
        </main>
      </div>
    </div>
  );
}
