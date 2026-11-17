import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toS3ProxyUrl } from '../api/media';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createParallaxStarDraft,
  fetchParallaxStarDraft,
  publishParallaxStar,
} from '../store/parallaxStarsSlice';
import defaultStarImage from '../assets/parallax_star_default_404.jpg';
import defaultStarVideo from '../assets/parallax_star_default.mp4';

interface AddStarPageProps {
  onPublished: () => void;
}

// Двухшаговое добавление услуги-звезды (как в шаблоне бэкенда):
// шаг 1 — черновик с названием и медиафайлами, шаг 2 — публикация черновика.
export const AddStarPage: React.FC<AddStarPageProps> = ({ onPublished }) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.parallaxStars.draft);
  const mutationError = useAppSelector((state) => state.parallaxStars.mutation.error);

  // Шаг 1: название и медиафайлы
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Шаг 2: параметры публикации
  const [description, setDescription] = useState('');
  const [parallax, setParallax] = useState('');
  const [distance, setDistance] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  const draftId = draft.item?.id;

  useEffect(() => {
    dispatch(fetchParallaxStarDraft());
  }, [dispatch]);

  // Заполняем форму публикации данными черновика
  useEffect(() => {
    if (draft.item) {
      setDescription(draft.item.description ?? '');
      setParallax(draft.item.parallax ? String(draft.item.parallax) : '');
      setDistance(draft.item.distance ? String(draft.item.distance) : '');
      setImgFailed(false);
    }
  }, [draftId]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createParallaxStarDraft({
        name: name.trim(),
        image: imageFile ?? undefined,
        video: videoFile ?? undefined,
      })
    );
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.item?.id == null) return;
    const result = await dispatch(
      publishParallaxStar({
        id: draft.item.id,
        request: {
          description: description.trim(),
          parallax: Number(parallax),
          distance: Number(distance),
        },
      })
    );
    if (publishParallaxStar.fulfilled.match(result)) {
      onPublished();
    }
  };

  if (draft.status === 'failed') {
    return (
      <div className="add-page">
        <div className="add-container">
          <h1 className="add-header">Новая звезда</h1>
          <Alert variant="danger">{draft.error}</Alert>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => dispatch(fetchParallaxStarDraft())}
          >
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  // Шаг 2: публикация черновика
  if (draft.item) {
    const draftImageSrc =
      !imgFailed && draft.item.image_url
        ? toS3ProxyUrl(draft.item.image_url)
        : defaultStarImage;
    const draftVideoSrc = toS3ProxyUrl(draft.item.video_url) || defaultStarVideo;

    return (
      <div className="add-page">
        <div className="add-container">
          <h1 className="add-header">Публикация черновика</h1>

          {mutationError && <Alert variant="danger">{mutationError}</Alert>}

          <Form onSubmit={handlePublish}>
            <div className="add-section">
              <h2 className="add-section-title">Медиа</h2>
              <div className="add-media-stack">
                <div className="add-media-strip">
                  <video
                    src={draftVideoSrc}
                    className="add-media-icon"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <span className="add-media-label">Видео звезды</span>
                </div>
                <div className="add-media-strip">
                  <img
                    src={draftImageSrc}
                    alt="Фото звезды"
                    className="add-media-icon"
                    onError={() => setImgFailed(true)}
                  />
                  <span className="add-media-label">Фото звезды</span>
                </div>
              </div>
            </div>

            <div className="add-section">
              <h2 className="add-section-title">О звезде</h2>

              <Form.Group className="add-field" controlId="add-name">
                <Form.Label className="add-label">Название звезды</Form.Label>
                <Form.Control
                  type="text"
                  className="add-input"
                  value={draft.item.name ?? ''}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="add-field" controlId="add-description">
                <Form.Label className="add-label">
                  Краткое описание (макс. 255 символов)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="add-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Краткое описание звезды, спектральный класс, созвездие..."
                  maxLength={255}
                  required
                />
              </Form.Group>

              <Form.Group className="add-field" controlId="add-parallax">
                <Form.Label className="add-label">
                  Годичный параллакс, сек дуги (от 0.001 до 9.999)
                </Form.Label>
                <Form.Control
                  type="number"
                  className="add-input"
                  value={parallax}
                  onChange={(e) => setParallax(e.target.value)}
                  step={0.001}
                  min={0.001}
                  max={9.999}
                  placeholder="0.379"
                  required
                />
              </Form.Group>

              <Form.Group className="add-field" controlId="add-distance">
                <Form.Label className="add-label">
                  Расстояние, пк (от 0.01 до 999.99)
                </Form.Label>
                <Form.Control
                  type="number"
                  className="add-input"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  step={0.01}
                  min={0.01}
                  max={999.99}
                  placeholder="2.64"
                  required
                />
              </Form.Group>

              <Button type="submit" className="add-submit-btn">
                Опубликовать
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  // Шаг 1: создание черновика
  return (
    <div className="add-page">
      <div className="add-container">
        <h1 className="add-header">Новая звезда</h1>

        {mutationError && <Alert variant="danger">{mutationError}</Alert>}

        <Form onSubmit={handleCreate}>
          <div className="add-section">
            <h2 className="add-section-title">Медиа</h2>
            <div className="add-media-stack">
              <label className="add-media-strip" htmlFor="star-video">
                <video
                  src={defaultStarVideo}
                  className="add-media-icon"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <span className="add-media-label">
                  {videoFile ? videoFile.name : 'Видео звезды'}
                </span>
                <input
                  type="file"
                  id="star-video"
                  accept="video/*"
                  hidden
                  onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <label className="add-media-strip" htmlFor="star-image">
                <img src={defaultStarImage} alt="Фото" className="add-media-icon" />
                <span className="add-media-label">
                  {imageFile ? imageFile.name : 'Фото звезды'}
                </span>
                <input
                  type="file"
                  id="star-image"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div className="add-section">
            <h2 className="add-section-title">О звезде</h2>

            <Form.Group className="add-field" controlId="add-new-name">
              <Form.Label className="add-label">
                Название звезды (макс. 100 символов)
              </Form.Label>
              <Form.Control
                type="text"
                className="add-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Сириус"
                maxLength={100}
                required
              />
            </Form.Group>

            <Button type="submit" className="add-submit-btn">
              Далее
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};