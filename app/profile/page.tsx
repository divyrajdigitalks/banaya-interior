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
      <div className="min-h-screen pt-40 pb-20 bg-[#fdf9f3]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <BackButton />
              <h1 className="text-4xl md:text-5xl font-sans font-black text-charcoal tracking-tight uppercase">
                Profile <span className="text-gold">Details</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5 text-center space-y-6">
                  <div className="w-32 h-32 rounded-[2rem] bg-gold/10 flex items-center justify-center text-gold text-4xl font-black border-2 border-gold/20 shadow-inner mx-auto">
                    {user.name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal">{user.name}</h3>
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mt-1">Valued Collector</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-500 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Account</span>
                  </div>
                </div>
              </div>

              {/* Info + Edit Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-charcoal/40">Personal Info</p>
                    {!isEditing ? (
                      <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all">
                        <Edit3 size={12} /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-2 border border-charcoal/10 text-charcoal/50 text-[10px] font-black uppercase rounded-xl hover:bg-charcoal/5 transition-all">
                          <X size={12} /> Cancel
                        </button>
                        <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-1 px-4 py-2 bg-charcoal text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all disabled:opacity-50">
                          <Save size={12} /> {isSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User size={12} className="text-gold" /> Full Name
                      </p>
                      {isEditing ? (
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full h-11 px-4 bg-[#f8f5f0] rounded-xl text-sm font-bold outline-none border border-transparent focus:border-gold transition-all"
                        />
                      ) : (
                        <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{user.name || "Not provided"}</p>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Mail size={12} className="text-gold" /> Email Address
                      </p>
                      <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{user.email}</p>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Phone size={12} className="text-gold" /> Phone Number
                      </p>
                      {isEditing ? (
                        <input
                          value={editForm.mobile}
                          onChange={e => setEditForm(f => ({ ...f, mobile: e.target.value }))}
                          className="w-full h-11 px-4 bg-[#f8f5f0] rounded-xl text-sm font-bold outline-none border border-transparent focus:border-gold transition-all"
                          placeholder="10-digit mobile"
                        />
                      ) : (
                        <p className="text-sm font-bold text-charcoal border-b border-charcoal/5 pb-3">{(user as any).mobile || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-charcoal/40 flex items-center gap-2">
                      <Lock size={14} className="text-gold" /> Password
                    </p>
                    <button
                      onClick={() => setShowPwForm(v => !v)}
                      className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all"
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
                            className="w-full h-12 px-4 pr-12 bg-[#f8f5f0] rounded-xl text-sm font-bold outline-none border border-transparent focus:border-gold transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(s => ({ ...s, [field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"]: !s[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors"
                          >
                            {showPw[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleChangePassword}
                        disabled={isSavingPw}
                        className="w-full py-4 bg-charcoal text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all disabled:opacity-50"
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
