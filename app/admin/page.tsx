"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Palette,
  Calculator,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { 
    name: "Total Orders", 
    value: "128", 
    change: "+12.5%", 
    trend: "up", 
    icon: ShoppingBag, 
    color: "bg-blue-500/10 text-blue-500" 
  },
  { 
    name: "New Inquiries", 
    value: "42", 
    change: "+8.2%", 
    trend: "up", 
    icon: MessageSquare, 
    color: "bg-gold/10 text-gold" 
  },
  { 
    name: "Active Projects", 
    value: "15", 
    change: "-2.4%", 
    trend: "down", 
    icon: Palette, 
    color: "bg-purple-500/10 text-purple-500" 
  },
  { 
    name: "Total Revenue", 
    value: "₹8.4L", 
    change: "+18.7%", 
    trend: "up", 
    icon: TrendingUp, 
    color: "bg-emerald-500/10 text-emerald-500" 
  },
];

const recentInquiries = [
  { id: 1, name: "Rajesh Kumar", type: "Interior Design", status: "New", time: "2 hours ago" },
  { id: 2, name: "Anita Sharma", type: "Decor Shopping", status: "Processing", time: "5 hours ago" },
  { id: 3, name: "Vikram Singh", type: "Furniture Quote", status: "Completed", time: "Yesterday" },
  { id: 4, name: "Sonal Gupta", type: "Heritage Consultation", status: "New", time: "2 days ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* ── Welcome Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-xs text-gold font-medium">Admin Sanctuary</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-sans font-black text-charcoal tracking-tight uppercase">
            Dashboard <span className="text-gold">Overview</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-charcoal/40">Today's Date</p>
            <p className="text-sm font-normal text-charcoal">April 28, 2026</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-charcoal/5 flex items-center justify-center shadow-xl">
            <Clock size={20} className="text-gold" />
          </div>
        </div>
      </header>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-charcoal/5 shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                    <stat.icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-charcoal/40 mb-1">{stat.name}</p>
                  <p className="text-3xl font-sans font-black text-charcoal tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-2 border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-charcoal/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif font-semibold text-charcoal tracking-tight">Recent Inquiries</CardTitle>
              <p className="text-xs text-charcoal/40 font-normal mt-1">Latest customer interactions</p>
            </div>
            <Link href="/admin/inquiries">
              <button className="text-xs font-medium text-gold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-all">View All</button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-charcoal/5 bg-warm-cream/30">
                    <th className="px-8 py-4 text-xs font-medium text-charcoal/40">Customer</th>
                    <th className="px-8 py-4 text-xs font-medium text-charcoal/40">Service</th>
                    <th className="px-8 py-4 text-xs font-medium text-charcoal/40">Status</th>
                    <th className="px-8 py-4 text-xs font-medium text-charcoal/40">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-warm-cream/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-charcoal text-white flex items-center justify-center text-xs font-medium">
                            {inquiry.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-normal text-charcoal">{inquiry.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-normal text-charcoal/60">{inquiry.type}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium ${
                          inquiry.status === 'New' ? 'bg-gold/10 text-gold' : 
                          inquiry.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' : 
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-normal text-charcoal/40 italic">{inquiry.time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / System Health */}
        <div className="space-y-8">
          <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-charcoal text-white overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-serif font-semibold tracking-tight flex items-center gap-3">
                Quick <span className="italic font-light text-gold">Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Link href="/admin/shop">
                <button className="w-full bg-white/5 hover:bg-gold hover:text-charcoal p-5 rounded-2xl transition-all duration-500 text-left group">
                  <p className="text-xs font-medium text-white/40 mb-1">Product</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Add New Item</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>
              </Link>
              <Link href="/admin/interiors">
                <button className="w-full bg-white/5 hover:bg-gold hover:text-charcoal p-5 rounded-2xl transition-all duration-500 text-left group">
                  <p className="text-xs font-medium text-white/40 mb-1">Project</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">New Portfolio Entry</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>
              </Link>
              <Link href="/admin/settings">
                <button className="w-full bg-white/5 hover:bg-gold hover:text-charcoal p-5 rounded-2xl transition-all duration-500 text-left group">
                  <p className="text-xs font-medium text-white/40 mb-1">Analytics</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Export Monthly Report</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-charcoal/5 shadow-xl rounded-3xl bg-white overflow-hidden border-t-4 border-t-gold">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
                  <Sparkles size={20} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs font-medium text-charcoal/40">System Status</p>
                  <p className="text-sm font-semibold text-charcoal">All Systems Optimal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-medium text-charcoal/40">
                    <span>Server Load</span>
                    <span>24%</span>
                  </div>
                  <div className="w-full h-1.5 bg-warm-cream rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "24%" }} className="h-full bg-emerald-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-medium text-charcoal/40">
                    <span>Memory Usage</span>
                    <span>48%</span>
                  </div>
                  <div className="w-full h-1.5 bg-warm-cream rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "48%" }} className="h-full bg-gold" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
