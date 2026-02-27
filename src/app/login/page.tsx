"use client"; // Bắt buộc phải có để dùng useState và useRouter trong Next.js App Router

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  
  // Quản lý trạng thái (State) của Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi người dùng bấm nút Đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt tự động load lại trang
    setError("");
    setIsLoading(true);

    try {
      // 1. Gọi API xuống Spring Boot
      const response = await authService.login({ email, password });
      
      // 2. Lưu Token vào LocalStorage
      authService.saveToken(response.accessToken);
      
      // 3. Chuyển hướng về Trang chủ
      router.push("/");
      
    } catch (err: unknown) {
      // Bắt lỗi từ Backend (Cái GlobalExceptionHandler chúng ta vừa làm đấy!)
      if (axios.isAxiosError(err) && err.response) {
        // Lấy câu thông báo lỗi từ JSON của Spring Boot trả về
        setError(err.response.data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      } else {
        setError("Lỗi kết nối đến máy chủ!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Trạm Truyện</h2>
          <p className="text-gray-500 mt-2">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Khung hiển thị lỗi (Màu đỏ) */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {/* Form điền thông tin */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="nhap-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all 
              ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"}`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
}