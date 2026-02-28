import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Trạm Truyện
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/novels/create"
              className="hover:text-blue-600 transition-colors"
            >
              Đăng truyện
            </Link>
            <Link
              href="/login"
              className="hover:text-blue-600 transition-colors"
            >
              Đăng nhập
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 text-center sm:text-left">
          <p className="text-xs text-gray-500">
            © {year} Trạm Truyện. Nền tảng đọc truyện trực tuyến.
          </p>
        </div>
      </div>
    </footer>
  );
}
