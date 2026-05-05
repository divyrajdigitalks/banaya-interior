"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  Wine, 
  Lamp, 
  Home, 
  Box, 
  Gift, 
  Pencil,
  ChevronDown,
  ArrowRight,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const categories = [
  {
    id: "serveware",
    title: "Serveware",
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80",
    subItems: [
      "Serving Trays",
      "Platters & Boards",
      "Snack & Dip Trays",
      "Beverage Serving",
      "Speciality Trays",
      "Hosting Essentials"
    ]
  },
  {
    id: "bar-essentials",
    title: "Bar Essentials",
    icon: Wine,
    image: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=400&q=80",
    subItems: [
      "Shot & Cocktail Trays",
      "Drink Serving Boards",
      "Bar Accessories",
      "Party Sets"
    ]
  },
  {
    id: "lighting",
    title: "Lighting",
    icon: Lamp,
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400&q=80",
    subItems: [
      "Table Lamps",
      "Wall Lights",
      "Pendant Lights",
      "Ambient Lighting"
    ]
  },
  {
    id: "home-decor",
    title: "Home Decor",
    icon: Home,
    image: "https://images.unsplash.com/photo-1513519247388-4e2645d48d62?w=400&q=80",
    subItems: [
      "Table Decor",
      "Vanity & Styling",
      "Candle & Accent",
      "Wall Decor",
      "Minimal Living"
    ]
  },
  {
    id: "organisers",
    title: "Organisers",
    icon: Box,
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&q=80",
    subItems: [
      "Vanity Organisers",
      "Kitchen Organisers",
      "Desk Organisers",
      "Utility Organisers",
      "Table Organisers"
    ]
  },
  {
    id: "gifting",
    title: "Gifting",
    icon: Gift,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
    subItems: [
      "Gift Sets",
      "Festive Gifting",
      "Corporate Gifting",
      "Custom Hampers"
    ]
  },
  {
    id: "customisation",
    title: "Customisation",
    icon: Pencil,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
    subItems: [
      "Engraving",
      "Name Boards",
      "Logo Trays",
      "Bulk Orders"
    ]
  }
];

export function MegaMenu() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="w-full bg-[#fdf9f3] border-b border-primary/5">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-center gap-2 md:gap-8 overflow-x-auto no-scrollbar py-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(activeTab === cat.id ? null : cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap group ${
                activeTab === cat.id ? "bg-primary text-white" : "text-primary/60 hover:text-primary"
              }`}
            >
              <cat.icon size={16} strokeWidth={1.5} className={activeTab === cat.id ? "text-white" : "group-hover:text-gold"} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{cat.title}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${activeTab === cat.id ? "rotate-180" : ""}`} />
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 bg-[#fdf9f3]/98 backdrop-blur-2xl z-[60] border-b border-primary/10 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-4xl mx-auto">
                {categories.filter(cat => cat.id === activeTab).map((cat) => (
                  <div 
                    key={cat.id} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-16 animate-in fade-in slide-in-from-top-4 duration-500"
                  >
                    <div className="space-y-8">
                      <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {cat.subItems.map((item) => (
                          <li key={item}>
                            <Link 
                              href={`/shop?category=${cat.title}&sub=${item}`}
                              onClick={() => setActiveTab(null)}
                              className="text-sm text-primary/60 hover:text-gold transition-colors duration-300 flex items-center gap-2 group/item"
                            >
                              <div className="w-1.5 h-px bg-gold scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left" />
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-8">
                        <Link href="/shop" onClick={() => setActiveTab(null)}>
                          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-gold transition-all group">
                            Explore All {cat.title} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                      <div className="absolute bottom-8 left-8">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Featured Collection</p>
                        <p className="text-white text-xl font-serif font-black tracking-tight">{cat.title} Essentials</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-primary/5 flex justify-center">
                <button 
                  onClick={() => setActiveTab(null)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 hover:text-primary transition-all flex items-center gap-2"
                >
                  <X size={14} /> Close Menu
                </button>
              </div>
            </div>
            {/* Click outside to close */}
            <div className="fixed inset-0 -z-10" onClick={() => setActiveTab(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
