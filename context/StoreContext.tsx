"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, X, ShoppingBag } from "lucide-react";
import { cartService, type CartItem } from "@/lib/api/services/cart.service";
import { wishlistService, type WishlistItem } from "@/lib/api/services/wishlist.service";
import { useUser } from "./UserContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number, personalization?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { user } = useUser();

  // Load data from API when user is logged in
  useEffect(() => {
    if (user) {
      refreshCart();
      refreshWishlist();
    } else {
      // Clear data when user logs out
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const refreshCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data.items);
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshWishlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await wishlistService.getWishlist();
      if (response.success) {
        setWishlist(response.data.items);
      }
    } catch (error) {
      console.error('Failed to refresh wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1, personalization?: any) => {
    if (!user) {
      addToast("Please login to add items to cart", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await cartService.addToCart(product.id, quantity, personalization);
      if (response.success) {
        setCart(response.data.items);
        addToast(response.message || `${product.name} added to cart`, "success");
      } else {
        addToast(response.message || "Failed to add to cart", "error");
      }
    } catch (error) {
      addToast("Failed to add to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      if (response.success) {
        setCart(response.data.items);
      } else {
        addToast(response.message || "Failed to update cart", "error");
      }
    } catch (error) {
      addToast("Failed to update cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await cartService.removeFromCart(productId);
      if (response.success) {
        setCart(response.data.items);
        addToast("Removed from cart", "info");
      } else {
        addToast(response.message || "Failed to remove from cart", "error");
      }
    } catch (error) {
      addToast("Failed to remove from cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart([]);
        addToast("Cart cleared", "info");
      } else {
        addToast(response.message || "Failed to clear cart", "error");
      }
    } catch (error) {
      addToast("Failed to clear cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!user) {
      addToast("Please login to add items to wishlist", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await wishlistService.addToWishlist(product.id);
      if (response.success) {
        setWishlist(response.data.items);
        addToast(response.message || `${product.name} added to wishlist`, "success");
      } else {
        addToast(response.message || "Failed to add to wishlist", "error");
      }
    } catch (error) {
      addToast("Failed to add to wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        setWishlist(response.data.items);
        addToast("Removed from wishlist", "info");
      } else {
        addToast(response.message || "Failed to remove from wishlist", "error");
      }
    } catch (error) {
      addToast("Failed to remove from wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product._id === productId);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshCart,
        refreshWishlist,
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
