import api from '../axios';
import endPointApi from '../endpoints';

export interface QuickFeature {
  label: string;
  value: string;
}

export interface Badge {
  icon: string;
  title: string;
  subtitle: string;
}

export interface DecorFeaturesData {
  _id?: string;
  backgroundText: string;
  mainImage: string;
  badge1: Badge;
  badge2: Badge;
  topLabel: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  quickFeatures: QuickFeature[];
  phone: string;
}

export interface DecorFeaturesResponse {
  success: boolean;
  data: DecorFeaturesData;
  error?: string;
}

class FeaturesService {
  // Decor Features
  async getDecorFeatures(): Promise<DecorFeaturesResponse> {
    try {
      const response = await api.get<DecorFeaturesResponse>(endPointApi.decorFeatures);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {} as any,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async updateDecorFeatures(data: Partial<DecorFeaturesData>, imageFile?: File): Promise<DecorFeaturesResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'mainImage') {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      if (imageFile) formData.append('mainImage', imageFile);

      const response = await api.put<DecorFeaturesResponse>(endPointApi.decorFeatures, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {} as any,
        error: error.response?.data?.error || error.message
      };
    }
  }
}

export const featuresService = new FeaturesService();
