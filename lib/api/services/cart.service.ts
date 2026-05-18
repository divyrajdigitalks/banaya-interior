import api from '../axios';
import endPointApi from '../endpoints';

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string;
    subcategoryId?: any;
    stock?: number;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

class CartService {
  /**
   * Get user cart
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await api.get<CartResponse>(endPointApi.cart);
      return response.data;
    } catch (error: any) {
      console.error('Get cart error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to get cart'
      };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(productId: string, quantity: number = 1, personalization?: any): Promise<CartResponse> {
    try {
      const response = await api.post<CartResponse>(endPointApi.cartAdd, { productId, quantity, personalization });
      return response.data;
    } catch (error: any) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to add to cart'
      };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(productId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await api.put<CartResponse>(endPointApi.cartUpdate, { productId, quantity });
      return response.data;
    } catch (error: any) {
      console.error('Update cart error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to update cart'
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: string): Promise<CartResponse> {
    try {
      const response = await api.delete<CartResponse>(`${endPointApi.cartRemove}/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to remove from cart'
      };
    }
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<CartResponse> {
    try {
      const response = await api.delete<CartResponse>(endPointApi.cartClear);
      return response.data;
    } catch (error: any) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        data: { _id: '', user: '', items: [], createdAt: '', updatedAt: '' },
        message: error.response?.data?.error || error.message || 'Failed to clear cart'
      };
    }
  }
}

export const cartService = new CartService();