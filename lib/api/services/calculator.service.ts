import api from '../axios';
import endPointApi from '../endpoints';

export interface CalculatorItem {
  id: string;
  calculatorType: 'services' | 'interior' | 'homes';
  type: 'bhk' | 'furniture' | 'detailed' | 'basic' | 'general_service';
  name: string;
  image?: string;
  icon?: string;
  price: number;
  unit: 'unit' | 'sqft';
  category?: string;
  options?: Array<{
    name: string;
    price: number;
    unit: string;
  }>;
}

export interface BrandOption {
  id: string;
  calculatorType: 'services' | 'interior' | 'homes' | 'all';
  name: string;
  multiplier: number;
  image?: string;
}

export interface CalculatorData {
  bhkOptions: CalculatorItem[];
  furnitureItems: CalculatorItem[];
  detailedFurniture: { [key: string]: CalculatorItem[] };
  basicRequirements: CalculatorItem[];
  generalServices: CalculatorItem[];
  brandOptions: BrandOption[];
}

class CalculatorService {
  async getCalculatorData(): Promise<CalculatorData | null> {
    try {
      const res = await api.get('calculator/data');
      return res.data.data;
    } catch (error) {
      console.error('Failed to fetch calculator data:', error);
      return null;
    }
  }

  // Admin methods
  async getAllItems(): Promise<CalculatorItem[]> {
    try {
      const res = await api.get('calculator/items');
      return res.data.data.map((item: any) => ({
        ...item,
        id: item._id
      }));
    } catch (error) {
      return [];
    }
  }

  async addItem(data: any, file?: File): Promise<any> {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'options') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      if (file) formData.append('image', file);

      const res = await api.post('calculator/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (error) {
      return null;
    }
  }

  async updateItem(id: string, data: any, file?: File): Promise<any> {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'options') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      if (file) formData.append('image', file);

      const res = await api.put(`calculator/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (error) {
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      await api.delete(`calculator/items/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Brand management
  async getBrands(): Promise<BrandOption[]> {
    try {
      const res = await api.get('calculator/brands');
      return res.data.data.map((b: any) => ({ ...b, id: b._id }));
    } catch (error) {
      return [];
    }
  }

  async addBrand(data: any, file?: File): Promise<any> {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (file) formData.append('image', file);
      const res = await api.post('calculator/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (error) {
      return null;
    }
  }

  async updateBrand(id: string, data: any, file?: File): Promise<any> {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (file) formData.append('image', file);
      const res = await api.put(`calculator/brands/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (error) {
      return null;
    }
  }

  async deleteBrand(id: string): Promise<boolean> {
    try {
      await api.delete(`calculator/brands/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const calculatorService = new CalculatorService();
