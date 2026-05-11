import api from '../axios';

export interface LegacyProject {
  _id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  createdAt?: string;
}

export interface LegacySettings {
  _id?: string;
  topLabel: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
}

export interface LegacyProjectResponse {
  success: boolean;
  data: LegacyProject[];
}

export interface LegacySingleProjectResponse {
  success: boolean;
  data: LegacyProject;
}

export interface LegacySettingsResponse {
  success: boolean;
  data: LegacySettings;
}

class LegacyProjectService {
  // Settings
  async getSettings(): Promise<LegacySettingsResponse> {
    const response = await api.get('/legacy-projects/settings');
    return response.data;
  }

  async updateSettings(data: Partial<LegacySettings>): Promise<LegacySettingsResponse> {
    const response = await api.put('/legacy-projects/settings', data);
    return response.data;
  }

  // Projects
  async getProjects(): Promise<LegacyProjectResponse> {
    const response = await api.get('/legacy-projects');
    return response.data;
  }

  async createProject(data: any, imageFile?: File): Promise<LegacySingleProjectResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'image') formData.append(key, value as string);
    });
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post('/legacy-projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateProject(id: string, data: any, imageFile?: File): Promise<LegacySingleProjectResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // Don't append image if it's a blob URL (local preview)
      if (value !== undefined && key === 'image') {
        if (typeof value === 'string' && !value.startsWith('blob:')) {
          formData.append(key, value);
        }
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    if (imageFile) formData.append('image', imageFile);

    const response = await api.put(`/legacy-projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteProject(id: string): Promise<any> {
    const response = await api.delete(`/legacy-projects/${id}`);
    return response.data;
  }
}

export const legacyProjectService = new LegacyProjectService();
