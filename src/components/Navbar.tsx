"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!authService.getToken());
  }, [pathname]); // Re-check auth when route changes (e.g. after login/logout)

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isNovelDetail = /^\/novels\/[^/]+$/.test(pathname);
  const isChapterCreate = /^\/novels\/[^/]+\/chapters\/create$/.test(pathname);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleBack = () => router.back();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          {(isNovelDetail || isChapterCreate || pathname === "/novels/create" || pathname.startsWith("/chapters/")) && (
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              ← Quay lại
            </button>
          )}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Trạm Truyện
          </Link>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {!isLoginPage && !isRegisterPage && (
                <Link
                  href="/novels/create"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  Đăng truyện
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
              )}
              {!isRegisterPage && (
                <Link
                  href="/register"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  Đăng ký
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
