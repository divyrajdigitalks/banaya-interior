"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  ShieldCheck, 
  ArrowLeft,
  Camera,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/common/back-button";

export default function UserProfilePage() {
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  return (
    <div>
      <Header variant="light" />
      <div className="min-h-screen pt-40 pb-20 bg-[#fdf9f3]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-4">
              <BackButton />
              <h1 className="text-4xl md:text-5xl font-sans font-black text-charcoal tracking-tight uppercase">
                Profile <span className="text-gold">Details</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Avatar Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5 text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-[2rem] bg-gold/10 flex items-center justify-center text-gold text-4xl font-black border-2 border-gold/20 shadow-inner">
                      {user.name?.[0] || user.username?.[0] || 'U'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-charcoal text-white rounded-xl flex items-center justify-center shadow-xl border-4 border-white hover:bg-gold transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal">{user.name || user.username}</h3>
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mt-1">Valued Collector</p>
                  </div>
                  <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-emerald-500 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                      <ShieldCheck size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Verified Account</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Info Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User size={12} className="text-gold" /> Full Name
                      </p>
                      <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{user.name || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Mail size={12} className="text-gold" /> Email Address
                      </p>
                      <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Phone size={12} className="text-gold" /> Phone Number
                      </p>
                      <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{user.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <MapPin size={12} className="text-gold" /> Location
                      </p>
                      <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{user.city || "Not provided"}</p>
                    </div>
                  </div>

                  {/* <div className="pt-6 flex flex-wrap gap-4">
                    <Button className="bg-charcoal text-white hover:bg-gold px-10 py-7 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="border-charcoal/10 px-10 py-7 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                      Change Password
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
