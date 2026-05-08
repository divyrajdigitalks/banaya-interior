import api, { buildImageUrl } from '../axios';
import endPointApi from '../endpoints';

export interface Project {
  id: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  image?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectListResponse {
  status: number;
  message: string;
  data: Project[];
}

export interface ProjectSingleResponse {
  status: number;
  message: string;
  data: Project;
}

class ProjectService {
  private projectList: Project[] | null = null;
  private projectListPromise: Promise<Project[]> | null = null;

  async getProjectList(refresh = false): Promise<Project[]> {
    if (!refresh && this.projectList) {
      return this.projectList;
    }
    if (!refresh && this.projectListPromise) {
      return this.projectListPromise;
    }

    this.projectListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminProjects, {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: Project[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          description: item.description,
          image: buildImageUrl(item.image),
          location: item.location,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.projectList = mapped;
        return mapped;
      } catch (error) {
        this.projectListPromise = null;
        return [];
      }
    })();

    return this.projectListPromise;
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const res = await api.get(`${endPointApi.adminProjects}/${id}`);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        description: item.description,
        image: buildImageUrl(item.image),
        location: item.location,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async createProject(data: Partial<Project>, file?: File): Promise<Project | null> {
    try {
      const formData = new FormData();
      
      if (data.name) formData.append('name', data.name);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.categoryName) formData.append('categoryName', data.categoryName);
      if (data.description) formData.append('description', data.description);
      if (data.location) formData.append('location', data.location);
      
      if (file) {
        formData.append('image', file);
      }

      const res = await api.post(endPointApi.adminProjects, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const newProject: Project = {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        description: item.description,
        image: buildImageUrl(item.image),
        location: item.location,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.projectList) {
        this.projectList = [newProject, ...this.projectList];
      }

      return newProject;
    } catch (error) {
      return null;
    }
  }

  async updateProject(id: string, data: Partial<Project>, file?: File): Promise<Project | null> {
    try {
      const formData = new FormData();
      
      if (data.name) formData.append('name', data.name);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.categoryName) formData.append('categoryName', data.categoryName);
      if (data.description) formData.append('description', data.description);
      if (data.location) formData.append('location', data.location);
      if (data.image) formData.append('image', data.image);
      
      if (file) {
        formData.append('image', file);
      }

      const res = await api.put(`${endPointApi.adminProjects}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const updatedProject: Project = {
        id: item.id || item._id,
        name: item.name,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        description: item.description,
        image: buildImageUrl(item.image),
        location: item.location,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.projectList) {
        this.projectList = this.projectList.map(proj =>
          proj.id === id ? updatedProject : proj
        );
      }

      return updatedProject;
    } catch (error) {
      return null;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminProjects}/${id}`);

      if (this.projectList) {
        this.projectList = this.projectList.filter(proj => proj.id !== id);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.projectList = null;
    this.projectListPromise = null;
  }
}

export const projectService = new ProjectService();
