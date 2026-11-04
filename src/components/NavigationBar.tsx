import React from 'react';
import defaultFeedIcon from '../assets/feed.png';
import defaultAddIcon from '../assets/add.png';
import defaultCatalogIcon from '../assets/menu.png';
import defaultLoginIcon from '../assets/image.png';

export type ActiveTab = 'feed' | 'catalog';

interface NavigationBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      {/* 1. Лента — доступно для гостя */}
      <button
        type="button"
        className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onTabChange('feed')}
        title="Лента звёзд"
      >
        <img src={defaultFeedIcon} alt="Лента" className="bottom-nav-icon" />
        <span>Лента</span>
      </button>

      {/* 2. Добавление — недоступно для гостя */}
      <button
        type="button"
        className="bottom-nav-item"
        disabled
        title="Добавление доступно только авторизованному создателю"
      >
        <img src={defaultAddIcon} alt="Добавить" className="bottom-nav-icon" />
        <span>Добавить</span>
      </button>

      {/* 3. Плитка / Каталог — доступно для гостя */}
      <button
        type="button"
        className={`bottom-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
        onClick={() => onTabChange('catalog')}
        title="Каталог звёзд"
      >
        <img src={defaultCatalogIcon} alt="Каталог" className="bottom-nav-icon" />
        <span>Каталог</span>
      </button>

      {/* 4. Вход — недоступно для гостя в ЛР5 */}
      <button
        type="button"
        className="bottom-nav-item"
        disabled
        title="Авторизация будет реализована в следующей лабораторной"
      >
        <img src={defaultLoginIcon} alt="Вход" className="bottom-nav-icon" />
        <span>Вход</span>
      </button>
    </nav>
  );
};
