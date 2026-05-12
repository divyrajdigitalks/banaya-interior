import api from '../axios';
import endPointApi from '../endpoints';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  status: 'New' | 'In Progress' | 'Completed';
  message?: string;
  estimateDetails?: any;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

class InquiryService {
  async getInquiries(): Promise<Inquiry[]> {
    try {
      const res = await api.get(endPointApi.adminInquiries);
      const payload = res.data;
      const rawList = Array.isArray(payload?.data) ? payload.data : [];

      return rawList.map((item: any) => ({
        id: item.id || item._id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        city: item.city,
        service: item.service,
        status: item.status,
        message: item.message,
        estimateDetails: item.estimateDetails,
        date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } catch (error) {
      return [];
    }
  }

  async submitInquiry(data: Partial<Inquiry>): Promise<Inquiry | null> {
    try {
      const res = await api.post(endPointApi.submitInquiry, data);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        city: item.city,
        service: item.service,
        status: item.status,
        message: item.message,
        estimateDetails: item.estimateDetails,
        date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async updateInquiryStatus(id: string, status: string): Promise<boolean> {
    try {
      await api.put(`${endPointApi.adminInquiryUpdateStatus}/${id}`, { status });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteInquiry(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminInquiryDelete}/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const inquiryService = new InquiryService();
