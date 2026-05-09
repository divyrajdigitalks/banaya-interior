import api from '../axios';

export interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: {
      _id: string;
      name: string;
    };
  };
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data: Wishlist;
  message?: string;
}

export interface CheckWishlistResponse {
  success: boolean;
  data: { inWishlist: boolean };
}

class WishlistService {
  /**
   * Get user wishlist
   */
  async getWishlist(): Promise<WishlistResponse> {
    try {
      const response = await api.get<WishlistResponse>('/wishlist');
      return response.data;
    } catch (error: any) {
      console.error('Get wishlist error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to get wishlist'
      };
    }
  }

  /**
   * Add item to wishlist
   */
  async addToWishlist(productId: string): Promise<WishlistResponse> {
    try {
      const response = await api.post<WishlistResponse>('/wishlist/add', { productId });
      return response.data;
    } catch (error: any) {
      console.error('Add to wishlist error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to add to wishlist'
      };
    }
  }

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(productId: string): Promise<WishlistResponse> {
    try {
      const response = await api.delete<WishlistResponse>(`/wishlist/remove/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to remove from wishlist'
      };
    }
  }

  /**
   * Clear wishlist
   */
  async clearWishlist(): Promise<WishlistResponse> {
    try {
      const response = await api.delete<WishlistResponse>('/wishlist/clear');
      return response.data;
    } catch (error: any) {
      console.error('Clear wishlist error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to clear wishlist'
      };
    }
  }

  /**
   * Check if item is in wishlist
   */
  async checkWishlistItem(productId: string): Promise<CheckWishlistResponse> {
    try {
      const response = await api.get<CheckWishlistResponse>(`/wishlist/check/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Check wishlist error:', error);
      return {
        success: false,
        data: { inWishlist: false }
      };
    }
  }
}

export const wishlistService = new WishlistService();