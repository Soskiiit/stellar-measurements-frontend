import React, { useState, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import { ParallaxStar } from '../types/parallaxStar';
import { ParallaxStarFilter } from './ParallaxStarFilter';
import { ParallaxStarCard } from './ParallaxStarCard';

interface ParallaxStarsCatalogPageProps {
  stars: ParallaxStar[];
  onSelectStar: (starId: number) => void;
}

export const ParallaxStarsCatalogPage: React.FC<ParallaxStarsCatalogPageProps> = ({
  stars,
  onSelectStar,
}) => {
  // Фильтруем только опубликованные звёзды (черновики и удаленные гость не видит)
  const publishedStars = useMemo(() => {
    return stars.filter((star) => star.status === 'published');
  }, [stars]);

  // Максимальное расстояние для слайдера
  const maxDistanceAvailable = useMemo(() => {
    if (publishedStars.length === 0) return 1000;
    const max = Math.max(...publishedStars.map((s) => s.distance));
    return Math.max(1000, Math.ceil(max));
  }, [publishedStars]);

  // Состояние применённого фильтра по расстоянию (по умолчанию показываем все)
  const [appliedMaxDistance, setAppliedMaxDistance] = useState<number>(maxDistanceAvailable);

  // Список звёзд после фильтрации
  const filteredStars = useMemo(() => {
    return publishedStars.filter((star) => star.distance <= appliedMaxDistance);
  }, [publishedStars, appliedMaxDistance]);

  return (
    <div className="tile-page">
      <Container className="tile-container">
        <h1 className="tile-header">Каталог звёзд</h1>

        {/* Компонент фильтрации по предметной области (расстояние в парсеках) */}
        <ParallaxStarFilter
          maxDistance={maxDistanceAvailable}
          initialValue={appliedMaxDistance}
          onFilterChange={(val) => setAppliedMaxDistance(val)}
        />

        {/* Сетка карточек в 2 колонки */}
        {filteredStars.length > 0 ? (
          <div className="tile-grid">
            {filteredStars.map((star) => (
              <ParallaxStarCard key={star.id} star={star} onSelect={onSelectStar} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
            Звёзды не найдены по заданному критерию
          </div>
        )}
      </Container>
    </div>
  );
};
