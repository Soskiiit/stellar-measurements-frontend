import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface ParallaxStarFilterProps {
  maxDistance: number;
  initialValue: number;
  onFilterChange: (selectedMaxDistance: number) => void;
}

export const ParallaxStarFilter: React.FC<ParallaxStarFilterProps> = ({
  maxDistance,
  initialValue,
  onFilterChange,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(initialValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(sliderValue);
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
            max={maxDistance}
            step={1}
            value={sliderValue}
            onChange={handleSliderChange}
            className="tile-range-input"
          />
          <div className="tile-slider-ticks">
            <span>0 пк</span>
            <span>{maxDistance} пк</span>
          </div>
        </div>
      </div>
      <Button type="submit" className="tile-filter-btn">
        Поиск
      </Button>
    </Form>
  );
};
