"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { novelService } from "@/services/novel.service";
import { chapterService } from "@/services/chapter.service";
import { ChapterCreateRequest, NovelResponse } from "@/types/novel";
import { authService } from "@/services/auth.service";

export default function CreateChapterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const novelId = params?.id as string | undefined;

  const [novel, setNovel] = useState<NovelResponse | null>(null);
  const [form, setForm] = useState<ChapterCreateRequest>({
    chapterNo: 1,
    title: "",
    content: "",
    isPublished: true,
  });

  const [isLoadingNovel, setIsLoadingNovel] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!novelId) return;

    const fetchNovel = async () => {
      try {
        const data = await novelService.getNovelById(novelId);
        setNovel(data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            (err.response.data as any)?.message ||
              "Không tải được thông tin truyện."
          );
        } else {
          setError("Lỗi kết nối đến máy chủ.");
        }
      } finally {
        setIsLoadingNovel(false);
      }
    };

    fetchNovel();
  }, [novelId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "chapterNo"
            ? Math.max(1, parseInt(value, 10) || 1)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload: ChapterCreateRequest = {
        chapterNo: form.chapterNo,
        title: form.title.trim(),
        content: form.content.trim(),
        isPublished: form.isPublished ?? true,
      };

      await chapterService.createChapter(novelId, payload);

      setSuccess("Đăng chương thành công!");

      setTimeout(() => {
        router.push(`/novels/${novelId}`);
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const message = (err.response.data as any)?.message;
        if (err.response.status === 403) {
          setError(
            message ||
              "Bạn không có quyền đăng chương cho truyện này. Chỉ tác giả hoặc admin mới được phép."
          );
        } else {
          setError(
            message ||
              "Đăng chương thất bại. Kiểm tra số thứ tự chương có trùng không."
          );
        }
      } else {
        setError("Lỗi kết nối đến máy chủ.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleBack = () => {
    router.push(`/novels/${novelId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              ← Quay lại
            </button>
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
              Trạm Truyện
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Nội dung */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng chương mới
          </h2>
          {novel && (
            <p className="text-sm text-gray-500 mb-6">
              Truyện: <span className="font-medium text-gray-700">{novel.title}</span>
            </p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
              {success}
            </div>
          )}

          {isLoadingNovel ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : !novel ? (
            <p className="text-sm text-gray-500">Không tìm thấy truyện.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số thứ tự chương
                </label>
                <input
                  type="number"
                  name="chapterNo"
                  value={form.chapterNo}
                  onChange={handleChange}
                  min={1}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Số thứ tự phải từ 1 trở lên và không trùng với chương đã có.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề chương
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Chương 1: Khởi đầu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung chương
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y font-mono text-sm"
                  placeholder="Viết nội dung chương truyện..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={form.isPublished ?? true}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-700">
                  Xuất bản ngay (để trống = lưu nháp)
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all
                  ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
              >
                {isSubmitting ? "Đang đăng chương..." : "Đăng chương"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
