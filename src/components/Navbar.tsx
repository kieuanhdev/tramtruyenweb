"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!authService.getToken());
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isNovelDetail = /^\/novels\/[^/]+$/.test(pathname);
  const isChapterCreate = /^\/novels\/[^/]+\/chapters\/create$/.test(pathname);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    authService.logout();
    router.push("/login");
  };

  const handleBack = () => router.back();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          {(isNovelDetail || isChapterCreate || pathname === "/novels/create" || pathname === "/profile" || pathname.startsWith("/chapters/")) && (
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Tài khoản
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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
