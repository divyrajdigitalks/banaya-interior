import api from '../axios';
import endPointApi from '../endpoints';

export interface ProcessStep {
  id: string;
  iconId: string;
  step: string;
  title: string;
  desc: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessStepListResponse {
  status: number;
  message: string;
  data: ProcessStep[];
}

export interface ProcessStepSingleResponse {
  status: number;
  message: string;
  data: ProcessStep;
}

class ProcessService {
  private processStepList: ProcessStep[] | null = null;
  private processStepListPromise: Promise<ProcessStep[]> | null = null;

  async getProcessStepList(refresh = false): Promise<ProcessStep[]> {
    if (!refresh && this.processStepList) {
      return this.processStepList;
    }
    if (!refresh && this.processStepListPromise) {
      return this.processStepListPromise;
    }

    this.processStepListPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminProcessSteps, {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: ProcessStep[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          iconId: item.iconId,
          step: item.step,
          title: item.title,
          desc: item.desc,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        this.processStepList = mapped;
        return mapped;
      } catch (error) {
        this.processStepListPromise = null;
        return [];
      }
    })();

    return this.processStepListPromise;
  }

  async getProcessStep(id: string): Promise<ProcessStep | null> {
    try {
      const res = await api.get(`${endPointApi.adminProcessSteps}/${id}`);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      return {
        id: item.id || item._id,
        iconId: item.iconId,
        step: item.step,
        title: item.title,
        desc: item.desc,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async createProcessStep(data: Partial<ProcessStep>): Promise<ProcessStep | null> {
    try {
      const res = await api.post(endPointApi.adminProcessSteps, data);
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const newStep: ProcessStep = {
        id: item.id || item._id,
        iconId: item.iconId,
        step: item.step,
        title: item.title,
        desc: item.desc,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.processStepList) {
        this.processStepList = [...this.processStepList, newStep];
      }

      return newStep;
    } catch (error) {
      return null;
    }
  }

  async updateProcessStep(id: string, data: Partial<ProcessStep>): Promise<ProcessStep | null> {
    try {
      const res = await api.put(`${endPointApi.adminProcessSteps}/${id}`, data);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;

      const updatedStep: ProcessStep = {
        id: item.id || item._id,
        iconId: item.iconId,
        step: item.step,
        title: item.title,
        desc: item.desc,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.processStepList) {
        this.processStepList = this.processStepList.map(step =>
          step.id === id ? updatedStep : step
        );
      }

      return updatedStep;
    } catch (error) {
      return null;
    }
  }

  async deleteProcessStep(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminProcessSteps}/${id}`);

      if (this.processStepList) {
        this.processStepList = this.processStepList.filter(step => step.id !== id);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.processStepList = null;
    this.processStepListPromise = null;
  }
}

export const processService = new ProcessService();
