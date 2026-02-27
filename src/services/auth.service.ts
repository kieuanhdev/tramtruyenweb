import { api } from '@/core/api';
import { LoginRequest, AuthResponse } from '@/types/auth';

export const authService = {
  // Hàm gọi API Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data; // Trả về data chứa accessToken
  },

  // Hàm tiện ích: Lưu token vào LocalStorage
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },

  // Hàm tiện ích: Đăng xuất (Xóa token)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }
};