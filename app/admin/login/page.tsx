"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if already logged in and redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-charcoal/30 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  // Don't show login if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-primary/5 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="pt-8 pb-4 text-center border-b border-primary/5">
            <div className="flex justify-center mb-4">
              <Logo variant="dark" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-3 bg-gold/40" />
              <Sparkles className="h-3 w-3 text-gold" />
              <div className="h-px w-3 bg-gold/40" />
            </div>
            <CardTitle className="text-xl font-serif font-black text-primary tracking-tight">Admin Sanctuary</CardTitle>
            <CardDescription className="text-primary/50 text-[10px] font-semibold mt-0.5">
              Management & control center
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-6 px-8">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-semibold text-primary/60 ml-1 uppercase tracking-widest">Identity</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-gold transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@banaya.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/30 border-primary/5 rounded-2xl pl-11 py-5 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 transition-all placeholder:text-primary/20 outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-semibold text-primary/60 uppercase tracking-widest">Passcode</Label>
                  <button type="button" className="text-[9px] font-bold text-gold hover:text-primary transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-gold transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/30 border-primary/5 rounded-2xl pl-11 py-5 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 transition-all placeholder:text-primary/20 outline-none"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pb-8 pt-2 px-8">
              <Button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-primary hover:bg-gold text-white font-bold tracking-widest text-[10px] py-6 rounded-2xl transition-all duration-500 shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group/btn relative overflow-hidden uppercase"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? "Validating..." : "Login"}
                  {!isLoading && <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-charcoal/30 text-[9px] uppercase tracking-[0.3em] font-black">
          Powered by Banaya Heritage Systems
        </p>
      </motion.div>
    </div>
  );
}