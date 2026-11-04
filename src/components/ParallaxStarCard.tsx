import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { ParallaxStar } from '../types/parallaxStar';
import defaultStarImage from '../assets/parallax_star_default_404.jpg';

interface ParallaxStarCardProps {
  star: ParallaxStar;
  onSelect: (starId: number) => void;
}

export const ParallaxStarCard: React.FC<ParallaxStarCardProps> = ({ star, onSelect }) => {
  // Реализация fallback изображения по умолчанию:
  // Если star.imageUrl пустое или при загрузке произошла ошибка — используется локальное изображение из проекта.
  const [imgSrc, setImgSrc] = useState<string>(star.imageUrl || defaultStarImage);

  const handleImageError = () => {
    if (imgSrc !== defaultStarImage) {
      setImgSrc(defaultStarImage);
    }
  };

  return (
    <Card className="tile-card" onClick={() => onSelect(star.id)}>
      <div className="tile-card-image">
        <Card.Img
          variant="top"
          src={imgSrc}
          alt={star.name}
          onError={handleImageError}
        />
      </div>
      <div className="tile-card-info">
        <div className="tile-card-details">
          <span className="tile-card-name" title={star.name}>
            {star.name}
          </span>
          <span className="tile-card-meta">
            D = {star.distance.toFixed(2)} пк
          </span>
        </div>
        <div className="tile-card-likes" title={`Количество лайков: ${star.likes.length}`}>
          <span className="tile-card-like-icon">&#9825;</span>
          <span>{star.likes.length}</span>
        </div>
      </div>
    </Card>
  );
};
