"use client";

import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { authService } from "@/lib/api/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await authService.forgotPassword(email);
    if (res.success) {
      setSent(true);
    } else {
      setError(res.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header variant="light" />
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-md mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-5xl text-primary font-black leading-tight">
              Reset <span className="italic font-light text-gold">Password.</span>
            </h1>
            <p className="text-primary/50 text-sm font-light">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-6 p-10 bg-white rounded-3xl border border-primary/5 shadow-xl">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Mail size={28} className="text-gold" />
              </div>
              <p className="text-sm font-bold text-primary">Reset link sent to <span className="text-gold">{email}</span></p>
              <p className="text-xs text-primary/40">Check your inbox and follow the link. Valid for 15 minutes.</p>
              <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 hover:text-gold transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-white border border-primary/5 rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all shadow-xl shadow-primary/[0.02]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-6 bg-primary text-white text-xs font-black tracking-[0.2em] uppercase rounded-2xl overflow-hidden shadow-2xl disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? "Sending..." : "Send Reset Link"} <ArrowRight size={14} />
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>
              <div className="text-center">
                <Link href="/login" className="text-xs text-primary/40 hover:text-gold transition-colors font-bold flex items-center justify-center gap-2">
                  <ArrowLeft size={12} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
