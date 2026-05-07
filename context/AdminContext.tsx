"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeaders: () => { Authorization: string } | {};
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!token && !!user;

  // Initialize from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        // Clean up any conflicting localStorage keys
        storage.cleanupConflicts();
        
        const storedToken = storage.get("adminToken");
        const storedUser = storage.get("adminUser");
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        // Clear corrupted data
        storage.remove("adminToken");
        storage.remove("adminUser");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success && data.data && data.data.token) {
        const userData: AdminUser = {
          id: data.data._id,
          username: data.data.username,
          email: data.data.email,
          role: data.data.role || 'admin'
        };

        // Store in state
        setToken(data.data.token);
        setUser(userData);
        
        // Store in localStorage
        storage.set("adminToken", data.data.token);
        storage.set("adminUser", JSON.stringify(userData));
        
        return true;
      } else {
        console.error('Login response:', data);
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    storage.remove("adminToken");
    storage.remove("adminUser");
    
    // Redirect to login
    router.push("/admin/login");
  };

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value: AdminContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthHeaders
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}