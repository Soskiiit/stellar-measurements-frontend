import React, { useState } from 'react';
import { ActiveTab, NavigationBar } from './components/NavigationBar';
import { ParallaxStarsCatalogPage } from './components/ParallaxStarsCatalogPage';
import { ParallaxStarsFeedPage } from './components/ParallaxStarsFeedPage';
import { AddStarPage } from './components/AddStarPage';
import { AuthPage } from './components/AuthPage';
import { LoadingOverlay } from './components/LoadingOverlay';
import { selectIsAuthenticated } from './store/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchParallaxStarFeed,
  fetchParallaxStarsCatalog,
} from './store/parallaxStarsSlice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userLogin = useAppSelector((state) => state.auth.user?.login);
  const distance = useAppSelector((state) => state.filter.distance);

  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');

  // Гость не может попасть на добавление; после входа страница авторизации
  // больше не нужна — показываем каталог.
  const effectiveTab: ActiveTab =
    activeTab === 'add' && !isAuthenticated
      ? 'auth'
      : activeTab === 'auth' && isAuthenticated
        ? 'catalog'
        : activeTab;

  // Переход к ленте при клике на карточку в плитке
  const handleSelectStar = (starId: number) => {
    dispatch(fetchParallaxStarFeed({ id: starId }));
    setActiveTab('feed');
  };

  // После входа перезапрашиваем каталог и ленту с JWT-кукой:
  // появляются признаки is_creator / is_liked
  const handleAuthorized = () => {
    dispatch(fetchParallaxStarsCatalog(distance ?? undefined));
    dispatch(fetchParallaxStarFeed({}));
    setActiveTab('catalog');
  };

  // После публикации черновика обновляем каталог
  const handlePublished = () => {
    dispatch(fetchParallaxStarsCatalog(distance ?? undefined));
    setActiveTab('catalog');
  };

  return (
    <div className="app-root">
      {/* Шапка приложения */}
      <header className="app-header">
        <button
          type="button"
          className="header-logo"
          onClick={() => setActiveTab('catalog')}
        >
          ⭗ StarParallax
        </button>
        {isAuthenticated && userLogin && (
          <span className="header-user" title="Текущий пользователь">
            {userLogin}
          </span>
        )}
      </header>

      {/* Контент активной страницы */}
      <main className="app-main">
        {effectiveTab === 'catalog' && (
          <ParallaxStarsCatalogPage onSelectStar={handleSelectStar} />
        )}
        {effectiveTab === 'feed' && <ParallaxStarsFeedPage />}
        {effectiveTab === 'add' && isAuthenticated && (
          <AddStarPage onPublished={handlePublished} />
        )}
        {effectiveTab === 'auth' && !isAuthenticated && (
          <AuthPage onAuthorized={handleAuthorized} />
        )}
      </main>

      {/* Нижняя навигационная панель navbar из 4 пунктов */}
      <NavigationBar activeTab={effectiveTab} onTabChange={setActiveTab} />

      {/* Блокирующая анимация на время AJAX-запросов */}
      <LoadingOverlay />
    </div>
  );
};