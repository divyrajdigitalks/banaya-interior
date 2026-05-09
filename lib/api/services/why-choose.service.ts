import api from '../axios';

export interface WhyChooseItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  iconId: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhyChooseSectionSettings {
  id?: string;
  title: string;
  subtitle: string;
  sectionImage: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWhyChooseItem {
  title: string;
  description: string;
  iconId: string;
  isActive?: boolean;
  sortOrder?: number;
}

class WhyChooseService {
  private baseUrl = '/why-choose';

  async getWhyChooseList(adminView = false): Promise<WhyChooseItem[]> {
    try {
      const endpoint = adminView ? `${this.baseUrl}/admin/all` : this.baseUrl;
      const response = await api.get(endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching why choose items:', error);
      return [];
    }
  }

  async getWhyChooseItem(id: string): Promise<WhyChooseItem | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching why choose item:', error);
      return null;
    }
  }

  async createWhyChooseItem(data: CreateWhyChooseItem, imageFile?: File): Promise<WhyChooseItem> {
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

      const response = await api.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating why choose item:', error);
      throw error;
    }
  }

  async updateWhyChooseItem(id: string, data: Partial<CreateWhyChooseItem>, imageFile?: File): Promise<WhyChooseItem> {
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

      const response = await api.put(`${this.baseUrl}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating why choose item:', error);
      throw error;
    }
  }

  async deleteWhyChooseItem(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting why choose item:', error);
      throw error;
    }
  }

  async updateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/sort/order`, { items });
    } catch (error) {
      console.error('Error updating sort order:', error);
      throw error;
    }
  }

  async getSectionSettings(): Promise<WhyChooseSectionSettings> {
    try {
      const response = await api.get(`${this.baseUrl}/section/settings`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching section settings:', error);
      // Return default settings if API fails
      return {
        title: 'Why Choose Banaya Interiors?',
        subtitle: 'The Banaya Advantage',
        sectionImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isActive: true
      };
    }
  }

  async updateSectionSettings(data: Partial<WhyChooseSectionSettings>, imageFile?: File): Promise<WhyChooseSectionSettings> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'sectionImage') {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        console.log('Adding image file to form data:', imageFile.name);
        formData.append('sectionImage', imageFile);
      }

      console.log('Sending section settings update request...');
      const response = await api.put(`${this.baseUrl}/section/settings`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Section settings update response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating section settings:', error);
      throw error;
    }
  }
}

export const whyChooseService = new WhyChooseService();