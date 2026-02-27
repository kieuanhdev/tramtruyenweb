// File: src/types/novel.ts

export interface NovelResponse {
  id: string; // UUID từ Backend
  title: string;
  authorName: string;
  categoryName: string;
  summary: string;
  coverUrl: string | null;
  status: string;
  totalViews: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}