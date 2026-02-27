// File: src/services/novel.service.ts

import { api } from '@/core/api';
import { NovelResponse, PageResponse, NovelCreateRequest } from '@/types/novel';

export const novelService = {
  // Lấy danh sách tất cả các truyện
  getAllNovels: async (): Promise<PageResponse<NovelResponse>> => {
    // Gọi GET /api/v1/novels (trả về PageResponse<NovelResponse>)
    const response = await api.get<PageResponse<NovelResponse>>('/novels');
    return response.data;
  },

  // Lấy chi tiết 1 truyện theo ID
  getNovelById: async (id: string): Promise<NovelResponse> => {
    const response = await api.get<NovelResponse>(`/novels/${id}`);
    return response.data;
  },

  // Tạo mới một truyện (tác giả đăng truyện)
  createNovel: async (data: NovelCreateRequest): Promise<NovelResponse> => {
    const response = await api.post<NovelResponse>("/novels", data);
    return response.data;
  },
};