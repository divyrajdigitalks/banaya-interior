"use client";

import { useToast } from "@/components/ui/use-toast";

export function useAdminToast() {
  const { toast } = useToast();

  const showSuccess = (message: string, title?: string) => {
    toast({
      title: title || "Success",
      description: message,
      variant: "default",
      className: "border-green-200 bg-green-50 text-green-800",
    });
  };

  const showError = (message: string, title?: string) => {
    toast({
      title: title || "Error",
      description: message,
      variant: "destructive",
      className: "border-red-200 bg-red-50 text-red-800",
    });
  };

  const showWarning = (message: string, title?: string) => {
    toast({
      title: title || "Warning",
      description: message,
      variant: "default",
      className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    });
  };

  const showInfo = (message: string, title?: string) => {
    toast({
      title: title || "Info",
      description: message,
      variant: "default",
      className: "border-blue-200 bg-blue-50 text-blue-800",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}