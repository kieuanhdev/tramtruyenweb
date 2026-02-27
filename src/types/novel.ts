// File: src/types/novel.ts

export interface NovelResponse {
  id: string; // Hoặc number tùy theo bạn thiết lập UUID hay Auto Increment
  title: string;
  summary: string;
  coverUrl: string;
  totalViews: number;
  // Tùy thuộc vào Backend của bạn trả về tên tác giả/thể loại thế nào, bạn có thể thêm vào đây:
  // authorName?: string; 
  // categoryName?: string;
}