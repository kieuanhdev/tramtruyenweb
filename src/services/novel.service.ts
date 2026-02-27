// File: src/services/novel.service.ts

import { api } from '@/core/api';
import { NovelResponse } from '@/types/novel';

export const novelService = {
  // Lấy danh sách tất cả các truyện
  getAllNovels: async (): Promise<NovelResponse[]> => {
    // Gọi GET /api/v1/novels
    const response = await api.get<NovelResponse[]>('/novels');
    return response.data;
  }
};