"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Calculator,
  Layers,
  Grid,
  Package,
  FolderTree,
  Briefcase,
  GalleryHorizontal,
  IndianRupee,
  PenTool,
  Library,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider, useAdmin } from "@/context/AdminContext";

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { type: "label", name: "Decor Management" },
  { name: "Decor Hero", icon: GalleryHorizontal, href: "/admin/decor/hero" },
  { name: "Decor Features", icon: Sparkles, href: "/admin/decor/features" },
  { name: "Decor Categories", icon: Layers, href: "/admin/categories" },
  { name: "Decor Subcategories", icon: Grid, href: "/admin/subcategories" },
  { name: "Filter Options", icon: Filter, href: "/admin/filter-options" },
  { name: "Decor Products", icon: Package, href: "/admin/products" },
  { type: "label", name: "Interiors Management" },
  { name: "Interior Hero", icon: GalleryHorizontal, href: "/admin/interiors/hero" },
  { name: "Interior Services", icon: Briefcase, href: "/admin/interiors/services" },
  { name: "Interior Categories", icon: FolderTree, href: "/admin/interiors/categories" },
  { name: "Interior Projects", icon: Briefcase, href: "/admin/interiors/projects" },
  { name: "Living Masterpieces", icon: Sparkles, href: "/admin/interiors/legacy-projects" },
  { name: "Interior Gallery", icon: GalleryHorizontal, href: "/admin/interiors/gallery" },
  { name: "Interior Collections", icon: Library, href: "/admin/interiors/collections" },
  { name: "Interior Testimonials", icon: Users, href: "/admin/interiors/testimonials" },
  { name: "Interior Process", icon: PenTool, href: "/admin/interiors/process" },
  { name: "Interior Cost Guide", icon: IndianRupee, href: "/admin/interiors/cost-guide" },
  { name: "Why Choose Us", icon: Sparkles, href: "/admin/interiors/why-choose" },
  { name: "About Sections", icon: Users, href: "/admin/interiors/about" },
  { type: "label", name: "Promotions" },
  { name: "Offers", icon: Sparkles, href: "/admin/offers" },
  { name: "Coupons", icon: ShoppingBag, href: "/admin/coupons" },
  { type: "label", name: "System" },
  { name: "Calculators", icon: Calculator, href: "/admin/calculators" },
  { name: "Inquiries", icon: Users, href: "/admin/inquiries" },
  { name: "Admins", icon: Users, href: "/admin/admins" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAdmin();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Get current page name from pathname
  const getCurrentPageName = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && segments[0] === 'admin') return 'Dashboard';
    
    if (pathname.includes('/interiors/hero')) return 'Interior Hero Management';
    if (pathname.includes('/decor/hero')) return 'Decor Hero Management';
    if (pathname.includes('/decor/features')) return 'Decor Features Management';
    if (pathname.includes('/products/add')) return 'Add New Product';
    
    const lastSegment = segments[segments.length - 1];
    
    return lastSegment
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  // Hide layout for login page or show loading
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-charcoal/30 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-charcoal/30 text-lg font-medium">Redirecting to login...</div>
      </div>
    );
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
            <nav className="flex-1 overflow-y-auto p-6 space-y-1 scrollbar-hide">
              {sidebarLinks.map((link, i) => {
                if ('type' in link && link.type === "label") {
                  return (
                    <p key={i} className="px-5 pt-6 pb-2 text-[11px] font-bold tracking-tight text-white/30">
                      {link.name}
                    </p>
                  );
                }
                
                const navLink = link as { name: string; icon: any; href: string };
                const isActive = pathname === navLink.href;
                
                return (
                  <Link
                    key={navLink.href}
                    href={navLink.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${
                      isActive 
                        ? "bg-gold text-charcoal shadow-lg shadow-gold/20 font-medium" 
                        : "text-white/50 hover:text-white hover:bg-white/5 font-normal"
                    }`}
                  >
                    <navLink.icon size={18} className={isActive ? "text-charcoal" : "text-white/30 group-hover:text-gold transition-colors"} />
                    <span className="text-sm">{navLink.name}</span>
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
                  <p className="text-sm font-medium text-white">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-white/40">{user?.role || 'Super Admin'}</p>
                </div>
              </div>
              <button 
                onClick={logout}
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
              <span className="text-sm text-charcoal font-bold tracking-tight">{getCurrentPageName()}</span>
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
                {user?.username?.substring(0, 2).toUpperCase() || 'AU'}
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster />
    </AdminProvider>
  );
}