/**
 * Chuyển avatar path từ backend (vd: /uploads/avatars/xxx.jpg) thành full URL
 */
export function getAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "";
  return baseUrl ? `${baseUrl}${avatarUrl}` : avatarUrl;
}
