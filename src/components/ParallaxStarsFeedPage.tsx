import React, { useState } from 'react';
import { ParallaxStar } from '../types/parallaxStar';
import defaultStarVideo from '../assets/parallax_star_default.mp4';
import defaultStarPoster from '../assets/parallax_star_default_404.jpg';
import nextArrowIcon from '../assets/down-arrow.png';

interface ParallaxStarsFeedPageProps {
  currentStar: ParallaxStar;
  onNextStar: () => void;
}

export const ParallaxStarsFeedPage: React.FC<ParallaxStarsFeedPageProps> = ({
  currentStar,
  onNextStar,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string>(currentStar.videoUrl || defaultStarVideo);
  const [posterSrc, setPosterSrc] = useState<string>(currentStar.imageUrl || defaultStarPoster);

  // Сброс при смене звезды
  React.useEffect(() => {
    setIsExpanded(false);
    setVideoSrc(currentStar.videoUrl || defaultStarVideo);
    setPosterSrc(currentStar.imageUrl || defaultStarPoster);
  }, [currentStar]);

  const handleVideoError = () => {
    if (videoSrc !== defaultStarVideo) {
      setVideoSrc(defaultStarVideo);
    }
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        {/* Фоновое видео с автоматическим проигрыванием */}
        <div className="feed-video-bg">
          <video
            key={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="feed-video"
            poster={posterSrc}
            onError={handleVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        {/* Плавающие действия справа: лайки и кнопка "Следующая" */}
        <div className="feed-float-actions">
          <div className="feed-likes" title={`Количество лайков: ${currentStar.likes.length}`}>
            <span className="feed-like-icon">&#9825;</span>
            <span className="feed-like-count">{currentStar.likes.length}</span>
          </div>

          <button
            type="button"
            className="feed-next-btn"
            onClick={onNextStar}
            title="Следующая звезда"
          >
            <img src={nextArrowIcon} alt="Следующая" className="feed-next-icon" />
          </button>
        </div>

        {/* Нижний оверлей с информацией о звезде и полями по предметной области */}
        <div className="feed-overlay">
          <div className="feed-content">
            <h1 className="feed-title" title={currentStar.name}>
              {currentStar.name}
            </h1>

            {currentStar.description && (
              <div className="feed-desc-wrapper">
                <p className={`feed-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  {currentStar.description}
                </p>
                <button
                  type="button"
                  className="feed-desc-toggle-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'меньше ▲' : 'больше ▼'}
                </button>
              </div>
            )}

            <div className="feed-fields">
              <div className="feed-field">
                <span className="feed-field-value">
                  Параллакс: {currentStar.parallax.toFixed(3)}"
                </span>
              </div>
              <div className="feed-field">
                <span className="feed-field-value">
                  Расстояние: {currentStar.distance.toFixed(2)} пк
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
