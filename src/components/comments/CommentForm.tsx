"use client";

import { useState } from "react";
import axios from "axios";
import { commentService } from "@/services/comment.service";
import { CommentResponse } from "@/types/comment";

interface CommentFormProps {
  novelId?: string;
  chapterId?: string;
  parentCommentId?: string | null;
  placeholder?: string;
  onCreated: (comment: CommentResponse) => void;
  onCancel?: () => void;
}

export function CommentForm({
  novelId,
  chapterId,
  parentCommentId,
  placeholder = "Viết bình luận...",
  onCreated,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const targetId = novelId || chapterId;
    if (!targetId) return;

    setIsSubmitting(true);
    setError("");
    try {
      const data = { content: content.trim(), parentCommentId: parentCommentId || undefined };
      const res = novelId
        ? await commentService.createCommentForNovel(novelId, data)
        : await commentService.createCommentForChapter(chapterId!, data);
      onCreated(res);
      setContent("");
      onCancel?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          (err.response.data as any)?.message || "Không gửi được bình luận."
        );
      } else {
        setError("Lỗi kết nối.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={parentCommentId ? 2 : 3}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        <div className="flex flex-col gap-1">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "..." : "Gửi"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </form>
  );
}
