import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface Collection {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  image: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionListResponse {
  status: number;
  message: string;
  success: boolean;
  data: Collection[];
}

class CollectionService {
  private collectionList: Collection[] | null = null;
  private collectionListPromise: Promise<Collection[]> | null = null;

  async getCollectionList(refresh = false): Promise<Collection[]> {
    if (!refresh && this.collectionList) {
      return this.collectionList;
    }
    if (!refresh && this.collectionListPromise) {
      return this.collectionListPromise;
    }

    this.collectionListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.collections);
        const payload = res.data;
        
        if (!payload.success) {
          return [];
        }

        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: Collection[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          _id: item._id,
          name: item.name,
          description: item.description,
          image: buildImageUrl(item.image),
          productCount: item.productCount,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.collectionList = mapped;
        return mapped;
      } catch (error) {
        console.error('Failed to fetch collections', error);
        this.collectionListPromise = null;
        return [];
      }
    })();

    return this.collectionListPromise;
  }

  async createCollection(data: Partial<Collection>, file?: File): Promise<Collection | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminCollections, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const newCollection: Collection = {
        id: item.id || item._id,
        name: item.name,
        image: buildImageUrl(item.image),
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.collectionList) {
        this.collectionList = [newCollection, ...this.collectionList];
      }

      return newCollection;
    } catch (error) {
      return null;
    }
  }

  async updateCollection(id: string, data: Partial<Collection>, file?: File): Promise<Collection | null> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      
      // Add image file
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminCollections}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const updatedCollection: Collection = {
        id: item.id || item._id,
        name: item.name,
        image: buildImageUrl(item.image),
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.collectionList) {
        this.collectionList = this.collectionList.map(col =>
          col.id === id ? updatedCollection : col
        );
      }

      return updatedCollection;
    } catch (error) {
      return null;
    }
  }

  async deleteCollection(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminCollections}/${id}`);
      
      if (this.collectionList) {
        this.collectionList = this.collectionList.filter(col => col.id !== id);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.collectionList = null;
    this.collectionListPromise = null;
  }
}

export const collectionService = new CollectionService();
