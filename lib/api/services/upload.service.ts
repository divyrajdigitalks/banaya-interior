import api from '../axios';
import endPointApi from '../endpoints';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
  };
}

class UploadService {
  async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post(`${endPointApi.adminUpload}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const payload = res.data;
      
      if (payload?.success && payload?.data?.url) {
        return payload.data.url;
      }
      
      console.warn('Upload failed:', payload);
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }
}

export const uploadService = new UploadService();