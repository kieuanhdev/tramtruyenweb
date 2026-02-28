import { api } from "@/core/api";
import {
  CommentCreateRequest,
  CommentResponse,
  PageResponse,
} from "@/types/comment";

export const commentService = {
  getCommentsByNovel: async (
    novelId: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<CommentResponse>> => {
    const response = await api.get<PageResponse<CommentResponse>>(
      `/novels/${novelId}/comments`,
      { params: { page, size } }
    );
    return response.data;
  },

  createCommentForNovel: async (
    novelId: string,
    data: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>(
      `/novels/${novelId}/comments`,
      data
    );
    return response.data;
  },

  getCommentsByChapter: async (
    chapterId: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<CommentResponse>> => {
    const response = await api.get<PageResponse<CommentResponse>>(
      `/chapters/${chapterId}/comments`,
      { params: { page, size } }
    );
    return response.data;
  },

  createCommentForChapter: async (
    chapterId: string,
    data: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>(
      `/chapters/${chapterId}/comments`,
      data
    );
    return response.data;
  },

  updateComment: async (
    commentId: string,
    content: string
  ): Promise<CommentResponse> => {
    const response = await api.put<CommentResponse>(`/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};
