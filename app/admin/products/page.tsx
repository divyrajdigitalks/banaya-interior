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
      header: "Product Details",
      accessorKey: "name",
      cell: (item: Product) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-charcoal/10 bg-charcoal/5">
            <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">{item.name}</p>
            <p className="text-[11px] text-charcoal/40 uppercase tracking-wide">
              {categories.find(c => c.id === item.categoryId)?.name} • {subcategories.find(s => s.id === item.subcategoryId)?.name}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Pricing",
      accessorKey: "price",
      cell: (item: Product) => (
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-charcoal">₹{item.price}</p>
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
        <span className={`text-sm font-medium ${item.stock && item.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {item.stock || 0}
        </span>
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

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
            <input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
            />
          </div>

          <Button 
            onClick={() => router.push("/admin/products/add")}
            className="h-10 bg-charcoal hover:bg-charcoal/90 text-white text-sm rounded-xl px-4"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredProducts} />
      </AdminCard>

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
