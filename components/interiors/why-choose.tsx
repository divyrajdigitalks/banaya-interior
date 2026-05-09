"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Wallet,
  ShieldCheck,
  Headphones,
  Clock,
  Award,
  Users,
  Shield,
  Palette,
  Home,
  Star,
  Heart,
  CheckCircle,
  Zap,
  Sparkles,
  Truck,
  LucideIcon,
} from "lucide-react";
import { whyChooseService, type WhyChooseItem, type WhyChooseSectionSettings } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

const ICONS: Record<string, LucideIcon> = {
  Award,
  Users,
  Clock,
  Shield,
  Palette,
  Home,
  Star,
  Heart,
  CheckCircle,
  Zap,
  User,
  Wallet,
  ShieldCheck,
  Headphones,
  Sparkles,
  Truck,
};

const DEFAULT_FEATURES = [
  {
    id: "1",
    iconId: "User",
    title: "Personalized Designs",
    description: "Designed around your lifestyle & needs",
    isActive: true,
    sortOrder: 0,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "2",
    iconId: "Wallet",
    title: "Transparent Pricing",
    description: "No hidden costs, complete clarity",
    isActive: true,
    sortOrder: 1,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "3",
    iconId: "ShieldCheck",
    title: "Premium Quality",
    description: "High-quality materials & craftsmanship",
    isActive: true,
    sortOrder: 2,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "4",
    iconId: "Headphones",
    title: "End-to-End Support",
    description: "From design to installation",
    isActive: true,
    sortOrder: 3,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "5",
    iconId: "Clock",
    title: "Timely Delivery",
    description: "On-time project completion",
    isActive: true,
    sortOrder: 4,
    createdAt: "",
    updatedAt: ""
  },
];

export function WhyChooseSection() {
  const [whyChooseItems, setWhyChooseItems] = useState<WhyChooseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionSettings, setSectionSettings] = useState<WhyChooseSectionSettings>({
    title: "Why Choose Banaya Interiors?",
    subtitle: "The Banaya Advantage",
    sectionImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: true
  });
  const [imageKey, setImageKey] = useState(0); // Force image refresh

  useEffect(() => {
    const loadWhyChooseItems = async () => {
      try {
        const [itemsData, settingsData] = await Promise.all([
          whyChooseService.getWhyChooseList(),
          whyChooseService.getSectionSettings()
        ]);
        
        console.log('Loaded section settings in component:', settingsData);
        setWhyChooseItems(itemsData.length > 0 ? itemsData : DEFAULT_FEATURES);
        setSectionSettings(settingsData);
        setImageKey(prev => prev + 1); // Force image refresh
      } catch (error) {
        console.error('Error loading why choose data:', error);
        setWhyChooseItems(DEFAULT_FEATURES);
      } finally {
        setLoading(false);
      }
    };

    loadWhyChooseItems();
  }, []);

  if (loading) {
    return (
      <section className="py-18 bg-[#faf7f2] overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="flex items-center justify-center h-64">
            <p className="text-primary/40">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-18 bg-[#faf7f2] overflow-hidden relative">
      
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full border border-primary" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full border border-primary" />
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-12">
            
            <div className="space-y-3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-gold font-semibold text-[11px] uppercase tracking-[0.25em] block"
              >
                {sectionSettings.subtitle}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-serif font-medium text-primary leading-tight"
              >
                {sectionSettings.title.split(' ').slice(0, 2).join(' ')} <br />
                <span className="text-gold font-semibold">
                  {sectionSettings.title.split(' ').slice(2).join(' ')}
                </span>
              </motion.h2>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {whyChooseItems.map((feature, idx) => {
                const Icon = ICONS[feature.iconId] || User;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex gap-4 group"
                  >
                    {feature.image ? (
                      <div className="shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-gold/30 shadow-sm group-hover:shadow-md transition duration-300">
                        <Image
                          src={buildImageUrl(feature.image) || feature.image}
                          alt={feature.title}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 w-11 h-11 rounded-lg bg-white flex items-center justify-center text-gold border border-gold/30 shadow-sm group-hover:bg-gold group-hover:text-white transition duration-300">
                        <Icon size={20} strokeWidth={1.8} />
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                        {feature.title}
                      </h4>

                      <p className="text-sm text-primary/70 font-normal leading-relaxed max-w-[240px]">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-[420px] relative"
          >
            
            {/* Frame */}
            <div className="absolute -inset-3 border border-gold/30 rounded-[2rem] translate-x-2 translate-y-2" />

            <div className="relative aspect-[4/5] rounded-[1.8rem] overflow-hidden shadow-xl">
              
              <Image
                src={sectionSettings.sectionImage}
                alt="Interiors Showcase"
                fill
                className="object-cover transition-transform duration-[2.5s] hover:scale-105"
                key={`section-image-${imageKey}`} // Force re-render when image changes
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Quote */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <p className="text-white text-sm font-normal italic leading-relaxed">
                  "Excellence is not an act, but a habit. We design spaces that feel as good as they look."
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}