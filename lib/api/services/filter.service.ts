import api from '../axios';
import endPointApi from '../endpoints';

export interface FilterOption {
  id: string;
  name: string;
  filterGroup: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterOptionListResponse {
  status: number;
  message: string;
  data: FilterOption[];
}

export interface FilterOptionsByGroup {
  [key: string]: string[];
}

class FilterService {
  private filterOptionList: FilterOption[] | null = null;
  private filterOptionListPromise: Promise<FilterOption[]> | null = null;

  async getFilterOptionList(refresh = false, filterGroup?: string): Promise<FilterOption[]> {
    if (!refresh && this.filterOptionList && !filterGroup) {
      return this.filterOptionList;
    }

    const fetchPromise = (async () => {
      try {
        const res = await api.get(endPointApi.adminFilterOptions, {
          params: {
            page: 1,
            limit: 100,
            filterGroup,
          },
        });

        const payload = res.data;
        const rawList = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: FilterOption[] = rawList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          filterGroup: item.filterGroup,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        if (!filterGroup) {
          this.filterOptionList = mapped;
        }
        return mapped;
      } catch (error) {
        if (!filterGroup) {
          this.filterOptionListPromise = null;
        }
        return [];
      }
    })();

    if (!filterGroup) {
      this.filterOptionListPromise = fetchPromise;
    }

    return fetchPromise;
  }

  async getFilterOptionsByGroup(refresh = false): Promise<FilterOptionsByGroup> {
    const filterOptions = await this.getFilterOptionList(refresh);
    const grouped: FilterOptionsByGroup = {};
    
    filterOptions.forEach(option => {
      if (!grouped[option.filterGroup]) {
        grouped[option.filterGroup] = [];
      }
      grouped[option.filterGroup].push(option.name);
    });

    return grouped;
  }

  async createFilterOption(data: Partial<FilterOption>): Promise<FilterOption | null> {
    try {
      const res = await api.post(endPointApi.adminFilterOptionCreate, data);
      
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const newFilterOption: FilterOption = {
        id: item.id || item._id,
        name: item.name,
        filterGroup: item.filterGroup,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.filterOptionList) {
        this.filterOptionList = [newFilterOption, ...this.filterOptionList];
      }

      return newFilterOption;
    } catch (error) {
      return null;
    }
  }

  async updateFilterOption(id: string, data: Partial<FilterOption>): Promise<FilterOption | null> {
    try {
      const res = await api.put(`${endPointApi.adminFilterOptionUpdate}/${id}`, data);
      const payload = res.data;

      if (!payload || !payload.data) {
        return null;
      }

      const item = payload.data;
      const updatedFilterOption: FilterOption = {
        id: item.id || item._id,
        name: item.name,
        filterGroup: item.filterGroup,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (this.filterOptionList) {
        this.filterOptionList = this.filterOptionList.map(opt =>
          opt.id === id ? updatedFilterOption : opt
        );
      }

      return updatedFilterOption;
    } catch (error) {
      return null;
    }
  }

  async deleteFilterOption(id: string): Promise<boolean> {
    try {
      await api.delete(`${endPointApi.adminFilterOptionDelete}/${id}`);
      
      if (this.filterOptionList) {
        this.filterOptionList = this.filterOptionList.filter(opt => opt.id !== id);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  clearCache() {
    this.filterOptionList = null;
    this.filterOptionListPromise = null;
  }
}

export const filterService = new FilterService();
