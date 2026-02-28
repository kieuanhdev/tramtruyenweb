"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { commentService } from "@/services/comment.service";
import { CommentResponse } from "@/types/comment";
import { authService } from "@/services/auth.service";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  novelId?: string;
  chapterId?: string;
  title?: string;
}

export function CommentSection({ novelId, chapterId, title = "Bình luận" }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const targetId = novelId || chapterId;
  const fetchComments = novelId
    ? () => commentService.getCommentsByNovel(novelId, page, 10)
    : chapterId
    ? () => commentService.getCommentsByChapter(chapterId, page, 10)
    : null;

  useEffect(() => {
    setIsLoggedIn(!!authService.getToken());
  }, []);

  useEffect(() => {
    if (!targetId || !fetchComments) return;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetchComments();
        setComments(res.content || []);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError((err.response.data as any)?.message || "Không tải được bình luận.");
        } else {
          setError("Lỗi kết nối.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [targetId, page]);

  const handleCommentCreated = (newComment: CommentResponse) => {
    if (newComment.parentCommentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === newComment.parentCommentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      );
    } else {
      setComments((prev) => [newComment, ...prev]);
      setTotalElements((n) => n + 1);
    }
  };

  const handleCommentDeleted = (commentId: string, parentId: string | null) => {
    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: (c.replies || []).filter((r) => r.id !== commentId) }
            : c
        )
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
    setTotalElements((n) => Math.max(0, n - 1));
  };

  const handleCommentUpdated = (updated: CommentResponse) => {
    if (updated.parentCommentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === updated.parentCommentId
            ? {
                ...c,
                replies: (c.replies || []).map((r) =>
                  r.id === updated.id ? updated : r
                ),
              }
            : c
        )
      );
    } else {
      setComments((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    }
  };

  if (!targetId) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {isLoggedIn && (
        <CommentForm
          novelId={novelId}
          chapterId={chapterId}
          onCreated={handleCommentCreated}
        />
      )}

      {!isLoggedIn && (
        <p className="text-sm text-gray-500 mb-4">
          Đăng nhập để bình luận.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 py-6">Chưa có bình luận nào.</p>
      ) : (
        <ul className="divide-y divide-gray-100 mt-4 space-y-4">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              novelId={novelId}
              chapterId={chapterId}
              isLoggedIn={isLoggedIn}
              onDeleted={handleCommentDeleted}
              onUpdated={handleCommentUpdated}
              onReplyCreated={handleCommentCreated}
            />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-600">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
