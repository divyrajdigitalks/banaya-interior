import api from '../axios';
import endPointApi from '../endpoints';

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
    const response = await api.get(endPointApi.coupons);
    return response.data;
  }

  async createCoupon(data: any): Promise<any> {
    const response = await api.post(endPointApi.coupons, data);
    return response.data;
  }

  async updateCoupon(id: string, data: any): Promise<any> {
    const response = await api.put(`${endPointApi.coupons}/${id}`, data);
    return response.data;
  }

  async deleteCoupon(id: string): Promise<any> {
    const response = await api.delete(`${endPointApi.coupons}/${id}`);
    return response.data;
  }

  async validateCoupon(code: string, amount: number): Promise<any> {
    const response = await api.post(endPointApi.couponValidate, { code, amount });
    return response.data;
  }
}

export const couponService = new CouponService();
