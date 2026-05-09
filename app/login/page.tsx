"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DoorTransition } from "@/components/door-transition";
import { useUser } from "@/context/UserContext";
import { authService } from "@/lib/api/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        login(response.data);
        router.push("/decor");
      } else {
        setError(response.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <DoorTransition />
      <Header variant="light" />
      
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-md mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-5xl text-primary font-black leading-tight">
              Welcome <span className="italic font-light text-gold">Back.</span>
            </h1>
            <p className="text-primary/50 text-sm font-light">
              Enter your sanctuary and explore your curated treasures.
            </p>
          </div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {error && (
              <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-white border border-primary/5 rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all shadow-xl shadow-primary/[0.02]"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-white border border-primary/5 rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all shadow-xl shadow-primary/[0.02]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-primary/10 text-gold focus:ring-gold" />
                <span className="text-xs text-primary/40 group-hover:text-primary transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" size={14} className="text-xs font-bold text-gold hover:text-primary transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-6 bg-primary text-white text-xs font-black tracking-[0.2em] uppercase rounded-2xl overflow-hidden shadow-2xl hover:shadow-gold/20 transition-all duration-700 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {loading ? "Authenticating..." : "Enter Sanctuary"} <ArrowRight size={14} />
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </button>
          </motion.form>

          <div className="text-center">
            <p className="text-xs text-primary/40">
              Don't have an account?{" "}
              <Link href="/register" className="text-gold font-black uppercase tracking-widest hover:text-primary transition-colors">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
