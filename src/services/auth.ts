import apiService from './api';
import type { User, ApiResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      console.log('Login response:', response);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error(response.error || 'Login failed');
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<ApiResponse<SignupResponse>>('/auth/signup', data);
      console.log('Signup response:', response);
      if (response.success && response.data) {
        const loginResponse = await authApi.login({
          email: data.email,
          password: data.password,
        });
        return loginResponse;
      }
      throw new Error(response.error || 'Registration failed');
    } catch (error: unknown) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('localBookings');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiService.put<ApiResponse<User>>('/auth/profile', data);
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    throw new Error(response.error || 'Failed to update profile');
  },
};

export default authApi;
