"use client";

import { useState } from "react";
import { 
  Search, 
  Users, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MoreVertical, 
  Trash2, 
  Edit3,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { AdminTable } from "@/components/admin/admin-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminFormInput } from "@/components/admin/form-input";

const INITIAL_ADMINS = [
  { id: "1", name: "Super Admin", email: "admin@banaya.com", role: "Super Admin", status: "Active", lastLogin: "2024-05-04" },
  { id: "2", name: "Designer Karan", email: "karan@banaya.com", role: "Editor", status: "Active", lastLogin: "2024-05-03" },
  { id: "3", name: "Marketing Team", email: "marketing@banaya.com", role: "Viewer", status: "Inactive", lastLogin: "2024-04-20" },
];

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", email: "", role: "Editor", status: "Active" });

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "Admin Details",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-charcoal text-white flex items-center justify-center text-xs font-black shadow-lg">
            {item.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black mt-0.5">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-gold" />
          <span className="text-xs font-bold text-charcoal/60">{item.role}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => (
        <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-black ${
          item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      header: "Last Activity",
      accessorKey: "lastLogin",
      cell: (item: any) => (
        <p className="text-xs font-bold text-charcoal/40">{item.lastLogin}</p>
      )
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100/50"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setAdmins(admins.filter(a => a.id !== item.id)); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100/50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleOpenDialog = (admin: any = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData(admin);
    } else {
      setEditingAdmin(null);
      setFormData({ name: "", email: "", role: "Editor", status: "Active" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;
    if (editingAdmin) {
      setAdmins(admins.map(a => a.id === editingAdmin.id ? formData : a));
    } else {
      setAdmins([{ id: Date.now().toString(), lastLogin: new Date().toISOString().split('T')[0], ...formData }, ...admins]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
          <Input 
            placeholder="Search admins..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-charcoal/5 rounded-2xl pl-11 py-6 text-[10px] uppercase tracking-widest font-bold focus:ring-2 focus:ring-gold/5 shadow-xl shadow-charcoal/5"
          />
        </div>

        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl shadow-gold/10 flex items-center gap-3 group transition-all duration-500"
        >
          <Users className="group-hover:rotate-90 transition-transform duration-500" size={16} />
          Add New Admin
        </Button>
      </div>

      <AdminTable columns={columns} data={filteredAdmins} />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2.5rem] p-10 overflow-hidden mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-black text-charcoal">
              {editingAdmin ? "Edit" : "Create"} <span className="text-gold font-bold">Admin Access</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-8">
            <AdminFormInput 
              label="Full Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Rahul Sharma"
            />
            <AdminFormInput 
              label="Email Address"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              placeholder="e.g. rahul@banaya.com"
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 ml-2">Access Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-14 bg-warm-cream/50 border-none rounded-2xl px-6 text-sm font-bold text-charcoal focus:ring-2 focus:ring-gold/20 outline-none"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-charcoal/10 text-[10px] font-black uppercase tracking-widest">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 h-14 bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-gold/20">
              Save Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
