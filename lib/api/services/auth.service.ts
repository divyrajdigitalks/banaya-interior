import api from '../axios';
import endPointApi from '../endpoints';

export interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
    role: string;
    token: string;
  };
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(endPointApi.register, data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(endPointApi.adminLogin, data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean }> {
    try {
      await api.post(endPointApi.logout);
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get profile'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await api.put<{ success: boolean; data: User }>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update profile'
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post<{ success: boolean }>('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to change password'
      };
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send reset email'
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: { token: string; password: string; confirmPassword: string }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to reset password'
      };
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to verify email'
      };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/resend-verification', { email });
      return response.data;
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to resend verification email'
      };
    }
  }
}

export const authService = new AuthService();