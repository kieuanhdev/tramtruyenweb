"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { commentService } from "@/services/comment.service";
import { CommentResponse } from "@/types/comment";
import { CommentForm } from "./CommentForm";
import { getAvatarUrl } from "@/core/utils";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUserId != null && currentUserId === comment.userId;
  const isAdmin = currentUserRole === "ADMIN";
  const canEditOrDelete = isOwner || isAdmin;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setAvatarError(false);
  }, [comment.userAvatarUrl]);

  const handleDeleteClick = () => {
    setShowMoreMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
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

  const handleEditClick = () => {
    setShowMoreMenu(false);
    setIsEditing(true);
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thích bình luận.");
      return;
    }
    setIsLiking(true);
    try {
      const updated = await commentService.toggleLike(comment.id);
      onUpdated(updated);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        alert((err.response.data as any)?.message || "Không thể thích.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để bày tỏ không thích.");
      return;
    }
    setIsDisliking(true);
    try {
      const updated = await commentService.toggleDislike(comment.id);
      onUpdated(updated);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        alert((err.response.data as any)?.message || "Không thể bày tỏ.");
      }
    } finally {
      setIsDisliking(false);
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
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
          {comment.userAvatarUrl && !avatarError ? (
            <img
              src={getAvatarUrl(comment.userAvatarUrl) || comment.userAvatarUrl}
              alt={comment.userFullName || "Avatar"}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{comment.userFullName?.charAt(0)?.toUpperCase() || "?"}</span>
          )}
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

          {!isEditing && (
            <div className="flex items-center gap-4 mt-2 text-xs">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
                  comment.userReaction === "LIKE"
                    ? "text-blue-600 font-medium"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                title="Thích"
              >
                <svg
                  className="w-4 h-4"
                  fill={comment.userReaction === "LIKE" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Thích {(comment.likeCount ?? 0) > 0 && <span>({comment.likeCount})</span>}
              </button>
              <button
                onClick={handleDislike}
                disabled={isDisliking}
                className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
                  comment.userReaction === "DISLIKE"
                    ? "text-red-600 font-medium"
                    : "text-gray-500 hover:text-red-600"
                }`}
                title="Không thích"
              >
                <svg
                  className="w-4 h-4"
                  fill={comment.userReaction === "DISLIKE" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2M5 4h2a2 2 0 012 2v6a2 2 0 01-2 2H5" />
                </svg>
                Không thích {(comment.dislikeCount ?? 0) > 0 && <span>({comment.dislikeCount})</span>}
              </button>
              {isLoggedIn && !comment.parentCommentId && (
                <button
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Phản hồi
                </button>
              )}
              {canEditOrDelete && (
                <div className="relative ml-auto" ref={moreMenuRef}>
                  <button
                    onClick={() => setShowMoreMenu((v) => !v)}
                    className="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title="Tùy chọn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                  {showMoreMenu && (
                    <div
                      className="absolute right-0 top-full mt-1 py-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {isOwner && (
                        <button
                          type="button"
                          onClick={handleEditClick}
                          className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          Sửa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50 text-sm"
                      >
                        {isDeleting ? "Đang xóa..." : "Xóa"}
                      </button>
                    </div>
                  )}
                </div>
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <p className="text-gray-800 font-medium mb-4">
              Bạn có chắc chắn muốn xóa bình luận này?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
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
