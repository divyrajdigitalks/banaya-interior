import api from '../axios';

export interface CouponData {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount?: number;
}

class CouponService {
  async getCoupons(): Promise<any> {
    const response = await api.get('/coupons');
    return response.data;
  }

  async createCoupon(data: any): Promise<any> {
    const response = await api.post('/coupons', data);
    return response.data;
  }

  async updateCoupon(id: string, data: any): Promise<any> {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data;
  }

  async deleteCoupon(id: string): Promise<any> {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  }

  async validateCoupon(code: string, amount: number): Promise<any> {
    const response = await api.post('/coupons/validate', { code, amount });
    return response.data;
  }
}

export const couponService = new CouponService();
