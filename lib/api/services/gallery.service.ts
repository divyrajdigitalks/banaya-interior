import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryListResponse {
  status: number;
  message: string;
  data: GalleryImage[];
}

export interface GallerySingleResponse {
  status: number;
  message: string;
  data: GalleryImage;
}

class GalleryService {
  private galleryList: GalleryImage[] | null = null;
  private galleryListPromise: Promise<GalleryImage[]> | null = null;

  async getGalleryList(refresh = false): Promise<GalleryImage[]> {
    if (!refresh && this.galleryList) {
      return this.galleryList;
    }
    if (!refresh && this.galleryListPromise) {
      return this.galleryListPromise;
    }

    this.galleryListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminGallery, {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: GalleryImage[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          src: buildImageUrl(item.image || item.src),
          title: item.title,
          subtitle: item.subtitle,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.galleryList = mapped;
        return mapped;
      } catch (error) {
        this.galleryListPromise = null;
        return [];
      }
    })();

    return this.galleryListPromise;
  }

  async getGalleryImage(id: string): Promise<GalleryImage | null> {
    try {
      const res = await api.get(`${endPointApi.adminGallery}/${id}`);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        src: buildImageUrl(item.image || item.src),
        title: item.title,
        subtitle: item.subtitle,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async createGalleryImage(data: Partial<GalleryImage>, file?: File): Promise<GalleryImage | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.title) formData.append('title', data.title);
      if (data.subtitle) formData.append('subtitle', data.subtitle);
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminGallery, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const newImage: GalleryImage = {
        id: item.id || item._id,
        src: buildImageUrl(item.image || item.src),
        title: item.title,
        subtitle: item.subtitle,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.galleryList) {
        this.galleryList = [newImage, ...this.galleryList];
      }

      return newImage;
    } catch (error) {
      return null;
    }
  }

  async updateGalleryImage(id: string, data: Partial<GalleryImage>, file?: File): Promise<GalleryImage | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.title) formData.append('title', data.title);
      if (data.subtitle) formData.append('subtitle', data.subtitle);
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminGallery}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const updatedImage: GalleryImage = {
        id: item.id || item._id,
        src: buildImageUrl(item.image || item.src),
        title: item.title,
        subtitle: item.subtitle,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.galleryList) {
        this.galleryList = this.galleryList.map(img =>
          img.id === id ? updatedImage : img
        );
      }

      return updatedImage;
    } catch (error) {
      return null;
    }
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminGallery}/${id}`);

      if (this.galleryList) {
        this.galleryList = this.galleryList.filter(img => img.id !== id);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.galleryList = null;
    this.galleryListPromise = null;
  }
}

export const galleryService = new GalleryService();
