"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./image-upload";
import { Label } from "@/components/ui/label";

interface MultiImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

export function MultiImageUpload({ value, onChange, label }: MultiImageUploadProps) {
  const handleAdd = () => {
    onChange([...value, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, url: string) => {
    const newImages = [...value];
    newImages[index] = url;
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && (
          <Label className="text-xs font-bold tracking-tight text-charcoal/40">
            {label}
          </Label>
        )}
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleAdd}
          className="text-gold hover:text-gold hover:bg-gold/5 text-xs font-bold"
        >
          <Plus size={14} className="mr-1" /> Add Image
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {value.map((url, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <ImageUpload 
                value={url} 
                onChange={(newUrl) => handleChange(index, newUrl)} 
              />
              {value.length > 1 && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg z-10"
                >
                  <X size={12} />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
