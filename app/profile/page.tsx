"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Settings, ShieldCheck, Edit3, Save, X, Lock, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/common/back-button";
import { authService } from "@/lib/api/services/auth.service";
import { toast } from "sonner";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, login } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", mobile: "" });

  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [isSavingPw, setIsSavingPw] = useState(false);

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const startEdit = () => {
    setEditForm({ name: user.name || "", mobile: (user as any).mobile || "" });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    setIsSaving(true);
    const res = await authService.updateProfile({ name: editForm.name, mobile: editForm.mobile } as any);
    if (res.success && res.data) {
      login({ ...user, name: res.data.name, mobile: (res.data as any).mobile });
      toast.success("Profile updated!");
      setIsEditing(false);
    } else {
      toast.error(res.error || "Failed to update profile");
    }
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error("All fields required"); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (pwForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsSavingPw(true);
    const res = await authService.changePassword(pwForm);
    if (res.success) {
      toast.success("Password changed successfully!");
      setShowPwForm(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(res.error || "Failed to change password");
    }
    setIsSavingPw(false);
  };

  return (
    <div>
      <Header variant="light" />
      <div className="min-h-screen pt-38 pb-20 bg-[#fdf9f3]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mx-auto space-y-12">
            <div className="rounded-[3rem] border border-charcoal/10 bg-linear-to-br from-white via-[#fff9f2] to-[#fff4e7] p-8 shadow-2xl shadow-charcoal/10">
              <div className="space-y-4 max-w-3xl">
                <BackButton />
                <h1 className="font-serif text-4xl md:text-5xl text-primary font-black leading-tight">
                  Profile <span className="font-light text-gold">Details</span>
                </h1>
                <p className="text-sm text-primary/70 max-w-2xl">
                  Keep your profile in perfect form and manage account security with ease.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/10 shadow-xl shadow-charcoal/5 text-center space-y-6">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-4xl bg-gold/10 text-4xl font-black text-gold border-2 border-gold/20 shadow-inner">
                    {user.name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal">{user.name}</h3>
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mt-1">Valued Collector</p>
                  </div>
                  <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-600 shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest">
                      <ShieldCheck size={14} /> Verified Account
                    </div>
                  </div>
                </div>
              </div>

              {/* Info + Edit Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/10 shadow-xl shadow-charcoal/5 space-y-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-charcoal/40">Personal Info</p>
                    {!isEditing ? (
                      <button onClick={startEdit} className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-gold">
                        <Edit3 size={12} /> Edit
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setIsEditing(false)} className="inline-flex items-center gap-1 rounded-xl border border-charcoal/10 px-3 py-2 text-[10px] font-black uppercase text-charcoal/60 transition-all hover:bg-charcoal/5">
                          <X size={12} /> Cancel
                        </button>
                        <button onClick={handleSaveProfile} disabled={isSaving} className="inline-flex items-center gap-1 rounded-xl bg-charcoal px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-gold disabled:opacity-50">
                          <Save size={12} /> {isSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/20">
                        <User size={12} className="text-gold" /> Full Name
                      </p>
                      {isEditing ? (
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full h-11 rounded-xl border border-transparent bg-[#f8f5f0] px-4 text-sm font-bold outline-none transition-all focus:border-gold"
                        />
                      ) : (
                        <p className="border-b border-charcoal/5 pb-3 text-sm font-bold text-charcoal">{user.name || "Not provided"}</p>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/20">
                        <Mail size={12} className="text-gold" /> Email Address
                      </p>
                      <p className="border-b border-charcoal/5 pb-3 text-sm font-bold text-charcoal">{user.email}</p>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/20">
                        <Phone size={12} className="text-gold" /> Phone Number
                      </p>
                      {isEditing ? (
                        <input
                          value={editForm.mobile}
                          onChange={e => setEditForm(f => ({ ...f, mobile: e.target.value }))}
                          placeholder="10-digit mobile"
                          className="w-full h-11 rounded-xl border border-transparent bg-[#f8f5f0] px-4 text-sm font-bold outline-none transition-all focus:border-gold"
                        />
                      ) : (
                        <p className="border-b border-charcoal/5 pb-3 text-sm font-bold text-charcoal">{(user as any).mobile || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/10 shadow-xl shadow-charcoal/5 space-y-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-charcoal/40">
                      <Lock size={14} className="text-gold" /> Password
                    </p>
                    <button
                      onClick={() => setShowPwForm(v => !v)}
                      className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-gold"
                    >
                      <Settings size={12} /> {showPwForm ? "Cancel" : "Change Password"}
                    </button>
                  </div>

                  {showPwForm && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field, i) => (
                        <div key={field} className="relative">
                          <input
                            type={showPw[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? "text" : "password"}
                            placeholder={["Current Password", "New Password", "Confirm New Password"][i]}
                            value={pwForm[field]}
                            onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
                            className="w-full h-12 rounded-xl border border-transparent bg-[#f8f5f0] px-4 pr-12 text-sm font-bold outline-none transition-all focus:border-gold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(s => ({ ...s, [field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"]: !s[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 transition-colors hover:text-charcoal"
                          >
                            {showPw[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleChangePassword}
                        disabled={isSavingPw}
                        className="w-full rounded-xl bg-charcoal py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-gold disabled:opacity-50"
                      >
                        {isSavingPw ? "Updating..." : "Update Password"}
                      </button>
                    </motion.div>
                  )}
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
