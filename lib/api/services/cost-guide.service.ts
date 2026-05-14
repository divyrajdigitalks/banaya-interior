import api from '../axios';
import endPointApi from '../endpoints';

export interface CostGuideItem {
  id: string;
  title: string;
  range: string;
  iconId: string;
  image?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCostGuideItem {
  title: string;
  range: string;
  iconId: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

class CostGuideService {
  async getCostGuideList(adminView = false): Promise<CostGuideItem[]> {
    try {
      const endpoint = adminView ? endPointApi.costGuideAdmin : endPointApi.costGuide;
      const response = await api.get(endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching cost guide items:', error);
      return [];
    }
  }

  async getCostGuideItem(id: string): Promise<CostGuideItem | null> {
    try {
      const response = await api.get(`${endPointApi.costGuide}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cost guide item:', error);
      return null;
    }
  }

  async createCostGuideItem(data: CreateCostGuideItem, imageFile?: File): Promise<CostGuideItem> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post(endPointApi.costGuide, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating cost guide item:', error);
      throw error;
    }
  }

  async updateCostGuideItem(id: string, data: Partial<CreateCostGuideItem>, imageFile?: File): Promise<CostGuideItem> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put(`${endPointApi.costGuide}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating cost guide item:', error);
      throw error;
    }
  }

  async deleteCostGuideItem(id: string): Promise<void> {
    try {
      await api.delete(`${endPointApi.costGuide}/${id}`);
    } catch (error) {
      console.error('Error deleting cost guide item:', error);
      throw error;
    }
  }

  async updateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    try {
      await api.put(endPointApi.costGuideSort, { items });
    } catch (error) {
      console.error('Error updating sort order:', error);
      throw error;
    }
  }
}

export const costGuideService = new CostGuideService();