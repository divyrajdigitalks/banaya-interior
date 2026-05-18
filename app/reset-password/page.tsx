"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { authService } from "@/lib/api/services/auth.service";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [show, setShow] = useState({ pw: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    const res = await authService.resetPassword({ token, password: form.password, confirmPassword: form.confirmPassword });
    if (res.success) {
      router.push("/login?reset=success");
    } else {
      setError(res.error || "Invalid or expired link");
    }
    setLoading(false);
  };

  if (!token) return (
    <div className="text-center py-20">
      <p className="text-primary/50 text-sm">Invalid reset link.</p>
      <Link href="/forgot-password" className="text-gold font-bold text-xs mt-4 inline-block">Request a new one</Link>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}
      {(["password", "confirmPassword"] as const).map((field, i) => (
        <div key={field} className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors">
            <Lock size={18} />
          </div>
          <input
            type={show[field === "password" ? "pw" : "confirm"] ? "text" : "password"}
            placeholder={["New Password", "Confirm New Password"][i]}
            value={form[field]}
            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
            className="w-full h-16 pl-16 pr-14 bg-white border border-primary/5 rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all shadow-xl shadow-primary/[0.02]"
            required
          />
          <button type="button" onClick={() => setShow(s => ({ ...s, [field === "password" ? "pw" : "confirm"]: !s[field === "password" ? "pw" : "confirm"] }))} className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors">
            {show[field === "password" ? "pw" : "confirm"] ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      ))}
      <button type="submit" disabled={loading} className="group relative w-full py-6 bg-primary text-white text-xs font-black tracking-[0.2em] uppercase rounded-2xl overflow-hidden shadow-2xl disabled:opacity-50">
        <span className="relative z-10 flex items-center justify-center gap-4">
          {loading ? "Resetting..." : "Reset Password"} <ArrowRight size={14} />
        </span>
        <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header variant="light" />
      <div className="container mx-auto px-6 pt-48 pb-32">
        <div className="max-w-md mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-5xl text-primary font-black leading-tight">
              New <span className="italic font-light text-gold">Password.</span>
            </h1>
            <p className="text-primary/50 text-sm font-light">Enter your new password below.</p>
          </div>
          <Suspense fallback={<div className="text-center text-primary/40 text-sm">Loading...</div>}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
