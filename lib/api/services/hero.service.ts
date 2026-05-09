import api from '../axios';

export interface DecorHeroData {
  _id?: string;
  topLabel: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  rightHeading: string;
  rightQuote: string;
  features: string[];
}

export interface InteriorHeroData {
  _id?: string;
  backgroundImage: string;
  topLabel: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

export interface DecorHeroResponse {
  success: boolean;
  data: DecorHeroData;
  error?: string;
}

export interface InteriorHeroResponse {
  success: boolean;
  data: InteriorHeroData;
  error?: string;
}

class HeroService {
  // Decor Hero
  async getDecorHero(): Promise<DecorHeroResponse> {
    try {
      const response = await api.get<DecorHeroResponse>('/decor-hero');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {} as any,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async updateDecorHero(data: Partial<DecorHeroData>): Promise<DecorHeroResponse> {
    try {
      const response = await api.put<DecorHeroResponse>('/decor-hero', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {} as any,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Interior Hero
  async getInteriorHero(): Promise<InteriorHeroResponse> {
    try {
      const response = await api.get<InteriorHeroResponse>('/interior-hero');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {} as any,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async updateInteriorHero(data: Partial<InteriorHeroData>, imageFile?: File): Promise<InteriorHeroResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'backgroundImage') formData.append(key, value.toString());
      });
      if (imageFile) formData.append('backgroundImage', imageFile);

      const response = await api.put<InteriorHeroResponse>('/interior-hero', formData, {
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

export const heroService = new HeroService();
