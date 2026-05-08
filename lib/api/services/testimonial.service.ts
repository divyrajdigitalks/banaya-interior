import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialListResponse {
  status: number;
  message: string;
  data: Testimonial[];
}

export interface TestimonialSingleResponse {
  status: number;
  message: string;
  data: Testimonial;
}

class TestimonialService {
  private testimonialList: Testimonial[] | null = null;
  private testimonialListPromise: Promise<Testimonial[]> | null = null;

  async getTestimonialList(refresh = false): Promise<Testimonial[]> {
    if (!refresh && this.testimonialList) {
      return this.testimonialList;
    }
    if (!refresh && this.testimonialListPromise) {
      return this.testimonialListPromise;
    }

    this.testimonialListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminTestimonials, {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: Testimonial[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          location: item.location,
          text: item.text,
          image: buildImageUrl(item.image),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.testimonialList = mapped;
        return mapped;
      } catch (error) {
        this.testimonialListPromise = null;
        return [];
      }
    })();

    return this.testimonialListPromise;
  }

  async getTestimonial(id: string): Promise<Testimonial | null> {
    try {
      const res = await api.get(`${endPointApi.adminTestimonials}/${id}`);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        name: item.name,
        location: item.location,
        text: item.text,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async createTestimonial(data: Partial<Testimonial>, file?: File): Promise<Testimonial | null> {
    try {
      const formData = new FormData();
      
      if (data.name) formData.append('name', data.name);
      if (data.location) formData.append('location', data.location);
      if (data.text) formData.append('text', data.text);
      
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminTestimonials, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const newTestimonial: Testimonial = {
        id: item.id || item._id,
        name: item.name,
        location: item.location,
        text: item.text,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.testimonialList) {
        this.testimonialList = [newTestimonial, ...this.testimonialList];
      }

      return newTestimonial;
    } catch (error) {
      return null;
    }
  }

  async updateTestimonial(id: string, data: Partial<Testimonial>, file?: File): Promise<Testimonial | null> {
    try {
      const formData = new FormData();
      
      if (data.name) formData.append('name', data.name);
      if (data.location) formData.append('location', data.location);
      if (data.text) formData.append('text', data.text);
      if (data.image) formData.append('image', data.image);
      
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminTestimonials}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const updatedTestimonial: Testimonial = {
        id: item.id || item._id,
        name: item.name,
        location: item.location,
        text: item.text,
        image: buildImageUrl(item.image),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.testimonialList) {
        this.testimonialList = this.testimonialList.map(testimonial =>
          testimonial.id === id ? updatedTestimonial : testimonial
        );
      }

      return updatedTestimonial;
    } catch (error) {
      return null;
    }
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminTestimonials}/${id}`);

      if (this.testimonialList) {
        this.testimonialList = this.testimonialList.filter(testimonial => testimonial.id !== id);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.testimonialList = null;
    this.testimonialListPromise = null;
  }
}

export const testimonialService = new TestimonialService();
