import api from '../axios';

export interface AboutStat {
  label: string;
  value: string;
  suffix?: string;
}

export interface AboutFeature {
  title: string;
  description: string;
  iconId: string;
}

export interface AboutSection {
  id?: string;
  _id?: string;
  sectionType: 'hero' | 'story' | 'values' | 'team' | 'stats';
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  secondaryImage?: string;
  stats: AboutStat[];
  features: AboutFeature[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutSectionSettings {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  primaryImage: string;
  secondaryImage: string;
  circularImage: string;
  statsValue: string;
  statsLabel: string;
  features: AboutFeature[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAboutSection {
  sectionType: 'hero' | 'story' | 'values' | 'team' | 'stats';
  title: string;
  subtitle?: string;
  description: string;
  stats?: AboutStat[];
  features?: AboutFeature[];
  isActive?: boolean;
  sortOrder?: number;
}

class AboutService {
  private baseUrl = '/about';

  async getAboutSections(adminView = false): Promise<AboutSection[]> {
    try {
      const endpoint = adminView ? `${this.baseUrl}/admin/all` : this.baseUrl;
      const response = await api.get(endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching about sections:', error);
      return [];
    }
  }

  async getAboutSectionsByType(type: string): Promise<AboutSection[]> {
    try {
      const response = await api.get(`${this.baseUrl}/type/${type}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching about sections by type:', error);
      return [];
    }
  }

  async getAboutSection(id: string): Promise<AboutSection | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching about section:', error);
      return null;
    }
  }

  async createAboutSection(data: CreateAboutSection, imageFile?: File, secondaryImageFile?: File): Promise<AboutSection> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add image files if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (secondaryImageFile) {
        formData.append('secondaryImage', secondaryImageFile);
      }

      const response = await api.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating about section:', error);
      throw error;
    }
  }

  async updateAboutSection(id: string, data: Partial<CreateAboutSection>, imageFile?: File, secondaryImageFile?: File): Promise<AboutSection> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add image files if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (secondaryImageFile) {
        formData.append('secondaryImage', secondaryImageFile);
      }

      const response = await api.put(`${this.baseUrl}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating about section:', error);
      throw error;
    }
  }

  async deleteAboutSection(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting about section:', error);
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

  async getSectionSettings(): Promise<AboutSectionSettings> {
    try {
      const response = await api.get(`${this.baseUrl}/section/settings`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching about section settings:', error);
      return {
        title: 'Design with Purpose. Executed with Precision.',
        subtitle: 'Our philosophy and approach',
        description: 'Banaya Interiors transforms spaces into legacies. We don\'t just design rooms; we curate experiences that resonate with your heritage and aspirations.',
        primaryImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        circularImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80',
        statsValue: '20+',
        statsLabel: 'Bespoke Sanctuaries Crafted',
        features: [],
        isActive: true
      };
    }
  }

  async updateSectionSettings(
    data: Partial<AboutSectionSettings>, 
    imageFiles?: {
      primaryImage?: File;
      secondaryImage?: File;
      circularImage?: File;
    }
  ): Promise<AboutSectionSettings> {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && 
            !['primaryImage', 'secondaryImage', 'circularImage'].includes(key)) {
          if (key === 'features') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (imageFiles) {
        if (imageFiles.primaryImage) {
          formData.append('primaryImage', imageFiles.primaryImage);
        }
        if (imageFiles.secondaryImage) {
          formData.append('secondaryImage', imageFiles.secondaryImage);
        }
        if (imageFiles.circularImage) {
          formData.append('circularImage', imageFiles.circularImage);
        }
      }

      const response = await api.put(`${this.baseUrl}/section/settings`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating about section settings:', error);
      throw error;
    }
  }
}

export const aboutService = new AboutService();