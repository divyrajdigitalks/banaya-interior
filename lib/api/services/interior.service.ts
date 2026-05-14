import api from '../axios';
import endPointApi from '../endpoints';

export interface InteriorCategory {
  _id: string;
  name: string;
  description?: string;
}

export interface InteriorProject {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: string | { _id: string; name: string };
  image: string;
  isFeatured: boolean;
}

class InteriorService {
  // Categories
  async getCategories(): Promise<any> {
    const response = await api.get(endPointApi.interiorCategories);
    return response.data;
  }

  async createCategory(data: any): Promise<any> {
    const response = await api.post(endPointApi.interiorCategories, data);
    return response.data;
  }

  async updateCategory(id: string, data: any): Promise<any> {
    const response = await api.put(`${endPointApi.interiorCategories}/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<any> {
    const response = await api.delete(`${endPointApi.interiorCategories}/${id}`);
    return response.data;
  }

  // Projects
  async getProjects(params?: { isFeatured?: boolean }): Promise<any> {
    const response = await api.get(endPointApi.interiorProjects, { params });
    return response.data;
  }

  async createProject(data: any, imageFile?: File): Promise<any> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as string);
    });
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post(endPointApi.interiorProjects, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateProject(id: string, data: any, imageFile?: File): Promise<any> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as string);
    });
    if (imageFile) formData.append('image', imageFile);

    const response = await api.put(`${endPointApi.interiorProjects}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteProject(id: string): Promise<any> {
    const response = await api.delete(`${endPointApi.interiorProjects}/${id}`);
    return response.data;
  }
}

export const interiorService = new InteriorService();
