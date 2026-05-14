import api from '../axios';
import endPointApi from '../endpoints';

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
    
    const response = await api.get(`${endPointApi.calculatorData}?${params.toString()}`);
    return response.data.data;
  },

  getAllItems: async (): Promise<CalculatorItem[]> => {
    const response = await api.get(endPointApi.calculatorItems);
    return response.data.data;
  },

  getCalculatorItems: async (): Promise<CalculatorItem[]> => {
    const response = await api.get(endPointApi.calculatorItems);
    return response.data.data;
  },

  addItem: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post(endPointApi.calculatorItems, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateItem: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`${endPointApi.calculatorItems}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`${endPointApi.calculatorItems}/${id}`);
  },

  getBrands: async (): Promise<BrandOption[]> => {
    const response = await api.get(endPointApi.calculatorBrands);
    return response.data.data;
  },

  addBrand: async (formData: FormData): Promise<BrandOption> => {
    const response = await api.post(endPointApi.calculatorBrands, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateBrand: async (id: string, formData: FormData): Promise<BrandOption> => {
    const response = await api.put(`${endPointApi.calculatorBrands}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteBrand: async (id: string): Promise<void> => {
    await api.delete(`${endPointApi.calculatorBrands}/${id}`);
  },

  getAllServiceItems: async (): Promise<CalculatorItem[]> => {
    const response = await api.get(endPointApi.calculatorServices);
    return response.data.data;
  },

  addServiceItem: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post(endPointApi.calculatorServices, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateServiceItem: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`${endPointApi.calculatorServices}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteServiceItem: async (id: string): Promise<void> => {
    await api.delete(`${endPointApi.calculatorServices}/${id}`);
  },

  getAllInteriorServices: async (): Promise<CalculatorItem[]> => {
    const response = await api.get(endPointApi.calculatorInteriorServices);
    return response.data.data;
  },

  addInteriorService: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post(endPointApi.calculatorInteriorServices, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateInteriorService: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`${endPointApi.calculatorInteriorServices}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteInteriorService: async (id: string): Promise<void> => {
    await api.delete(`${endPointApi.calculatorInteriorServices}/${id}`);
  },

  getAllHomeServices: async (): Promise<CalculatorItem[]> => {
    const response = await api.get(endPointApi.calculatorHomeServices);
    return response.data.data;
  },

  addHomeService: async (formData: FormData): Promise<CalculatorItem> => {
    const response = await api.post(endPointApi.calculatorHomeServices, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  updateHomeService: async (id: string, formData: FormData): Promise<CalculatorItem> => {
    const response = await api.put(`${endPointApi.calculatorHomeServices}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  deleteHomeService: async (id: string): Promise<void> => {
    await api.delete(`${endPointApi.calculatorHomeServices}/${id}`);
  },

  downloadPdf: async (payload: {
    estimate: number;
    serviceType: string | null;
    brand?: string;
    reqType: string;
    selBHK?: string;
    items: { name: string; qty: number }[];
    carpetArea?: string;
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
  }): Promise<void> => {
    const response = await api.post(endPointApi.calculatorDownloadPdf, payload, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `Banaya_Quote_${Date.now()}.pdf`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
