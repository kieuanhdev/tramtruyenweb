"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { UserResponse } from "@/types/user";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authService.getToken()) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
        setFullName(data.fullName);
        setAvatarUrl(data.avatarUrl || "");
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            (err.response.data as any)?.message || "Không tải được thông tin."
          );
        } else {
          setError("Lỗi kết nối đến máy chủ.");
        }
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const updated = await userService.updateCurrentUser({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setUser(updated);
      setSuccess("Cập nhật thông tin thành công!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as any;
        setError(data?.message || "Cập nhật thất bại.");
      } else {
        setError("Lỗi kết nối đến máy chủ.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Chỉnh sửa thông tin cá nhân
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-gray-200">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email không thể thay đổi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện (URL)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-3 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
