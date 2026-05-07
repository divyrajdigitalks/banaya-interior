"use client";

// Utility to manage localStorage safely
export const storage = {
  get: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },
  
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
    }
  },
  
  clear: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },

  // Clean up specific keys that might conflict
  cleanupConflicts: () => {
    if (typeof window === "undefined") return;
    
    // Remove any conflicting keys
    const conflictKeys = ["banaya-cart", "cart", "user", "token"];
    conflictKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove ${key}:`, error);
      }
    });
  }
};