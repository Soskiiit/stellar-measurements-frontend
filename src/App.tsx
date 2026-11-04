import React, { useState, useMemo } from 'react';
import { mockParallaxStars } from './data/mockParallaxStars';
import { ActiveTab, NavigationBar } from './components/NavigationBar';
import { ParallaxStarsCatalogPage } from './components/ParallaxStarsCatalogPage';
import { ParallaxStarsFeedPage } from './components/ParallaxStarsFeedPage';

export const App: React.FC = () => {
  // Навигация между доступными вкладками гостя: лента и каталог (плитка)
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');

  // Список только опубликованных звёзд для гостя
  const publishedStars = useMemo(() => {
    return mockParallaxStars.filter((s) => s.status === 'published');
  }, []);

  // Выбранная звезда для отображения в ленте
  const [currentStarId, setCurrentStarId] = useState<number>(() => {
    return publishedStars[0]?.id ?? 1;
  });

  const currentStar = useMemo(() => {
    return publishedStars.find((s) => s.id === currentStarId) || publishedStars[0];
  }, [publishedStars, currentStarId]);

  // Переход к ленте при клике на карточку в плитке
  const handleSelectStar = (starId: number) => {
    setCurrentStarId(starId);
    setActiveTab('feed');
  };

  // Переход к следующей звезде в ленте (циклический переход)
  const handleNextStar = () => {
    if (publishedStars.length === 0) return;
    const currentIndex = publishedStars.findIndex((s) => s.id === currentStar.id);
    const nextIndex = (currentIndex + 1) % publishedStars.length;
    setCurrentStarId(publishedStars[nextIndex].id);
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
      </header>

      {/* Контент активной страницы */}
      <main className="app-main">
        {activeTab === 'catalog' && (
          <ParallaxStarsCatalogPage
            stars={mockParallaxStars}
            onSelectStar={handleSelectStar}
          />
        )}
        {activeTab === 'feed' && currentStar && (
          <ParallaxStarsFeedPage
            currentStar={currentStar}
            onNextStar={handleNextStar}
          />
        )}
      </main>

      {/* Нижняя навигационная панель navbar из 4 пунктов */}
      <NavigationBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
    </div>
  );
};
