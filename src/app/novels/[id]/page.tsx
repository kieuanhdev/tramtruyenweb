"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { novelService } from "@/services/novel.service";
import { NovelResponse } from "@/types/novel";
import { authService } from "@/services/auth.service";

export default function NovelDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [novel, setNovel] = useState<NovelResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchNovel = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await novelService.getNovelById(id);
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
        setIsLoading(false);
      }
    };

    fetchNovel();
  }, [id]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleBack = () => {
    router.push("/");
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-red-600 text-center">
            {error}
          </div>
        ) : !novel ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            Không tìm thấy truyện.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Ảnh bìa */}
              <div className="md:w-1/3">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md bg-gray-200">
                  {novel.coverUrl ? (
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                      No Cover
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                    {novel.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span>Tác giả: {novel.authorName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {novel.categoryName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-500">
                  <span>👁️ {novel.totalViews ?? 0} lượt đọc</span>
                  <span>
                    Trạng thái:{" "}
                    <span className="font-medium text-gray-700">
                      {novel.status}
                    </span>
                  </span>
                  <span>
                    Ngày tạo:{" "}
                    {new Date(novel.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tóm tắt
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {novel.summary || "Chưa có tóm tắt cho truyện này."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

