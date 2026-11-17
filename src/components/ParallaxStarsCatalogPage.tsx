import React, { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { selectIsAuthenticated } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  deleteParallaxStar,
  fetchParallaxStarsCatalog,
} from '../store/parallaxStarsSlice';
import { ParallaxStarFilter } from './ParallaxStarFilter';
import { ParallaxStarCard } from './ParallaxStarCard';

interface ParallaxStarsCatalogPageProps {
  onSelectStar: (starId: number) => void;
}

export const ParallaxStarsCatalogPage: React.FC<ParallaxStarsCatalogPageProps> = ({
  onSelectStar,
}) => {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((state) => state.parallaxStars.catalog);
  const distance = useAppSelector((state) => state.filter.distance);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const mutationError = useAppSelector((state) => state.parallaxStars.mutation.error);

  useEffect(() => {
    if (catalog.status === 'idle') {
      dispatch(fetchParallaxStarsCatalog(distance ?? undefined));
    }
  }, []);

  const handleDelete = (starId: number) => {
    dispatch(deleteParallaxStar(starId));
  };

  return (
    <div className="tile-page">
      <Container className="tile-container">
        <h1 className="tile-header">Каталог звёзд</h1>

        {/* Фильтр по расстоянию из Redux; уходит в запрос ?distance=... */}
        <ParallaxStarFilter />

        {catalog.source === 'mock' && (
          <div className="tile-mock-note">
            Бэкенд недоступен — показаны mock-данные (режим гостя)
          </div>
        )}

        {mutationError && <Alert variant="danger">{mutationError}</Alert>}

        {catalog.status === 'failed' ? (
          <Alert variant="danger">
            {catalog.error}
            <div className="mt-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => dispatch(fetchParallaxStarsCatalog(distance ?? undefined))}
              >
                Повторить
              </Button>
            </div>
          </Alert>
        ) : catalog.items.length > 0 ? (
          <div className="tile-grid">
            {catalog.items.map((star) => (
              <ParallaxStarCard
                key={star.id}
                star={star}
                onSelect={onSelectStar}
                canDelete={isAuthenticated && star.is_creator === 1}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          catalog.status === 'succeeded' && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
              Звёзды не найдены по заданному критерию
            </div>
          )
        )}
      </Container>
    </div>
  );
};