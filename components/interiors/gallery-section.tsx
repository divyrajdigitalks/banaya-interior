"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryService, type GalleryImage } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

const DEFAULT_GALLERY = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
    title: "The Royal Lounge",
    subtitle: "Living Room",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    title: "Velvet Dreams",
    subtitle: "Bedroom",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    title: "Zen Oasis",
    subtitle: "Courtyards",
  },
];

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [dragX, setDragX] = useState(0);

  const totalItems = galleryImages.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await galleryService.getGalleryList(true);
        setGalleryImages(data.length > 0 ? data : DEFAULT_GALLERY);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && totalItems > 0) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, totalItems]);

  if (loading) return null;

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
    setDragX(0);
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[12vw] font-black tracking-tighter whitespace-nowrap">
          Portfolio
        </span>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 md:px-12 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-px bg-gold" />
              <span className="text-xs tracking-tight text-gold font-bold">Curated Spaces</span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl text-primary font-black leading-tight">
              A Glimpse of <br />
              <span className="italic font-light text-gold transition-all duration-700">
                {galleryImages[currentIndex].subtitle || "Gallery"}.
              </span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Removed controls as per user request */}
          </div>
        </div>
      </div>

      {/* Gallery Slider - Infinite Loop Logic */}
      <div className="relative overflow-visible px-4 select-none">
        <div className="flex justify-center items-center h-[550px]">
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            {galleryImages.map((image, index) => {
              // Calculate relative position for the loop effect
              let position = index - currentIndex;
              
              // Handle wrap-around for infinite look
              if (position < -Math.floor(totalItems / 2)) position += totalItems;
              if (position > Math.floor(totalItems / 2)) position -= totalItems;

              const isActive = position === 0;
              const isVisible = Math.abs(position) <= 2; // Show 2 on each side

              if (!isVisible) return null;

              return (
                <motion.div
                  key={image.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  initial={false}
                  animate={{
                    x: position * 340, // Increased distance slightly
                    scale: isActive ? 1.2 : 0.8, // More dramatic scaling
                    opacity: isActive ? 1 : 0.3, // Less opacity for background items
                    zIndex: isActive ? 30 : 20 - Math.abs(position),
                    filter: isActive ? "grayscale(0%) blur(0px)" : "grayscale(100%) blur(2px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180, // Slightly softer spring
                    damping: 20,
                  }}
                  className="absolute w-[300px] md:w-[380px] h-[450px] md:h-[550px] cursor-grab active:cursor-grabbing"
                  onClick={() => {
                    if (isActive) return;
                    setCurrentIndex(index);
                  }}
                >
                  <div className="relative w-full h-full group overflow-hidden rounded-3xl shadow-2xl border border-charcoal/10 bg-charcoal/5">
                    <img
                      src={buildImageUrl(image.src) || image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
                    />
                    
                    {/* Overlay Content for Active Item */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 30 }}
                          className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/20 to-transparent flex flex-col justify-end p-10"
                        >
                          {image.subtitle && (
                            <motion.span 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[11px] font-bold tracking-tight text-gold mb-3 block italic"
                            >
                              {image.subtitle}
                            </motion.span>
                          )}
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white font-serif text-3xl md:text-4xl mb-8 font-black tracking-tight"
                          >
                            {image.title}
                          </motion.h3>
                        
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active Border Glow */}
                    {isActive && (
                      <motion.div
                        layoutId="activeGalleryBorder"
                        className="absolute inset-0 border-2 border-gold/40 rounded-3xl pointer-events-none z-40 shadow-[inset_0_0_50px_rgba(212,175,55,0.2)]"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="container mx-auto px-8 mt-12 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center gap-3">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                }}
                className="group relative py-2"
              >
                <motion.div 
                  animate={{
                    width: index === currentIndex ? 32 : 8,
                    backgroundColor: index === currentIndex ? "#D4AF37" : "rgba(0,0,0,0.1)",
                  }}
                  className="h-1 rounded-full transition-colors duration-500"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
