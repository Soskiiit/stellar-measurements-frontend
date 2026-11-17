import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { setDistanceFilter } from '../store/filterSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchParallaxStarsCatalog } from '../store/parallaxStarsSlice';

const MAX_DISTANCE = 1000;

// Фильтр по расстоянию: значение хранится в Redux (filterSlice),
// по кнопке «Поиск» уходит в запрос к бэкенду (?distance=...).
export const ParallaxStarFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const distance = useAppSelector((state) => state.filter.distance);
  const sliderValue = distance ?? MAX_DISTANCE;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDistanceFilter(Number(e.target.value)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchParallaxStarsCatalog(sliderValue));
  };

  return (
    <Form onSubmit={handleSubmit} className="tile-filter-form">
      <div className="tile-filter-slider">
        <Form.Label htmlFor="distance-range" className="tile-filter-label">
          <span>Расстояние до звезды:</span>
          <span className="tile-filter-val-badge">{sliderValue} пк</span>
        </Form.Label>
        <div className="tile-slider-track">
          <Form.Range
            id="distance-range"
            min={0}
            max={MAX_DISTANCE}
            step={1}
            value={sliderValue}
            onChange={handleSliderChange}
            className="tile-range-input"
          />
          <div className="tile-slider-ticks">
            <span>0 пк</span>
            <span>{MAX_DISTANCE} пк</span>
          </div>
        </div>
      </div>
      <Button type="submit" className="tile-filter-btn">
        Поиск
      </Button>
    </Form>
  );
};