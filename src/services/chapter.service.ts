import { api } from "@/core/api";
import {
  ChapterListResponse,
  ChapterResponse,
  PageResponse,
} from "@/types/novel";

export const chapterService = {
  // Danh sách chương theo truyện
  getChaptersByNovel: async (
    novelId: string
  ): Promise<PageResponse<ChapterListResponse>> => {
    const response = await api.get<PageResponse<ChapterListResponse>>(
      `/novels/${novelId}/chapters`
    );
    return response.data;
  },

  // Chi tiết 1 chương
  getChapterDetail: async (id: string): Promise<ChapterResponse> => {
    const response = await api.get<ChapterResponse>(`/chapters/${id}`);
    return response.data;
  },
};

