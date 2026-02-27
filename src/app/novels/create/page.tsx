"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { categoryService } from "@/services/category.service";
import { novelService } from "@/services/novel.service";
import { CategoryResponse, NovelCreateRequest } from "@/types/novel";
import { authService } from "@/services/auth.service";

export default function CreateNovelPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [form, setForm] = useState<NovelCreateRequest>({
    categoryId: 0,
    title: "",
    summary: "",
    coverUrl: "",
  });

  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            (err.response.data as any)?.message ||
              "Không tải được danh sách thể loại."
          );
        } else {
          setError("Lỗi kết nối đến máy chủ khi tải thể loại.");
        }
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload: NovelCreateRequest = {
        categoryId: form.categoryId,
        title: form.title.trim(),
        summary: form.summary.trim(),
        coverUrl: form.coverUrl?.trim() || undefined,
      };

      const created = await novelService.createNovel(payload);

      setSuccess("Đăng truyện thành công!");

      // Chuyển sang trang chi tiết truyện vừa tạo
      setTimeout(() => {
        router.push(`/novels/${created.id}`);
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const message = (err.response.data as any)?.message;
        if (err.response.status === 403) {
          setError(
            message ||
              "Bạn không có quyền đăng truyện. Hãy dùng tài khoản tác giả hoặc admin."
          );
        } else {
          setError(
            message || "Đăng truyện thất bại. Vui lòng kiểm tra lại thông tin."
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng truyện mới
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Dành cho tác giả. Hãy điền đầy đủ thông tin truyện của bạn.
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thể loại
              </label>
              {isLoadingCategories ? (
                <div className="text-sm text-gray-500">Đang tải thể loại...</div>
              ) : categories.length === 0 ? (
                <div className="text-sm text-red-500">
                  Chưa có thể loại nào. Hãy tạo thể loại trong trang quản trị /
                  swagger trước.
                </div>
              ) : (
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên truyện
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Nhập tên truyện"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tóm tắt
              </label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y"
                placeholder="Viết một đoạn tóm tắt nội dung truyện..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh bìa (URL)
                <span className="ml-1 text-gray-400 text-xs">
                  (không bắt buộc)
                </span>
              </label>
              <input
                type="url"
                name="coverUrl"
                value={form.coverUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingCategories || categories.length === 0}
              className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all
                ${
                  isSubmitting || isLoadingCategories || categories.length === 0
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
            >
              {isSubmitting ? "Đang đăng truyện..." : "Đăng truyện"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

