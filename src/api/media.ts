// Бэкенд возвращает прямые URL объектов Silo (MinIO), например
// http://localhost:9002/parallax-stars/<file>. Чтобы не упереться в CORS,
// подменяем origin на маршрут /s3 обратного прокси Vite.
const MINIO_ORIGIN = /^https?:\/\/[^/]+:9002(?=\/|$)/;

export const toS3ProxyUrl = (url?: string | null): string => {
  if (!url) return '';
  return url.replace(MINIO_ORIGIN, '/s3');
};