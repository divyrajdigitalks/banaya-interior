import api from '../axios';

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string };
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  avgRating: number;
  count: number;
}

class ReviewService {
  async canReview(productId: string): Promise<{ canReview: boolean; alreadyReviewed: boolean }> {
    try {
      const res = await api.get(`reviews/${productId}/can-review`);
      return res.data;
    } catch {
      return { canReview: false, alreadyReviewed: false };
    }
  }

  async getProductReviews(productId: string): Promise<ReviewsResponse> {
    try {
      const res = await api.get<ReviewsResponse>(`reviews/${productId}`);
      return res.data;
    } catch {
      return { success: false, data: [], avgRating: 0, count: 0 };
    }
  }

  async addReview(productId: string, data: { rating: number; title?: string; comment: string }): Promise<{ success: boolean; data?: Review; error?: string }> {
    try {
      const res = await api.post(`reviews/${productId}`, data);
      return res.data;
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to submit review' };
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      await api.delete(`reviews/${reviewId}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const reviewService = new ReviewService();
