import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import type { DsParallaxStarCatalogItemSerializer } from '../api/generated';
import { toS3ProxyUrl } from '../api/media';
import defaultStarImage from '../assets/parallax_star_default_404.jpg';

interface ParallaxStarCardProps {
  star: DsParallaxStarCatalogItemSerializer;
  onSelect: (starId: number) => void;
  canDelete?: boolean;
  onDelete?: (starId: number) => void;
}

export const ParallaxStarCard: React.FC<ParallaxStarCardProps> = ({
  star,
  onSelect,
  canDelete,
  onDelete,
}) => {
  // Fallback изображения: пустой image_url или ошибка загрузки — локальная картинка.
  // URL объектов Silo (MinIO) пропускаются через прокси /s3.
  const [imgSrc, setImgSrc] = useState<string>(
    toS3ProxyUrl(star.image_url) || defaultStarImage
  );

  useEffect(() => {
    setImgSrc(toS3ProxyUrl(star.image_url) || defaultStarImage);
  }, [star.image_url]);

  const handleImageError = () => {
    if (imgSrc !== defaultStarImage) {
      setImgSrc(defaultStarImage);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (star.id != null && onDelete) onDelete(star.id);
  };

  return (
    <Card
      className="tile-card"
      onClick={() => star.id != null && onSelect(star.id)}
    >
      <div className="tile-card-image">
        <Card.Img
          variant="top"
          src={imgSrc}
          alt={star.name}
          onError={handleImageError}
        />
        {canDelete && onDelete && (
          <button
            type="button"
            className="tile-card-delete-btn"
            title="Удалить звезду (soft delete)"
            onClick={handleDelete}
          >
            &#10005;
          </button>
        )}
      </div>
      <div className="tile-card-info">
        <div className="tile-card-details">
          <span className="tile-card-name" title={star.name}>
            {star.name}
          </span>
          <span className="tile-card-meta">
            D = {(star.distance ?? 0).toFixed(2)} пк
          </span>
        </div>
        <div className="tile-card-likes" title={`Количество лайков: ${star.likes_count ?? 0}`}>
          <span className="tile-card-like-icon">&#9825;</span>
          <span>{star.likes_count ?? 0}</span>
        </div>
      </div>
    </Card>
  );
};