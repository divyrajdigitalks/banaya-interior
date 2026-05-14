import api from '../axios';

export interface CalculatorItem {
  _id: string;
  itemType: 'bhk' | 'room' | 'furniture' | 'service' | 'detailed' | 'basic';
  projectScope: 'full_home' | 'specific_area' | 'both';
  serviceType: 'services' | 'interior' | 'homes';
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
    image?: string;
  }>;
  sortOrder: number;
  createdAt?: string;
}

export interface BrandOption {
  _id: string;
  name: string;
  image?: string;
  multiplier: number;
  description?: string;
}

export interface CalculatorData {
  bhkOptions: CalculatorItem[];
  roomOptions: CalculatorItem[];
  furnitureItems: CalculatorItem[];
  detailedFurniture: Record<string, CalculatorItem[]>;
  basicRequirements: CalculatorItem[];
  generalServices: CalculatorItem[];
  brandOptions: BrandOption[];
}

export const calculatorService = {
  getCalculatorData: async (calculatorType?: string, scope?: string): Promise<CalculatorData> => {
    const params = new URLSearchParams();
    if (calculatorType) params.append('calculatorType', calculatorType);
    if (scope) params.append('scope', scope);
    
    const response = await api.get(`/calculator/data?${params.toString()}`);
    return response.data.data;
  },

  getAllItems: async (): Promise<CalculatorItem[]> => {
    const response = await api.get('/calculator/items');
    return response.data.data;
  },

  getCalculatorItems: async (): Promise<CalculatorItem[]> => {
    const response = await api.get('/calculator/items');
    return response.data.data;
  },

  addItem: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post('/calculator/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateItem: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`/calculator/items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/calculator/items/${id}`);
  },

  getBrands: async (): Promise<BrandOption[]> => {
    const response = await api.get('/calculator/brands');
    return response.data.data;
  },

  addBrand: async (formData: FormData): Promise<BrandOption> => {
    const response = await api.post('/calculator/brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateBrand: async (id: string, formData: FormData): Promise<BrandOption> => {
    const response = await api.put(`/calculator/brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteBrand: async (id: string): Promise<void> => {
    await api.delete(`/calculator/brands/${id}`);
  },

  getAllServiceItems: async (): Promise<CalculatorItem[]> => {
    const response = await api.get('/calculator/services');
    return response.data.data;
  },

  addServiceItem: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post('/calculator/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateServiceItem: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`/calculator/services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteServiceItem: async (id: string): Promise<void> => {
    await api.delete(`/calculator/services/${id}`);
  },

  getAllInteriorServices: async (): Promise<CalculatorItem[]> => {
    const response = await api.get('/calculator/interior-services');
    return response.data.data;
  },

  addInteriorService: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post('/calculator/interior-services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateInteriorService: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`/calculator/interior-services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteInteriorService: async (id: string): Promise<void> => {
    await api.delete(`/calculator/interior-services/${id}`);
  },

  getAllHomeServices: async (): Promise<CalculatorItem[]> => {
    const response = await api.get('/calculator/home-services');
    return response.data.data;
  },

  addHomeService: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post('/calculator/home-services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateHomeService: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`/calculator/home-services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteHomeService: async (id: string): Promise<void> => {
    await api.delete(`/calculator/home-services/${id}`);
  }
};
