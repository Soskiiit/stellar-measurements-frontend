import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useAppSelector } from '../store/hooks';

// Блокирующая анимация на время AJAX-запросов: перекрывает весь экран,
// включая кнопки навигации, пока счётчик запросов больше нуля.
export const LoadingOverlay: React.FC = () => {
  const pending = useAppSelector((state) => state.loading.pending);

  if (pending === 0) return null;

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <Spinner animation="border" variant="light" className="loading-spinner" />
      <span className="loading-text">Загрузка…</span>
    </div>
  );
};