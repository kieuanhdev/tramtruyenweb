"use client";

import { useState } from "react";
import axios from "axios";
import { commentService } from "@/services/comment.service";
import { CommentResponse } from "@/types/comment";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: CommentResponse;
  novelId?: string;
  chapterId?: string;
  isLoggedIn: boolean;
  currentUserId: string | null;
  currentUserRole: string | null;
  onDeleted: (id: string, parentId: string | null) => void;
  onUpdated: (comment: CommentResponse) => void;
  onReplyCreated: (comment: CommentResponse) => void;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  novelId,
  chapterId,
  isLoggedIn,
  currentUserId,
  currentUserRole,
  onDeleted,
  onUpdated,
  onReplyCreated,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId != null && currentUserId === comment.userId;
  const isAdmin = currentUserRole === "ADMIN";

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    setIsDeleting(true);
    try {
      await commentService.deleteComment(comment.id);
      onDeleted(comment.id, comment.parentCommentId);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        alert((err.response.data as any)?.message || "Không xóa được.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    try {
      const updated = await commentService.updateComment(comment.id, editContent.trim());
      onUpdated(updated);
      setIsEditing(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        alert((err.response.data as any)?.message || "Không sửa được.");
      }
    }
  };

  const ml = isReply ? "ml-8 sm:ml-12" : "";

  return (
    <li className={`py-3 ${ml}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
          {comment.userFullName?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">{comment.userFullName}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2 flex gap-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleUpdate}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {!isEditing && isLoggedIn && (
            <div className="flex gap-3 mt-2">
              {!comment.parentCommentId && (
                <button
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Phản hồi
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Sửa
                </button>
              )}
              {(isOwner || isAdmin) && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Xóa
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showReplyForm && novelId && !comment.parentCommentId && (
        <div className="mt-3 ml-11">
          <CommentForm
            novelId={novelId}
            chapterId={chapterId}
            parentCommentId={comment.id}
            placeholder="Viết phản hồi..."
            onCreated={(c) => {
              onReplyCreated(c);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

          {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-3 space-y-2">
          {comment.replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              novelId={novelId}
              chapterId={chapterId}
              isLoggedIn={isLoggedIn}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
              onDeleted={onDeleted}
              onUpdated={onUpdated}
              onReplyCreated={onReplyCreated}
              isReply
            />
          ))}
        </ul>
      )}
    </li>
  );
}
