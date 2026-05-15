"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit3, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminSearchHeader } from "@/components/admin/admin-search-header";
import { productService, categoryService, type Product } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsData, categoriesData, subcategoriesData] = await Promise.all([
      productService.getProductList(true),
      categoryService.getCategoryList(true),
      categoryService.getSubcategoryList(true),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
    setSubcategories(subcategoriesData);
    setLoading(false);
  };

  const columns = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (item: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-charcoal/10 bg-charcoal/5 shrink-0">
            <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <p className="text-sm font-bold text-charcoal">{item.name}</p>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "categoryId",
      cell: (item: Product) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/5 px-2 py-1 rounded-full border border-gold/10">
          {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}
        </span>
      )
    },
    {
      header: "Subcategory",
      accessorKey: "subcategoryId",
      cell: (item: Product) => (
        <span className="text-[11px] font-bold text-charcoal/50">
          {subcategories.find(s => s.id === item.subcategoryId)?.name || 'N/A'}
        </span>
      )
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item: Product) => (
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-charcoal">₹{item.price}</p>
          {item.originalPrice && (
            <p className="text-[11px] text-charcoal/30 line-through">₹{item.originalPrice}</p>
          )}
        </div>
      )
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (item: Product) => (
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${item.stock && item.stock > 0 ? 'bg-emerald-500' : 'bg-red-400'}`} />
          <span className={`text-[11px] font-bold ${item.stock && item.stock > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {item.stock && item.stock > 0 ? item.stock : 'Out'}
          </span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: Product) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/products/${item.id}`); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleDelete = async (id: string) => {
    await productService.deleteProduct(id);
    await loadData();
    setDeleteId(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-white border border-charcoal/10"
          >
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">Products</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage your product inventory</p>
          </div>
        </div>
      </div>

      <AdminSearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search products..."
        actionLabel="Add Product"
        onAction={() => router.push("/admin/products/add")}
        ActionIcon={Plus}
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-charcoal/5 overflow-hidden">
        <AdminTable columns={columns} data={filteredProducts} />
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 h-9 rounded-xl border border-charcoal/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
