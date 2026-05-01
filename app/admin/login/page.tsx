"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login for now
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <span className="absolute top-[-10%] left-[-5%] text-[30vw] font-serif italic font-black text-primary rotate-[-15deg]">ADMIN</span>
        <span className="absolute bottom-[-10%] right-[-5%] text-[30vw] font-serif italic font-black text-primary rotate-[15deg]">PANEL</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-primary/5 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="pt-10 pb-6 text-center border-b border-primary/5">
            <div className="flex justify-center mb-6">
              <Logo variant="dark" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-3 bg-gold/40" />
              <Sparkles className="h-3 w-3 text-gold" />
              <div className="h-px w-3 bg-gold/40" />
            </div>
            <CardTitle className="text-2xl font-serif font-black text-primary tracking-tight">Admin Sanctuary</CardTitle>
            <CardDescription className="text-primary/50 text-xs font-semibold mt-1">
              Management & control center
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 pt-8 px-8">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-semibold text-primary/60 ml-1">Identity</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-gold transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@banaya.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/30 border-primary/5 rounded-2xl pl-11 py-6 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 transition-all placeholder:text-primary/20 outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-semibold text-primary/60">Passcode</Label>
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
                    className="bg-background/30 border-primary/5 rounded-2xl pl-11 py-6 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 transition-all placeholder:text-primary/20 outline-none"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pb-10 pt-4 px-8">
              <Button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-primary hover:bg-gold text-white font-bold tracking-widest text-xs py-7 rounded-2xl transition-all duration-500 shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group/btn relative overflow-hidden uppercase"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? "Validating..." : "Enter Sanctuary"}
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
