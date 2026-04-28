"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, X, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load state from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("banaya-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("banaya-cart", JSON.stringify(cart));
  }, [cart]);

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        addToast(`Increased quantity of ${product.name}`, "success");
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      addToast(`${product.name} added to cart`, "success");
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    addToast("Removed from cart", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
      
      {/* Global Toasts */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className={`pointer-events-auto min-w-[300px] flex items-center gap-4 p-5 rounded-2xl shadow-2xl backdrop-blur-md border ${
                toast.type === "success" 
                  ? "bg-charcoal/90 border-gold/30 text-white" 
                  : "bg-white/90 border-charcoal/10 text-charcoal"
              }`}
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                toast.type === "success" ? "bg-gold/20" : "bg-charcoal/5"
              }`}>
                {toast.type === "success" ? (
                  <Check className="h-5 w-5 text-gold" />
                ) : (
                  <Info className="h-5 w-5 text-charcoal" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-50 mb-1">
                  {toast.type === "success" ? "Success" : "Notification"}
                </p>
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
