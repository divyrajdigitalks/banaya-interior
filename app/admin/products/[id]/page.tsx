"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Package, Info, Image as ImageIcon, LayoutGrid, Plus, Trash2, ListChecks, Settings2, Sparkles, Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  AdminFormInputEnhanced, 
  AdminSelectEnhanced, 
  AdminFormTextareaEnhanced, 
  AdminCard, 
  AdminLabel, 
  ImageUpload, 
  MultiImageUpload, 
  AdminSelect,
  AdminFormTextarea
} from "@/components/admin";
import { categoryService, type Category, type Subcategory } from "@/lib/api";
import { productService, type Product } from "@/lib/api";
import { filterService, type FilterOption } from "@/lib/api";
import { buildImageUrl } from "@/lib/api/axios";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const isEditMode = id !== 'add';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<{
    image?: File;
    subImages?: File[];
  }>({});
  
  const [formData, setFormData] = useState<any>({
    name: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    originalPrice: "",
    image: "",
    subImages: ["", "", ""],
    description: "",
    stock: "",
    sku: "",
    sizes: ["Small (12 x 8 in)", "Medium (16 x 10 in)"],
    tags: ["Bestseller"],
    isPersonalisable: true,
    features: ["Elegant natural wood finish"],
    specifications: [
      { label: "Material", value: "Premium Sheesham Wood" },
      { label: "Finish", value: "Food Safe Natural Oil" }
    ],
    careInstructions: "Wipe with a soft damp cloth.",
    shippingReturns: "Free shipping on orders above ₹1499.",
    type: "",
    colour: "",
    materials: "",
    shape: "",
    usePurpose: "",
    occasions: "",
    discount: "",
    relatedProducts: [],
  });

  const [newSize, setNewSize] = useState("");
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesData, subcategoriesData, productsData] = await Promise.all([
          categoryService.getCategoryList(),
          categoryService.getSubcategoryList(),
          productService.getProductList(true),
          filterService.getFilterOptionList()
        ]);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setAllProducts(productsData);
        setFilterOptions(await filterService.getFilterOptionList());
        
        if (isEditMode && id) {
          const product = await productService.getProduct(id);
          if (product) {
            setFormData({
              name: product.name,
              categoryId: product.categoryId,
              subcategoryId: product.subcategoryId,
              price: product.price.toString(),
              originalPrice: product.originalPrice?.toString() || "",
              image: product.image,
              subImages: product.subImages || ["", "", ""],
              description: product.description || "",
              stock: product.stock?.toString() || "",
              sku: product.sku || "",
              sizes: product.sizes || ["Small (12 x 8 in)", "Medium (16 x 10 in)"],
              tags: product.tags || ["Bestseller"],
              isPersonalisable: product.isPersonalisable ?? true,
              features: product.features || ["Elegant natural wood finish"],
              specifications: product.specifications || [
                { label: "Material", value: "Premium Sheesham Wood" },
                { label: "Finish", value: "Food Safe Natural Oil" }
              ],
              careInstructions: product.careInstructions || "Wipe with a soft damp cloth.",
              shippingReturns: product.shippingReturns || "Free shipping on orders above ₹1499.",
              type: product.type || "",
              colour: product.colour || "",
              materials: product.materials || "",
              shape: product.shape || "",
              usePurpose: product.usePurpose || "",
              occasions: product.occasions || "",
              discount: product.discount?.toString() || "",
              relatedProducts: (product as any).relatedProducts || [],
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditMode]);

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name },
      categoryId: { value: formData.categoryId, rules: ValidationRules.required },
      subcategoryId: { value: formData.subcategoryId, rules: ValidationRules.required },
      price: { value: formData.price, rules: ValidationRules.price }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter(s => s.categoryId === formData.categoryId);
  }, [formData.categoryId, subcategories]);

  const addSize = () => {
    if (newSize.trim()) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] });
      setNewSize("");
    }
  };

  const removeSize = (index: number) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((_: any, i: number) => i !== index) });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_: any, i: number) => i !== index) });
  };

  const addSpec = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { label: "", value: "" }] });
  };

  const updateSpec = (index: number, field: string, value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpec = (index: number) => {
    setFormData({ ...formData, specifications: formData.specifications.filter((_: any, i: number) => i !== index) });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError("Please fix the validation errors before saving");
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        sku: formData.sku,
        stock: formData.stock ? Number(formData.stock) : undefined,
        sizes: formData.sizes,
        tags: formData.tags,
        isPersonalisable: formData.isPersonalisable,
        features: formData.features,
        specifications: formData.specifications,
        careInstructions: formData.careInstructions,
        shippingReturns: formData.shippingReturns,
        type: formData.type,
        colour: formData.colour,
        materials: formData.materials,
        shape: formData.shape,
        usePurpose: formData.usePurpose,
        occasions: formData.occasions,
        discount: formData.discount ? Number(formData.discount) : undefined,
        relatedProducts: formData.relatedProducts,
        isActive: true
      };

      let result;
      if (isEditMode && id) {
        result = await productService.updateProduct(id, productData);
        showSuccess("Product updated successfully!");
      } else {
        result = await productService.createProduct(productData, selectedFiles);
        showSuccess("Product created successfully!");
      }
      
      if (result) {
        router.push("/admin/products");
      } else {
        showError(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
      showError(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the product.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-white border border-charcoal/10"
          >
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-charcoal/40 mt-0.5">
              Fill in the product details below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 px-4 rounded-xl border border-charcoal/10 text-charcoal/60 text-sm"
          >
            Discard
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="h-9 bg-charcoal hover:bg-charcoal/90 text-white text-sm rounded-xl px-5 disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Basic Information" icon={<Package size={18} />}>
            <div className="space-y-4">
              <AdminFormInputEnhanced 
                label="Product Name"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="Enter product name"
                required
                error={formErrors.name}
              />
              <AdminFormTextareaEnhanced 
                label="Description"
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Describe your product..."
                rows={4}
              />
            </div>
          </AdminCard>

          <AdminCard title="Pricing & Inventory" icon={<Sparkles size={18} />}>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <AdminFormInputEnhanced 
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(val) => setFormData({ ...formData, price: val })}
                  placeholder="0"
                  required
                  error={formErrors.price}
                />
                <AdminFormInputEnhanced 
                  label="Original Price (₹)"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(val) => setFormData({ ...formData, originalPrice: val })}
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AdminFormInputEnhanced 
                  label="SKU"
                  value={formData.sku}
                  onChange={(val) => setFormData({ ...formData, sku: val })}
                  placeholder="e.g. PROD-001"
                />
                <AdminFormInputEnhanced 
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(val) => setFormData({ ...formData, stock: val })}
                  placeholder="0"
                />
              </div>
              <AdminFormInputEnhanced 
                label="Discount (%)"
                type="number"
                value={formData.discount}
                onChange={(val) => setFormData({ ...formData, discount: val })}
                placeholder="0"
              />
            </div>
          </AdminCard>

          <AdminCard title="Filters & Attributes" icon={<Filter size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminSelect
                label="Type"
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
                options={filterOptions.filter(f => f.filterGroup === 'Type').map(f => ({ value: f.name, label: f.name }))}
                placeholder="Select type"
              />
              <AdminSelect 
                label="Colour"
                value={formData.colour}
                onChange={(val) => setFormData({ ...formData, colour: val })}
                options={filterOptions.filter(f => f.filterGroup === 'Colour').map(f => ({ value: f.name, label: f.name }))}
                placeholder="Select colour"
              />
              <AdminSelect 
                label="Materials"
                value={formData.materials}
                onChange={(val) => setFormData({ ...formData, materials: val })}
                options={filterOptions.filter(f => f.filterGroup === 'Materials').map(f => ({ value: f.name, label: f.name }))}
                placeholder="Select material"
              />
              <AdminSelect 
                label="Shape"
                value={formData.shape}
                onChange={(val) => setFormData({ ...formData, shape: val })}
                options={filterOptions.filter(f => f.filterGroup === 'Shape').map(f => ({ value: f.name, label: f.name }))}
                placeholder="Select shape"
              />
              <AdminSelect 
                label="Use / Purpose"
                value={formData.usePurpose}
                onChange={(val) => setFormData({ ...formData, usePurpose: val })}
                options={filterOptions.filter(f => f.filterGroup === 'UsePurpose').map(f => ({ value: f.name, label: f.name }))}
                placeholder="Select use/purpose"
              />
              <AdminSelect 
                label="Occasions"
                value={formData.occasions}
                onChange={(val) => setFormData({ ...formData, occasions: val })}
                options={filterOptions.filter(f => f.filterGroup === 'Occasions').map(f => ({ value: f.name, label: f.name }))}
                placeholder="Select occasion"
              />
            </div>
          </AdminCard>

          <AdminCard title="Product Gallery" icon={<ImageIcon size={18} />}>
            <div className="min-h-[160px]">
              <MultiImageUpload 
                label="Upload Images (2 max)"
                value={formData.subImages.slice(0, 2)}
                onChange={(val) => setFormData({ ...formData, subImages: val })}
                onFilesSelect={(files) => setSelectedFiles(prev => ({ ...prev, subImages: files }))}
              />
            </div>
          </AdminCard>

          <AdminCard title="Features & Specifications" icon={<ListChecks size={18} />}>
            <div className="space-y-6">
              <div className="space-y-3">
                <AdminLabel>Key Features</AdminLabel>
                <div className="flex gap-2">
                  <input 
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    className="flex-1 h-9 px-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
                  />
                  <Button onClick={addFeature} type="button" className="h-9 w-9 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white p-0">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-warm-cream/50 rounded-lg border border-charcoal/5">
                      <span className="text-xs text-charcoal/70">{feature}</span>
                      <button onClick={() => removeFeature(idx)} className="text-charcoal/30 hover:text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-charcoal/5">
                <div className="flex items-center justify-between mb-3">
                  <AdminLabel>Specifications</AdminLabel>
                  <Button onClick={addSpec} variant="ghost" className="h-7 px-3 rounded-lg text-xs text-gold hover:bg-gold/10">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.specifications.map((spec: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input 
                          value={spec.label}
                          onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                          placeholder="Label"
                          className="w-full h-9 px-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
                        />
                      </div>
                      <div className="col-span-6">
                        <input 
                          value={spec.value}
                          onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-full h-9 px-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <button onClick={() => removeSpec(idx)} className="text-charcoal/30 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Care & Shipping" icon={<Info size={18} />}>
            <div className="space-y-4">
              <AdminFormTextarea
                label="Care Instructions"
                value={formData.careInstructions}
                onChange={(val) => setFormData({ ...formData, careInstructions: val })}
                placeholder="How to care for this product..."
                rows={3}
              />
              <AdminFormTextarea 
                label="Shipping & Returns"
                value={formData.shippingReturns}
                onChange={(val) => setFormData({ ...formData, shippingReturns: val })}
                placeholder="Shipping and return policy..."
                rows={3}
              />
            </div>
          </AdminCard>

          <AdminCard title="People Also Shopped For" icon={<Sparkles size={18} />}>
            <div className="space-y-4">
              <p className="text-[11px] text-charcoal/40 uppercase tracking-widest font-black mb-2">Select Recommended Products</p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {allProducts
                  .filter(p => p.id !== id)
                  .map((product) => (
                    <div 
                      key={product.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        formData.relatedProducts.includes(product.id) 
                          ? 'bg-gold/5 border-gold shadow-sm' 
                          : 'bg-white border-charcoal/5 hover:border-charcoal/20'
                      }`}
                      onClick={() => {
                        const isSelected = formData.relatedProducts.includes(product.id);
                        if (!isSelected && formData.relatedProducts.length >= 3) {
                          showError("You can only select up to 3 products");
                          return;
                        }
                        const newRelated = isSelected
                          ? formData.relatedProducts.filter((rid: string) => rid !== product.id)
                          : [...formData.relatedProducts, product.id];
                        setFormData({ ...formData, relatedProducts: newRelated });
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-charcoal/5">
                          <img src={buildImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-charcoal">{product.name}</p>
                          <p className="text-[10px] text-charcoal/40">₹{product.price}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.relatedProducts.includes(product.id)
                          ? 'bg-gold border-gold text-white'
                          : 'border-charcoal/10'
                      }`}>
                        {formData.relatedProducts.includes(product.id) && <Check size={12} strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
              </div>
              <p className="text-[10px] text-charcoal/30 italic">
                {formData.relatedProducts.length} products selected. These will be shown as manual recommendations.
              </p>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard title="Organization" icon={<LayoutGrid size={18} />}>
            <div className="space-y-3">
              <AdminSelectEnhanced 
                label="Category"
                value={formData.categoryId}
                onChange={(val) => setFormData({...formData, categoryId: val, subcategoryId: ""})}
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                placeholder={loading ? "Loading categories..." : "Select category"}
                disabled={loading}
                required
                error={formErrors.categoryId}
              />
              <AdminSelectEnhanced 
                label="Subcategory"
                value={formData.subcategoryId}
                onChange={(val) => setFormData({...formData, subcategoryId: val})}
                options={filteredSubcategories.map(s => ({ value: s.id, label: s.name }))}
                placeholder="Select subcategory"
                disabled={!formData.categoryId}
                required
                error={formErrors.subcategoryId}
              />
            </div>
          </AdminCard>

          <AdminCard title="Hero Image" icon={<ImageIcon size={18} />}>
            <div className="min-h-[180px]">
              <ImageUpload 
                label="Primary Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                onFileSelect={(file) => setSelectedFiles(prev => ({ ...prev, image: file }))}
              />
            </div>
          </AdminCard>

          <AdminCard title="Options" icon={<Settings2 size={18} />}>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">Personalisation</p>
                  <p className="text-[11px] text-charcoal/40">Enable custom engraving</p>
                </div>
                <Switch 
                  checked={formData.isPersonalisable}
                  onCheckedChange={(val) => setFormData({ ...formData, isPersonalisable: val })}
                />
              </div>

              <div className="pt-4 border-t border-charcoal/5 space-y-3">
                <AdminLabel>Available Sizes</AdminLabel>
                <div className="flex gap-2">
                  <input 
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size"
                    className="flex-1 h-9 px-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
                  />
                  <Button onClick={addSize} type="button" className="h-9 w-9 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white p-0">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-gold/10 rounded-lg border border-gold/20">
                      <span className="text-[11px] text-gold font-medium">{size}</span>
                      <button onClick={() => removeSize(idx)} className="text-gold/50 hover:text-red-500">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-charcoal/5 space-y-3">
                <AdminLabel>Product Tags</AdminLabel>
                <div className="flex flex-wrap gap-2">
                  {["Bestseller", "New Arrival", "Limited Edition", "Handcrafted"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const tags = formData.tags.includes(tag)
                          ? formData.tags.filter((t: string) => t !== tag)
                          : [...formData.tags, tag];
                        setFormData({ ...formData, tags });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] border transition-all ${
                        formData.tags.includes(tag)
                          ? "bg-charcoal border-charcoal text-white"
                          : "bg-white border-charcoal/10 text-charcoal/50 hover:border-charcoal/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AdminCard>

          <div className="bg-charcoal rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Ready?</span>
            </div>
            <p className="text-xs text-white/60 mb-4">
              Double-check your pricing and inventory before saving.
            </p>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="w-full h-9 bg-gold hover:bg-gold/90 text-charcoal text-sm rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
