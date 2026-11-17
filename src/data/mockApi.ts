import { mockParallaxStars } from './mockParallaxStars';
import type {
  DsParallaxStarCatalogItemSerializer,
  DsParallaxStarFeedSerializer,
} from '../api/generated';

// Mock-ответы в формате сериализаторов бэкенда: используются только как гость,
// когда веб-сервис недоступен.
const publishedStars = mockParallaxStars.filter((s) => s.status === 'published');

export const mockCatalogItems = (
  maxDistance?: number
): DsParallaxStarCatalogItemSerializer[] => {
  return publishedStars
    .filter((s) => maxDistance == null || s.distance <= maxDistance)
    .map((s) => ({
      id: s.id,
      name: s.name,
      image_url: s.imageUrl,
      distance: s.distance,
      likes_count: s.likes.length,
      is_creator: 0,
    }));
};

export const mockFeedStar = (
  id?: number,
  next?: boolean
): DsParallaxStarFeedSerializer | null => {
  if (publishedStars.length === 0) return null;

  let index = id != null ? publishedStars.findIndex((s) => s.id === id) : 0;
  if (index < 0) index = 0;
  if (next) index = (index + 1) % publishedStars.length;

  const star = publishedStars[index];
  return {
    id: star.id,
    name: star.name,
    description: star.description,
    image_url: star.imageUrl,
    video_url: star.videoUrl,
    parallax: star.parallax,
    distance: star.distance,
    likes_count: star.likes.length,
    is_liked: 0,
  };
};