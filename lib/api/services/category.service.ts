import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface Category {
  id: string;
  name: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse {
  status: number;
  message: string;
  data: Category[];
}

export interface SubcategoryListResponse {
  status: number;
  message: string;
  data: Subcategory[];
}

class CategoryService {
  private categoryList: Category[] | null = null;
  private categoryListPromise: Promise<Category[]> | null = null;
  private subcategoryList: Subcategory[] | null = null;
  private subcategoryListPromise: Promise<Subcategory[]> | null = null;

  async getCategoryList(refresh = false): Promise<Category[]> {
    if (!refresh && this.categoryList) {
      return this.categoryList;
    }
    if (!refresh && this.categoryListPromise) {
      return this.categoryListPromise;
    }

    this.categoryListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminCategories, {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: Category[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          image: buildImageUrl(item.image),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.categoryList = mapped;
        return mapped;
      } catch (error) {
        this.categoryListPromise = null;
        return [];
      }
    })();

    return this.categoryListPromise;
  }

  async createCategory(data: Partial<Category>, file?: File): Promise<Category | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminCategories, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const newCategory: Category = {
        id: item.id || item._id,
        name: item.name,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.categoryList) {
        this.categoryList = [newCategory, ...this.categoryList];
      }

      return newCategory;
    } catch (error) {
      return null;
    }
  }

  async updateCategory(id: string, data: Partial<Category>, file?: File): Promise<Category | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminCategories}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const updatedCategory: Category = {
        id: item.id || item._id,
        name: item.name,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.categoryList) {
        this.categoryList = this.categoryList.map(cat =>
          cat.id === id ? updatedCategory : cat
        );
      }

      return updatedCategory;
    } catch (error) {
      return null;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminCategories}/${id}`);
      
      if (this.categoryList) {
        this.categoryList = this.categoryList.filter(cat => cat.id !== id);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async getSubcategoryList(refresh = false, categoryId?: string): Promise<Subcategory[]> {
    if (!refresh && this.subcategoryList && !categoryId) {
      return this.subcategoryList;
    }

    const fetchPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminSubcategories, {
          params: {
            page: 1,
            limit: 100,
            categoryId,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: Subcategory[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          categoryId: item.category?._id || item.category || item.categoryId,
          image: buildImageUrl(item.image),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        if (!categoryId) {
          this.subcategoryList = mapped;
        }
        return mapped;
      } catch (error) {
        if (!categoryId) {
          this.subcategoryListPromise = null;
        }
        return [];
      }
    })();

    if (!categoryId) {
      this.subcategoryListPromise = fetchPromise;
    }

    return fetchPromise;
  }

  async createSubcategory(data: Partial<Subcategory>, file?: File): Promise<Subcategory | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.categoryId) formData.append('category', data.categoryId); // Backend expects 'category' field
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminSubcategories, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const newSubcategory: Subcategory = {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.category?._id || item.category || item.categoryId,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.subcategoryList) {
        this.subcategoryList = [newSubcategory, ...this.subcategoryList];
      }

      return newSubcategory;
    } catch (error) {
      return null;
    }
  }

  async updateSubcategory(id: string, data: Partial<Subcategory>, file?: File): Promise<Subcategory | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.categoryId) formData.append('category', data.categoryId); // Backend expects 'category' field
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminSubcategories}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const updatedSubcategory: Subcategory = {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.category?._id || item.category || item.categoryId,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.subcategoryList) {
        this.subcategoryList = this.subcategoryList.map(subcat =>
          subcat.id === id ? updatedSubcategory : subcat
        );
      }

      return updatedSubcategory;
    } catch (error) {
      return null;
    }
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminSubcategories}/${id}`);
      
      if (this.subcategoryList) {
        this.subcategoryList = this.subcategoryList.filter(subcat => subcat.id !== id);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.categoryList = null;
    this.categoryListPromise = null;
    this.subcategoryList = null;
    this.subcategoryListPromise = null;
  }
}

export const categoryService = new CategoryService();
