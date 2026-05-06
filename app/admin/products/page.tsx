"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/admin-table";

const INITIAL_CATEGORIES = [
  { id: "1", name: "Living Room" },
  { id: "2", name: "Bedroom" },
  { id: "3", name: "Kitchen" },
];

const INITIAL_SUBCATEGORIES = [
  { id: "1", name: "Coffee Tables", categoryId: "1" },
  { id: "2", name: "Sofas", categoryId: "1" },
  { id: "3", name: "Beds", categoryId: "2" },
  { id: "4", name: "Kitchen Cabinets", categoryId: "3" },
];

const INITIAL_PRODUCTS = [
  { 
    id: "1", 
    name: "Royal Teak Coffee Table", 
    categoryId: "1", 
    subcategoryId: "1",
    price: 15000,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    subImages: [""]
  },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [categories] = useState(INITIAL_CATEGORIES);
  const [subcategories] = useState(INITIAL_SUBCATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: "Product Details",
      accessorKey: "name",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-charcoal/5">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">
              {categories.find(c => c.id === item.categoryId)?.name} • {subcategories.find(s => s.id === item.subcategoryId)?.name}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Pricing",
      accessorKey: "price",
      cell: (item: any) => (
        <div className="space-y-0.5">
          <p className="font-black text-charcoal">₹{item.price}</p>
          {item.originalPrice && (
            <p className="text-[10px] text-charcoal/30 line-through">₹{item.originalPrice}</p>
          )}
        </div>
      )
    },
    {
      header: "ID",
      accessorKey: "id",
      cell: (item: any) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">#{item.id}</span>
      )
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/products/edit/${item.id}`); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100/50"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setProducts(products.filter(p => p.id !== item.id)); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100/50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const displayProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-gold transition-colors" size={18} />
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-14 bg-white border-charcoal/5 rounded-2xl focus:ring-gold/20 focus:border-gold transition-all shadow-xl shadow-charcoal/5"
          />
        </div>

        <Button 
          onClick={() => router.push("/admin/products/add")}
          className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-black text-[10px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl shadow-gold/10 flex items-center gap-3 group transition-all duration-500"
        >
          <Plus className="group-hover:rotate-90 transition-transform duration-500" size={16} />
          Add Product
        </Button>
      </div>

      <AdminTable columns={columns} data={displayProducts} />
    </div>
  );
}
