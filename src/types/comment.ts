export interface CommentResponse {
  id: string;
  userId: string;
  userFullName: string;
  userAvatarUrl: string | null;
  content: string;
  createdAt: string;
  novelId: string | null;
  chapterId: string | null;
  parentCommentId: string | null;
  replies: CommentResponse[];
}

export interface CommentCreateRequest {
  content: string;
  parentCommentId?: string | null;
}
