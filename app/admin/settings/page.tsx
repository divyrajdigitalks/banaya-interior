"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Settings, 
  Bell, 
  Lock, 
  Globe, 
  Shield, 
  Save,
  Camera,
  Mail,
  Smartphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-xs font-medium text-gold">System Control</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal tracking-tight">
            Admin <span className="italic font-light text-gold">Settings</span>
          </h1>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-charcoal hover:bg-gold text-white font-medium text-sm py-6 px-10 rounded-2xl transition-all duration-500 shadow-xl shadow-charcoal/10"
        >
          {isSaving ? "Saving Changes..." : "Save All Settings"}
        </Button>
      </header>

      <Tabs defaultValue="profile" className="space-y-10">
        <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-charcoal/5 h-auto flex flex-wrap gap-2">
          <TabsTrigger value="profile" className="rounded-xl px-8 py-4 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <User size={14} className="mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="site" className="rounded-xl px-8 py-4 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Globe size={14} className="mr-2" /> Site Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-8 py-4 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Bell size={14} className="mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 py-4 text-xs font-medium data-[state=active]:bg-charcoal data-[state=active]:text-white transition-all">
            <Shield size={14} className="mr-2" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="border-charcoal/5 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-charcoal/5 bg-warm-cream/20">
              <CardTitle className="text-2xl font-serif font-semibold text-charcoal">Profile Information</CardTitle>
              <p className="text-xs text-charcoal/40 font-medium mt-1">Manage your public and private details</p>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              <div className="flex flex-col md:flex-row items-start gap-12">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-charcoal overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                    <div className="w-full h-full flex items-center justify-center text-gold text-4xl font-bold italic">B</div>
                  </div>
                  <button className="absolute -bottom-4 -right-4 p-4 bg-gold text-white rounded-2xl shadow-xl hover:bg-charcoal transition-all">
                    <Camera size={20} />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Full Name</Label>
                    <Input defaultValue="Banaya Admin" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-7 text-sm font-medium" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Role</Label>
                    <Input defaultValue="Super Admin" disabled className="bg-warm-cream/10 border-charcoal/5 rounded-2xl py-7 text-sm font-medium opacity-50" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" />
                      <Input defaultValue="admin@banaya.com" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-12 py-7 text-sm font-medium" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-charcoal/60 ml-1">Phone Number</Label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" />
                      <Input defaultValue="+91 98765 43210" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-12 py-7 text-sm font-medium" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-medium text-charcoal/60 ml-1">Biography</Label>
                <textarea 
                  className="w-full min-h-[150px] bg-warm-cream/30 border border-charcoal/5 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 outline-none transition-all"
                  placeholder="Tell us about yourself..."
                  defaultValue="Leading the vision for premium interior design and heritage craftsmanship."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-charcoal/5">
                <CardTitle className="text-xl font-serif font-semibold text-charcoal">General Config</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-charcoal">Maintenance Mode</Label>
                    <p className="text-[10px] text-charcoal/40 font-medium">Disable public access</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-charcoal">Calculator Access</Label>
                    <p className="text-[10px] text-charcoal/40 font-medium">Show calculator to guests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-charcoal">Heritage Store</Label>
                    <p className="text-[10px] text-charcoal/40 font-medium">Enable e-commerce features</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-charcoal/5">
                <CardTitle className="text-xl font-serif font-semibold text-charcoal">Localization</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Default Currency</Label>
                  <Input defaultValue="INR (₹)" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Time Zone</Label>
                  <Input defaultValue="Asia/Kolkata (GMT+5:30)" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-charcoal/5">
                {[
                  { title: "Email Notifications", desc: "Receive daily summary of inquiries", default: true },
                  { title: "Order Alerts", desc: "Instant notification for new shop orders", default: true },
                  { title: "System Updates", desc: "Get notified about core platform changes", default: false },
                  { title: "Marketing Inquiries", desc: "Notification for new consultation requests", default: true },
                ].map((item, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-warm-cream/10 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-charcoal">{item.title}</p>
                      <p className="text-[10px] font-medium text-charcoal/40">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden border-t-4 border-t-gold">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif font-semibold text-charcoal">Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-[11px] text-charcoal/60 leading-relaxed font-medium">
                  Add an extra layer of security to your account by requiring more than just a password to log in.
                </p>
                <Button className="w-full bg-gold hover:bg-charcoal text-white font-medium text-sm py-5 rounded-2xl transition-all">
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>

            <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif font-semibold text-charcoal">Password Update</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">Current Password</Label>
                  <Input type="password" portfolio-value="********" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-charcoal/60 ml-1">New Password</Label>
                  <Input type="password" portfolio-value="********" className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium" />
                </div>
                <Button variant="ghost" className="text-xs font-medium text-charcoal/40 hover:text-gold transition-colors">
                  Reset Password via Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
