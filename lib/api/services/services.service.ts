import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface InteriorService {
  id: string;
  title: string;
  description: string;
  calculatorType: "services" | "interior" | "homes";
  image: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class InteriorServicesService {
  private servicesList: InteriorService[] | null = null;
  private servicesListPromise: Promise<InteriorService[]> | null = null;

  async getServicesList(refresh = false): Promise<InteriorService[]> {
    if (!refresh && this.servicesList) {
      return this.servicesList;
    }
    if (!refresh && this.servicesListPromise) {
      return this.servicesListPromise;
    }

    this.servicesListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminServices);
        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: InteriorService[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          title: item.title,
          description: item.description,
          calculatorType: item.calculatorType,
          image: buildImageUrl(item.image),
          available: item.available ?? true,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.servicesList = mapped;
        return mapped;
      } catch (error) {
        this.servicesListPromise = null;
        return [];
      }
    })();

    return this.servicesListPromise;
  }

  async getService(id: string): Promise<InteriorService | null> {
    try {
      const res = await api.get(`${endPointApi.adminServices}/${id}`);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        title: item.title,
        description: item.description,
        calculatorType: item.calculatorType,
        image: buildImageUrl(item.image),
        available: item.available ?? true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async createService(data: Partial<InteriorService>, file?: File): Promise<InteriorService | null> {
    try {
      const formData = new FormData();
      
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.calculatorType) formData.append('calculatorType', data.calculatorType);
      if (data.available !== undefined) formData.append('available', String(data.available));
      
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminServices, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const newService: InteriorService = {
        id: item.id || item._id,
        title: item.title,
        description: item.description,
        calculatorType: item.calculatorType,
        image: buildImageUrl(item.image),
        available: item.available ?? true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.servicesList) {
        this.servicesList = [newService, ...this.servicesList];
      }

      return newService;
    } catch (error) {
      return null;
    }
  }

  async updateService(id: string, data: Partial<InteriorService>, file?: File): Promise<InteriorService | null> {
    try {
      const formData = new FormData();
      
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.calculatorType) formData.append('calculatorType', data.calculatorType);
      if (data.available !== undefined) formData.append('available', String(data.available));
      
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminServices}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const updatedService: InteriorService = {
        id: item.id || item._id,
        title: item.title,
        description: item.description,
        calculatorType: item.calculatorType,
        image: buildImageUrl(item.image),
        available: item.available ?? true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.servicesList) {
        this.servicesList = this.servicesList.map(service =>
          service.id === id ? updatedService : service
        );
      }

      return updatedService;
    } catch (error) {
      return null;
    }
  }

  async deleteService(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminServices}/${id}`);

      if (this.servicesList) {
        this.servicesList = this.servicesList.filter(service => service.id !== id);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export const interiorServicesService = new InteriorServicesService();
