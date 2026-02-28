"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { chapterService } from "@/services/chapter.service";
import { ChapterResponse } from "@/types/novel";
import { CommentSection } from "@/components/comments/CommentSection";

export default function ChapterReadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [chapter, setChapter] = useState<ChapterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchChapter = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await chapterService.getChapterDetail(id);
        setChapter(data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            (err.response.data as any)?.message ||
              "Không tải được nội dung chương."
          );
        } else {
          setError("Lỗi kết nối đến máy chủ.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
  }, [id]);

  const handleBackToNovel = () => {
    if (chapter?.novelId) {
      router.push(`/novels/${chapter.novelId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-red-600 text-center">
            {error}
          </div>
        ) : !chapter ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            Không tìm thấy chương.
          </div>
        ) : !chapter.isPublished ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            Chương này chưa được xuất bản.
          </div>
        ) : (
          <>
            <article className="bg-white rounded-xl shadow-md p-6 sm:p-10">
              <header className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Chương {chapter.chapterNo}: {chapter.title}
                </h2>
                {chapter.publishedAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    Xuất bản:{" "}
                    {new Date(chapter.publishedAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </header>

              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line font-serif text-base sm:text-lg">
                  {chapter.content}
                </div>
              </div>

              <footer className="mt-10 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBackToNovel}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  ← Quay lại danh sách chương
                </button>
              </footer>
            </article>

            <div className="mt-8">
              <CommentSection chapterId={id} title="Bình luận chương" />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
