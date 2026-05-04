"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, LucideIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdminGridCardProps {
  id: string;
  name: string;
  image: string;
  category?: string;
  price?: number;
  icon: LucideIcon;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}

export function AdminGridCard({ 
  name, 
  image, 
  category, 
  price, 
  icon: Icon, 
  onEdit, 
  onDelete, 
  index 
}: AdminGridCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden rounded-[2rem] border-charcoal/5 bg-white hover:shadow-2xl hover:shadow-charcoal/10 transition-all duration-700">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image 
              src={image} 
              alt={name}
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            {price !== undefined && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-gold text-charcoal text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  ₹{price.toLocaleString()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
              <Button 
                size="icon"
                onClick={onEdit}
                className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur text-charcoal hover:bg-gold hover:text-white transition-all"
              >
                <Edit2 size={18} />
              </Button>
              <Button 
                size="icon"
                onClick={onDelete}
                className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur text-charcoal hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
          <div className="p-8 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-charcoal group-hover:text-gold transition-colors">{name}</h3>
              <div className="p-3 rounded-xl bg-gold/5 text-gold">
                <Icon size={18} />
              </div>
            </div>
            {category && (
              <p className="text-xs font-bold tracking-tight text-gold/60">{category}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
