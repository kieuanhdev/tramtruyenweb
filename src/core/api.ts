import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trạm kiểm soát trước khi gửi Request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ bộ nhớ trình duyệt (localStorage)
    // Lưu ý: Lúc làm SSR (Server-Side Rendering) ta sẽ cấu hình thêm đọc từ Cookie sau
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);