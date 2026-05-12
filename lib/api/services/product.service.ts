import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  subcategoryId: string;
  image: string;
  subImages?: string[];
  sku?: string;
  stock?: number;
  sizes?: string[];
  tags?: string[];
  isPersonalisable?: boolean;
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
  careInstructions?: string;
  shippingReturns?: string;
  collectionId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  colour?: string;
  materials?: string;
  shape?: string;
  usePurpose?: string;
  occasions?: string;
  discount?: number;
}

export interface ProductListResponse {
  status: number;
  message: string;
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductSingleResponse {
  status: number;
  message: string;
  data: Product;
}

class ProductService {
  private productList: Product[] | null = null;
  private productListPromise: Promise<Product[]> | null = null;

  async getProductList(refresh = false, params?: { page?: number; limit?: number; categoryId?: string }): Promise<Product[]> {
    if (!refresh && this.productList && !params) {
      return this.productList;
    }

    const fetchPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminProducts, {
          params: {
            page: params?.page || 1,
            limit: params?.limit || 100,
            categoryId: params?.categoryId,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: Product[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          description: item.description,
          price: Number(item.price) || 0,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          categoryId: item.category?._id || item.category,
          subcategoryId: item.subcategory?._id || item.subcategory,
          image: buildImageUrl(item.image),
          subImages: item.subImages?.map((img: string) => buildImageUrl(img)) || [],
          sku: item.sku,
          stock: item.stock ? Number(item.stock) : undefined,
          sizes: item.sizes || [],
          tags: item.tags || [],
          isPersonalisable: Boolean(item.isPersonalisable),
          features: item.features || [],
          specifications: item.specifications || [],
          careInstructions: item.careInstructions,
          shippingReturns: item.shippingReturns,
          collectionId: item.collection?._id || item.collection,
          isActive: Boolean(item.isActive),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          type: item.type,
          colour: item.colour,
          materials: item.materials,
          shape: item.shape,
          usePurpose: item.usePurpose,
          occasions: item.occasions,
          discount: item.discount ? Number(item.discount) : undefined,
        }));

        if (!params) {
          this.productList = mapped;
        }
        return mapped;
      } catch (error) {
        if (!params) {
          this.productListPromise = null;
        }
        return [];
      }
    })();

    if (!params) {
      this.productListPromise = fetchPromise;
    }

    return fetchPromise;
  }

  async getRelatedProducts(id: string): Promise<{ manual: Product[], automatic: Product[] }> {
    try {
      const res = await api.get(`/products/${id}/related`);
      const payload = res.data;
      
      const mapItem = (item: any) => ({
        id: item.id || item._id,
        name: item.name,
        description: item.description,
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        image: buildImageUrl(item.image),
        category: item.category
      });

      const manual = Array.isArray(payload?.data?.manual) ? payload.data.manual.map(mapItem) : [];
      const automatic = Array.isArray(payload?.data?.automatic) ? payload.data.automatic.map(mapItem) : [];

      return { manual, automatic };
    } catch (error) {
      console.error('Failed to fetch related products', error);
      return { manual: [], automatic: [] };
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const res = await api.get(`${endPointApi.adminProducts}/${id}`);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.category?._id || item.category || item.categoryId,
        subcategoryId: item.subcategory?._id || item.subcategory || item.subcategoryId,
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        image: buildImageUrl(item.image),
        subImages: item.subImages?.map((img: string) => buildImageUrl(img)) || [],
        description: item.description,
        stock: item.stock ? Number(item.stock) : undefined,
        sku: item.sku,
        sizes: item.sizes || [],
        tags: item.tags || [],
        isPersonalisable: Boolean(item.isPersonalisable),
        features: item.features || [],
        specifications: item.specifications || [],
        careInstructions: item.careInstructions,
        shippingReturns: item.shippingReturns,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: item.type,
        colour: item.colour,
        materials: item.materials,
        shape: item.shape,
        usePurpose: item.usePurpose,
        occasions: item.occasions,
        discount: item.discount ? Number(item.discount) : undefined,
        relatedProducts: item.relatedProducts?.map((rp: any) => rp.id || rp._id || rp) || [],
      } as any;
    } catch (error) {
      return null;
    }
  }

  async createProduct(data: Partial<Product>, files?: { image?: File; subImages?: File[] }): Promise<Product | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.price) formData.append('price', data.price.toString());
      if (data.originalPrice) formData.append('originalPrice', data.originalPrice.toString());
      if (data.categoryId) formData.append('category', data.categoryId);
      if (data.subcategoryId) formData.append('subcategory', data.subcategoryId);
      if (data.sku) formData.append('sku', data.sku);
      if (data.stock) formData.append('stock', data.stock.toString());
      if (data.careInstructions) formData.append('careInstructions', data.careInstructions);
      if (data.shippingReturns) formData.append('shippingReturns', data.shippingReturns);
      if (data.collectionId) formData.append('collection', data.collectionId);
      if (data.type) formData.append('type', data.type);
      if (data.colour) formData.append('colour', data.colour);
      if (data.materials) formData.append('materials', data.materials);
      if (data.shape) formData.append('shape', data.shape);
      if (data.usePurpose) formData.append('usePurpose', data.usePurpose);
      if (data.occasions) formData.append('occasions', data.occasions);
      if (data.discount !== undefined) formData.append('discount', data.discount.toString());
      
      // Add array fields as JSON
      if (data.sizes) formData.append('sizes', JSON.stringify(data.sizes));
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      if (data.features) formData.append('features', JSON.stringify(data.features));
      if (data.specifications) formData.append('specifications', JSON.stringify(data.specifications));
      
      // Add boolean fields
      if (data.isPersonalisable !== undefined) formData.append('isPersonalisable', data.isPersonalisable.toString());
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
      
      // Add image files
      if (files?.image) {
        formData.append('image', files.image);
      }
      if (files?.subImages) {
        files.subImages.forEach(file => {
          formData.append('subImages', file);
        });
      }

      const res = await api.post(endPointApi.adminProducts, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const newProduct: Product = {
        id: item.id || item._id,
        name: item.name,
        description: item.description,
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        categoryId: item.category?._id || item.category,
        subcategoryId: item.subcategory?._id || item.subcategory,
        image: buildImageUrl(item.image),
        subImages: item.subImages?.map((img: string) => buildImageUrl(img)) || [],
        sku: item.sku,
        stock: item.stock ? Number(item.stock) : undefined,
        sizes: item.sizes || [],
        tags: item.tags || [],
        isPersonalisable: Boolean(item.isPersonalisable),
        features: item.features || [],
        specifications: item.specifications || [],
        careInstructions: item.careInstructions,
        shippingReturns: item.shippingReturns,
        collectionId: item.collection?._id || item.collection,
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: item.type,
        colour: item.colour,
        materials: item.materials,
        shape: item.shape,
        usePurpose: item.usePurpose,
        occasions: item.occasions,
        discount: item.discount ? Number(item.discount) : undefined,
      };

      if (this.productList) {
        this.productList = [newProduct, ...this.productList];
      }

      return newProduct;
    } catch (error) {
      console.error('Create product error:', error);
      return null;
    }
  }

  async updateProduct(id: string, data: Partial<Product>, files?: { image?: File; subImages?: File[] }): Promise<Product | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.price) formData.append('price', data.price.toString());
      if (data.originalPrice) formData.append('originalPrice', data.originalPrice.toString());
      if (data.categoryId) formData.append('category', data.categoryId);
      if (data.subcategoryId) formData.append('subcategory', data.subcategoryId);
      if (data.sku) formData.append('sku', data.sku);
      if (data.stock) formData.append('stock', data.stock.toString());
      if (data.careInstructions) formData.append('careInstructions', data.careInstructions);
      if (data.shippingReturns) formData.append('shippingReturns', data.shippingReturns);
      if (data.collectionId) formData.append('collection', data.collectionId);
      if (data.type) formData.append('type', data.type);
      if (data.colour) formData.append('colour', data.colour);
      if (data.materials) formData.append('materials', data.materials);
      if (data.shape) formData.append('shape', data.shape);
      if (data.usePurpose) formData.append('usePurpose', data.usePurpose);
      if (data.occasions) formData.append('occasions', data.occasions);
      if (data.discount !== undefined) formData.append('discount', data.discount.toString());
      
      // Add array fields as JSON
      if (data.sizes) formData.append('sizes', JSON.stringify(data.sizes));
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      if (data.features) formData.append('features', JSON.stringify(data.features));
      if (data.specifications) formData.append('specifications', JSON.stringify(data.specifications));
      if (data.relatedProducts) formData.append('relatedProducts', JSON.stringify(data.relatedProducts));
      
      // Add boolean fields
      if (data.isPersonalisable !== undefined) formData.append('isPersonalisable', data.isPersonalisable.toString());
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
      
      // Add image files
      if (files?.image) {
        formData.append('image', files.image);
      }
      if (files?.subImages) {
        files.subImages.forEach(file => {
          formData.append('subImages', file);
        });
      }

      const res = await api.put(`${endPointApi.adminProducts}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const updatedProduct: Product = {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.categoryId,
        subcategoryId: item.subcategoryId,
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        image: buildImageUrl(item.image),
        subImages: item.subImages?.map((img: string) => buildImageUrl(img)) || [],
        description: item.description,
        stock: item.stock ? Number(item.stock) : undefined,
        sku: item.sku,
        sizes: item.sizes || [],
        tags: item.tags || [],
        isPersonalisable: Boolean(item.isPersonalisable),
        features: item.features || [],
        specifications: item.specifications || [],
        careInstructions: item.careInstructions,
        shippingReturns: item.shippingReturns,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: item.type,
        colour: item.colour,
        materials: item.materials,
        shape: item.shape,
        usePurpose: item.usePurpose,
        occasions: item.occasions,
        discount: item.discount ? Number(item.discount) : undefined,
      };

      if (this.productList) {
        this.productList = this.productList.map(prod =>
          prod.id === id ? updatedProduct : prod
        );
      }

      return updatedProduct;
    } catch (error) {
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminProducts}/${id}`);

      if (this.productList) {
        this.productList = this.productList.filter(prod => prod.id !== id);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.productList = null;
    this.productListPromise = null;
  }
}

export const productService = new ProductService();
