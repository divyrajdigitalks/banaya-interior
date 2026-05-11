import api from '../axios';

export interface OfferData {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  discountText: string;
  link: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  type: 'banner' | 'popup' | 'sidebar';
}

class OfferService {
  async getOffers(): Promise<any> {
    const response = await api.get('/offers');
    return response.data;
  }

  async createOffer(data: any, imageFile?: File): Promise<any> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as string);
    });
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post('/offers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateOffer(id: string, data: any, imageFile?: File): Promise<any> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as string);
    });
    if (imageFile) formData.append('image', imageFile);

    const response = await api.put(`/offers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteOffer(id: string): Promise<any> {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  }
}

export const offerService = new OfferService();
