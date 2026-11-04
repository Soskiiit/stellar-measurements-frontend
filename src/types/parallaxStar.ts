export type ParallaxStarStatus = 'draft' | 'published' | 'deleted';

export interface ParallaxStarLike {
  id: number;
  userId: number;
  parallaxStarId: number;
}

export interface ParallaxStar {
  id: number;
  name: string;
  description: string;
  status: ParallaxStarStatus;
  imageUrl: string;
  videoUrl: string;
  parallax: number; // годовой параллакс в секундах дуги (")
  distance: number; // расстояние в парсеках (пк)
  dateCreate: string;
  dateFinish?: string | null;
  creatorId: number;
  likes: ParallaxStarLike[];
}
