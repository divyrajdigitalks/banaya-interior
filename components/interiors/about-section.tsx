"use client";

import { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Truck, ArrowRight, Award, Users, Clock, Shield, Palette, Home, Star, Heart, CheckCircle, Zap, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { aboutService, type AboutSection as AboutSectionType, type AboutSectionSettings } from "@/lib/api";
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
  Sparkles,
  ShieldCheck,
  Truck,
};

const DEFAULT_ABOUT_DATA: AboutSectionType = {
  id: "1",
  sectionType: "story",
  title: "Design with Purpose. Executed with Precision.",
  subtitle: "Our philosophy and approach",
  description: "Banaya Interdsdsiors transforms spaces into legacies. We don't just design rooms; we curate experiences that resonate with your heritage and aspirations.",
  features: [
    { 
      iconId: "Sparkles", 
      title: "Artisanal Mastery", 
      description: "Hand-finished by master craftsmen with generations of experience."
    },
    { 
      iconId: "ShieldCheck", 
      title: "Legacy Quality", 
      description: "Uncompromising standards with a 25-year structural guarantee."
    },
    { 
      iconId: "Truck", 
      title: "White Glove", 
      description: "Complimentary premium delivery and professional installation."
    },
  ],
  stats: [
    { label: "Bespoke Sanctuaries Crafted", value: "20+", suffix: "" }
  ],
  isActive: true,
  sortOrder: 0,
  createdAt: "",
  updatedAt: ""
};

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutSectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionSettings, setSectionSettings] = useState<AboutSectionSettings>({
    title: "Design with Purpose. Executed with Precision.",
    subtitle: "Our philosophy and approach",
    description: "Banaya Interiors transforms spaces into legacies. We don't just design rooms; we curate experiences that resonate with your heritage and aspirations.",
    primaryImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    circularImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
    statsValue: "20+",
    statsLabel: "Bespoke Sanctuaries Crafted",
    isActive: true
  });

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const [aboutApiData, settingsData] = await Promise.all([
          aboutService.getAboutSectionsByType('story'),
          aboutService.getSectionSettings()
        ]);
        
        setAboutData(aboutApiData.length > 0 ? aboutApiData[0] : DEFAULT_ABOUT_DATA);
        setSectionSettings(settingsData);
        
        console.log('Loaded about section settings in component:', settingsData);
      } catch (error) {
        console.error('Error loading about data:', error);
        setAboutData(DEFAULT_ABOUT_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center justify-center h-64">
            <p className="text-primary/40">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-warm-cream/30 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          {/* Left: Dynamic Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 pt-12"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group">
                  <Image
                    src={sectionSettings.primaryImage.startsWith('http') ? sectionSettings.primaryImage : buildImageUrl(sectionSettings.primaryImage)}
                    alt={sectionSettings.title || "Interior Detail"}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                </div>
                <div className="bg-gold p-8 rounded-[2rem] text-white space-y-2 shadow-xl">
                  <span className="text-4xl font-serif font-black">{sectionSettings.statsValue}</span>
                  <p className="text-xs font-semibold opacity-80">
                    {sectionSettings.statsLabel.split(' ').map((word, i) => (
                      <span key={i}>
                        {word}{i < sectionSettings.statsLabel.split(' ').length - 1 && (i + 1) % 2 === 0 ? ' ' : ' '}
                        {(i + 1) % 2 === 0 && i < sectionSettings.statsLabel.split(' ').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group">
                  <Image
                    src={sectionSettings.secondaryImage.startsWith('http') ? sectionSettings.secondaryImage : buildImageUrl(sectionSettings.secondaryImage)}
                    alt={sectionSettings.subtitle || "Luxury Dining"}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                </div>
                <div className="relative aspect-square rounded-full overflow-hidden border-8 border-background shadow-2xl group">
                  <Image
                    src={sectionSettings.circularImage.startsWith('http') ? sectionSettings.circularImage : buildImageUrl(sectionSettings.circularImage)}
                    alt="Artisan Detail"
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:rotate-12 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            </div>

            {/* Background text decoration */}
            <div className="absolute -bottom-10 -left-10 text-[10vw] font-serif font-black text-primary/[0.02] pointer-events-none select-none -z-10">
              EST. 2024
            </div>
          </div>

          {/* Right: Content & Features */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              {sectionSettings.subtitle && (
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-lg font-serif font-bold block"
                >
                  {sectionSettings.subtitle}
                </motion.span>
              )}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-5xl md:text-6xl text-primary font-black leading-tight"
                dangerouslySetInnerHTML={{ 
                  __html: sectionSettings.title.replace(/\./g, '.<span class="font-bold text-gold">.</span>') 
                }}
              />
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-primary/50 text-lg font-light leading-relaxed max-w-xl"
              >
                {sectionSettings.description}
              </motion.p>
            </div>

            {/* Premium Features List */}
            {sectionSettings.features && sectionSettings.features.length > 0 && (
              <div className="space-y-8">
                {sectionSettings.features.map((feature, index) => {
                  const Icon = ICONS[feature.iconId] || Sparkles;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex gap-8 items-start cursor-default"
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-warm-cream flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-gold/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-primary mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-primary/40 text-sm leading-relaxed max-w-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="pt-8">
              <button className="group relative px-12 py-6 bg-primary text-white text-xs font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700">
                <span className="relative z-10 flex items-center gap-4 tracking-widest">
                  Explore Our Legacy <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
