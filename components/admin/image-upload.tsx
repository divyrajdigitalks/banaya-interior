"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string, file?: File) => void;
  onFileSelect?: (file: File) => void;
  label?: string;
  className?: string;
  error?: string;
}

export function ImageUpload({ value, onChange, onFileSelect, label, className, error }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update preview when value prop changes (for edit mode)
  React.useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setSelectedFile(file);
      
      // Pass the file to parent component
      onChange(previewUrl, file);
      onFileSelect?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    setSelectedFile(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-xs font-bold tracking-tight text-charcoal/40">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-[3/2] w-full rounded-2xl border-2 border-dashed ${error ? 'border-red-300 bg-red-50' : 'border-charcoal/10'} hover:border-gold/40 hover:bg-gold/5 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${preview ? 'border-solid' : ''}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="text-white h-8 w-8" />
            </div>
            <Button
              size="icon"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <X size={14} />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-charcoal/30 group-hover:text-gold transition-colors">
            <div className="p-3 rounded-full bg-charcoal/5 group-hover:bg-gold/10">
              <Upload size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Upload Image
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
