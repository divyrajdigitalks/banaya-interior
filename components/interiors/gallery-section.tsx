"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Play, Pause } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
    category: "Living Room",
    title: "The Royal Lounge",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    category: "Bedroom",
    title: "Velvet Dreams",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    category: "Courtyards",
    title: "Zen Oasis",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    category: "Kitchen",
    title: "Culinary Studio",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "Wardrobe",
    title: "The Style Vault",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    category: "Dining",
    title: "Grand Banquet",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    category: "Study",
    title: "The Thinker's Den",
  },
];

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [dragX, setDragX] = useState(0);
  const totalItems = galleryImages.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
    setDragX(0);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[12vw] font-black tracking-tighter uppercase whitespace-nowrap">
          Portfolio
        </span>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 md:px-12 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-gold" />
              <span className="text-gold text-[8px] font-black uppercase tracking-[0.4em]">
                Exquisite Spaces
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-charcoal leading-tight font-black tracking-tighter">
              Objects of <span className="italic font-light text-gold">Desire</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-12 h-12 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-500 group mr-4"
              title={isAutoPlaying ? "Pause" : "Play"}
            >
              {isAutoPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            <button 
              onClick={() => {
                handlePrev();
                setIsAutoPlaying(false);
              }}
              className="w-12 h-12 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal hover:text-white transition-all duration-500 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                handleNext();
                setIsAutoPlaying(false);
              }}
              className="w-12 h-12 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal hover:text-white transition-all duration-500 group"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
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
                    setIsAutoPlaying(false);
                  }}
                >
                  <div className="relative w-full h-full group overflow-hidden rounded-3xl shadow-2xl border border-charcoal/10 bg-charcoal/5">
                    <img
                      src={image.src}
                      alt={image.category}
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
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-3"
                          >
                            {image.category}
                          </motion.span>
                          <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white font-serif text-3xl md:text-4xl mb-8 font-black tracking-tight"
                          >
                            {image.title}
                          </motion.h3>
                          <button className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-charcoal hover:scale-110 transition-transform shadow-lg group/btn">
                            <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                          </button>
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
                  setIsAutoPlaying(false);
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
