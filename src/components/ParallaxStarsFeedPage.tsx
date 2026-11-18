import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { toS3ProxyUrl } from '../api/media';
import { selectIsAuthenticated } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchParallaxStarFeed,
  toggleParallaxStarLike,
} from '../store/parallaxStarsSlice';
import defaultStarVideo from '../assets/parallax_star_default.mp4';
import defaultStarPoster from '../assets/parallax_star_default_404.jpg';
import nextArrowIcon from '../assets/down-arrow.png';

export const ParallaxStarsFeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const feed = useAppSelector((state) => state.parallaxStars.feed);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const star = feed.star;

  const [isExpanded, setIsExpanded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (feed.status === 'idle') {
      dispatch(fetchParallaxStarFeed({}));
    }
  }, []);

  // Сброс раскрытия описания и fallback видео при смене звезды
  useEffect(() => {
    setIsExpanded(false);
    setVideoFailed(false);
  }, [star?.id]);

  if (!star) {
    return (
      <div className="feed-page">
        <div className="feed-empty">
          {feed.status === 'failed' ? (
            <>
              <Alert variant="danger">{feed.error}</Alert>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => dispatch(fetchParallaxStarFeed({}))}
              >
                Повторить
              </Button>
            </>
          ) : (
            <span>Загрузка ленты…</span>
          )}
        </div>
      </div>
    );
  }

  const videoSrc = videoFailed
    ? defaultStarVideo
    : toS3ProxyUrl(star.video_url) || defaultStarVideo;
  const posterSrc = toS3ProxyUrl(star.image_url) || defaultStarPoster;
  // После F5 JWT-кука жива, и сервер отдаёт is_liked для неё,
  // но гостевой интерфейс персональный лайк не показывает.
  const isLiked = isAuthenticated && star.is_liked === 1;

  const handleVideoError = () => {
    if (!videoFailed) setVideoFailed(true);
  };

  const handleLike = () => {
    if (star.id == null) return;
    dispatch(toggleParallaxStarLike({ id: star.id, like: isLiked ? 0 : 1 }));
  };

  const handleNext = () => {
    dispatch(fetchParallaxStarFeed({ id: star.id, next: true }));
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        {/* Фоновое видео с автоматическим проигрыванием (URL через прокси /s3) */}
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

        {feed.source === 'mock' && (
          <div className="feed-mock-note">mock-данные: бэкенд недоступен</div>
        )}

        {/* Плавающие действия справа: лайк и кнопка «Следующая» */}
        <div className="feed-float-actions">
          <button
            type="button"
            className={`feed-like-btn ${isLiked ? 'liked' : ''}`}
            disabled={!isAuthenticated}
            onClick={handleLike}
            title={
              isAuthenticated
                ? isLiked
                  ? 'Убрать лайк'
                  : 'Поставить лайк'
                : 'Лайки доступны после входа'
            }
          >
            <span className="feed-like-icon">{isLiked ? '♥' : '♡'}</span>
            <span className="feed-like-count">{star.likes_count ?? 0}</span>
          </button>

          <button
            type="button"
            className="feed-next-btn"
            onClick={handleNext}
            title="Следующая звезда"
          >
            <img src={nextArrowIcon} alt="Следующая" className="feed-next-icon" />
          </button>
        </div>

        {/* Нижний оверлей с информацией о звезде и полями предметной области */}
        <div className="feed-overlay">
          <div className="feed-content">
            <h1 className="feed-title" title={star.name}>
              {star.name}
            </h1>

            {star.description && (
              <div className="feed-desc-wrapper">
                <p className={`feed-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  {star.description}
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
                  Параллакс: {(star.parallax ?? 0).toFixed(3)}"
                </span>
              </div>
              <div className="feed-field">
                <span className="feed-field-value">
                  Расстояние: {(star.distance ?? 0).toFixed(2)} пк
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};