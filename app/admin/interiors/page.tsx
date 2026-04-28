"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Image as ImageIcon,
  Palette,
  MapPin,
  Calendar,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const INTERIOR_PROJECTS = [
  { id: "1", title: "The Royal Lounge", category: "Living Room", location: "Mumbai", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" },
  { id: "2", title: "Heritage Suite", category: "Bedroom", location: "Jaipur", image: "https://images.unsplash.com/photo-1616486341351-79b5b248883e?auto=format&fit=crop&q=80&w=800" },
  { id: "3", title: "Modern Mughal Kitchen", category: "Kitchen", location: "Delhi", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800" },
];

export default function AdminInteriorsManagementPage() {
  const [projects, setProjects] = useState(INTERIOR_PROJECTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    category: "",
    location: "",
    date: "",
    image: "",
    brief: ""
  });

  const handleOpenDialog = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        category: "",
        location: "",
        date: "",
        image: "",
        brief: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.image) return;
    
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? formData : p));
    } else {
      const project = {
        id: (projects.length + 1).toString(),
        ...formData
      };
      setProjects([project, ...projects]);
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-12 pb-12">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-[10px] tracking-[0.4em] text-gold uppercase font-black">Portfolio Management</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-sans font-black text-charcoal tracking-tight uppercase">
            Interior <span className="text-gold">Projects</span>
          </h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-charcoal hover:bg-gold text-white font-black uppercase tracking-[0.2em] text-[10px] py-7 px-8 rounded-2xl transition-all duration-500 shadow-xl shadow-charcoal/10 group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={16} />
              Add New Project
            </span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>

          <DialogContent className="max-w-2xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-charcoal p-8 text-white relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-black tracking-tight text-white">
                  {editingProject ? "Edit Interior Project" : "New Interior Project"}
                </DialogTitle>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mt-1">Design Details & Portfolio Data</p>
              </DialogHeader>
              <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
                <Palette size={80} />
              </div>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-charcoal/60 ml-1">Project Title</Label>
                  <Input 
                    placeholder="e.g. The Heritage Villa" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-charcoal/60 ml-1">Category</Label>
                  <Input 
                    placeholder="e.g. Living Room" 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl py-6 text-sm font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-charcoal/60 ml-1">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                    <Input 
                      placeholder="Mumbai, MH" 
                      className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-charcoal/60 ml-1">Completion Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                    <Input 
                      placeholder="MM/YYYY" 
                      className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-charcoal/60 ml-1">Cover Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/20" />
                  <Input 
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-warm-cream/30 border-charcoal/5 rounded-2xl pl-11 py-6 text-sm font-medium"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-charcoal/60 ml-1">Project Brief</Label>
                <textarea 
                  placeholder="Describe the design concept..." 
                  className="w-full min-h-[120px] bg-warm-cream/30 border border-charcoal/5 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-gold/5 focus:border-gold/20 outline-none transition-all placeholder:text-charcoal/20"
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter className="p-8 pt-4 border-t border-charcoal/5 flex sm:justify-between items-center bg-warm-cream/10">
              <button onClick={() => setIsDialogOpen(false)} className="text-[10px] uppercase tracking-widest font-black text-charcoal/40 hover:text-charcoal transition-colors">Cancel</button>
              <Button 
                onClick={handleSave}
                className="bg-gold hover:bg-charcoal text-white font-black uppercase tracking-[0.2em] text-[10px] py-6 px-10 rounded-2xl transition-all duration-500 shadow-xl shadow-gold/10"
              >
                {editingProject ? "Update Project" : "Publish Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* ── Projects Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-charcoal/5 shadow-xl hover:shadow-2xl transition-all duration-700 group rounded-[2.5rem] overflow-hidden bg-white flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-charcoal/80 backdrop-blur-md text-gold text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-gold/20">
                    {project.category}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex gap-2">
                  <button 
                    onClick={() => handleOpenDialog(project)}
                    className="p-3 bg-white/90 backdrop-blur-md text-charcoal rounded-xl hover:bg-gold hover:text-white transition-all shadow-xl"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-3 bg-white/90 backdrop-blur-md text-charcoal rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <CardContent className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={10} className="text-gold" />
                    <span className="text-[9px] uppercase tracking-widest font-black text-charcoal/30">{project.location}</span>
                  </div>
                  <h3 className="text-xl font-serif font-black text-charcoal tracking-tight group-hover:text-gold transition-colors duration-500">
                    {project.title}
                  </h3>
                </div>
                
                <div className="pt-4 mt-auto border-t border-charcoal/5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-warm-cream border-2 border-white flex items-center justify-center text-[8px] font-black text-charcoal/40">
                        {i}
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-charcoal hover:text-gold transition-colors group/btn">
                    View Project <ExternalLink size={12} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
