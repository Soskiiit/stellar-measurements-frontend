import React from 'react';
import { httpClient } from '../api/http';
import { loggedOut, selectIsAuthenticated } from '../store/authSlice';
import { resetFilter } from '../store/filterSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchParallaxStarFeed,
  fetchParallaxStarsCatalog,
} from '../store/parallaxStarsSlice';
import defaultFeedIcon from '../assets/feed.png';
import defaultAddIcon from '../assets/add.png';
import defaultCatalogIcon from '../assets/menu.png';
import doorIcon from '../assets/door.svg';

export type ActiveTab = 'feed' | 'catalog' | 'add' | 'auth';

interface NavigationBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Выход: деавторизация только axios (JWT передаётся в cookie), состояние
  // гостя передаётся в Redux вручную, без кодогенерации и thunk.
  // Фильтр пользователя сбрасывается, каталог и лента перезапрашиваются как гость.
  const handleLogout = async () => {
    try {
      await httpClient.post('/api/users/logout');
    } catch {
      // Если бэкенд недоступен, интерфейс всё равно переключается на гостя
    }
    localStorage.removeItem('access_token');
    dispatch(loggedOut());
    dispatch(resetFilter());
    dispatch(fetchParallaxStarsCatalog(undefined));
    dispatch(fetchParallaxStarFeed({}));
    onTabChange('catalog');
  };

  return (
    <nav className="bottom-nav">
      {/* 1. Лента — доступна для гостя */}
      <button
        type="button"
        className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onTabChange('feed')}
        title="Лента звёзд"
      >
        <img src={defaultFeedIcon} alt="Лента" className="bottom-nav-icon" />
        <span>Лента</span>
      </button>

      {/* 2. Добавление — только для авторизованного создателя */}
      <button
        type="button"
        className={`bottom-nav-item ${activeTab === 'add' ? 'active' : ''}`}
        disabled={!isAuthenticated}
        onClick={() => onTabChange('add')}
        title={
          isAuthenticated
            ? 'Добавить звезду'
            : 'Добавление доступно только авторизованному создателю'
        }
      >
        <img src={defaultAddIcon} alt="Добавить" className="bottom-nav-icon" />
        <span>Добавить</span>
      </button>

      {/* 3. Плитка / Каталог — доступен для гостя */}
      <button
        type="button"
        className={`bottom-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
        onClick={() => onTabChange('catalog')}
        title="Каталог звёзд"
      >
        <img src={defaultCatalogIcon} alt="Каталог" className="bottom-nav-icon" />
        <span>Каталог</span>
      </button>

      {/* 4. Вход / Выход — переключение интерфейса гостя и пользователя */}
      <button
        type="button"
        className={`bottom-nav-item ${activeTab === 'auth' ? 'active' : ''}`}
        onClick={() => (isAuthenticated ? handleLogout() : onTabChange('auth'))}
        title={isAuthenticated ? 'Выйти из аккаунта' : 'Войти в аккаунт'}
      >
        <img src={doorIcon} alt={isAuthenticated ? 'Выход' : 'Вход'} className="bottom-nav-icon" />
        <span>{isAuthenticated ? 'Выход' : 'Вход'}</span>
      </button>
    </nav>
  );
};