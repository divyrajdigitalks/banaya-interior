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
  ArrowRight
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
    <div className="w-full bg-background border-b border-primary/5">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-center gap-2 md:gap-8 overflow-x-auto no-scrollbar py-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap group ${
                activeTab === cat.id ? "bg-primary/5 text-primary" : "text-primary/60 hover:text-primary"
              }`}
            >
              <cat.icon size={16} strokeWidth={1.5} className="group-hover:text-gold transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{cat.title}</span>
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
            onMouseLeave={() => setActiveTab(null)}
            className="absolute left-0 right-0 bg-background/95 backdrop-blur-xl z-[60] border-b border-primary/10 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-7 gap-8">
                {categories.map((cat) => (
                  <div key={cat.id} className={`space-y-6 ${activeTab === cat.id ? "opacity-100" : "opacity-40"}`}>
                    <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
                      <cat.icon size={18} className="text-gold" />
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{cat.title}</h4>
                    </div>
                    
                    <ul className="space-y-3">
                      {cat.subItems.map((item) => (
                        <li key={item}>
                          <Link 
                            href={`/shop?category=${cat.title}&sub=${item}`}
                            className="text-xs text-primary/60 hover:text-gold transition-colors duration-300 block font-medium"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/20 group-hover:opacity-0 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-primary/5 flex justify-center">
                <Link href="/shop">
                  <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-gold transition-all group">
                    View Entire Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
