// File: src/app/page.tsx
"use client"; // Dùng Client Component để fetch data bằng useEffect cho nhanh ở bước đầu

import { useEffect, useState } from "react";
import { novelService } from "@/services/novel.service";
import { NovelResponse } from "@/types/novel";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [novels, setNovels] = useState<NovelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vừa vào trang là tự động hút dữ liệu từ Backend
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const data = await novelService.getAllNovels();
        
        // 1. In ra console để xem mặt mũi thực sự của data (Bấm F12 trên trình duyệt để xem)
        console.log("Dữ liệu từ Backend:", data); 

        // 2. LỚP PHÒNG THỦ: Kiểm tra xem data nó là hình thù gì
        if (Array.isArray(data)) {
          // Trường hợp 1: API trả về thẳng một mảng (List)
          setNovels(data);
        } else if (data && Array.isArray((data as any).content)) {
          // Trường hợp 2: API trả về phân trang của Spring Boot (Page)
          setNovels((data as any).content);
        } else if (data && Array.isArray((data as any).data)) {
          // Trường hợp 3: API trả về có bọc wrapper tự chế (VD: { "data": [...] })
          setNovels((data as any).data);
        } else {
          // Nếu không phải mảng, ép nó về mảng rỗng để web không bị sập (tránh lỗi .map is not a function)
          setNovels([]); 
        }

      } catch (error) {
        console.error("Lỗi khi tải danh sách truyện:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovels();
  }, []);

  // Hàm Đăng xuất
  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Thanh Header (Navbar) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">Trạm Truyện</h1>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Truyện Mới Cập Nhật</h2>
          <p className="mt-2 text-gray-500 text-sm">Khám phá những bộ truyện hot nhất hôm nay.</p>
        </div>

        {/* Trạng thái Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : novels.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
            Hiện tại chưa có bộ truyện nào. Hãy dùng Swagger để đăng truyện nhé!
          </div>
        ) : (
          /* Lưới Grid hiển thị truyện */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {novels.map((novel) => (
              <div key={novel.id} className="group cursor-pointer flex flex-col">
                
                {/* Khung Ảnh Bìa */}
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl bg-gray-200">
                  {/* Nếu DB chưa có ảnh thì hiển thị cái div màu xám, nếu có thì hiện thẻ img */}
                  {novel.coverUrl ? (
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">No Cover</div>
                  )}
                  
                  {/* Lớp phủ mờ mờ khi di chuột vào (Hover effect) */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                </div>

                {/* Thông tin truyện */}
                <div className="mt-3 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {novel.title}
                  </h3>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>👁️ {novel.totalViews || 0} lượt đọc</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}