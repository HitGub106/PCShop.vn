"use client";

import { useMemo, useState } from "react";

import { ComponentCard } from "./ComponentCard";
import type { ComponentItem } from "./lib/data";

type ComponentCarouselProps = {
  components: ComponentItem[];
};

const visibleComponentCount = 4;

export function ComponentCarousel({ components }: ComponentCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxIndex = Math.max(0, components.length - visibleComponentCount);
  const canSlide = components.length > visibleComponentCount;
  const trackStyle = useMemo(
    () => ({
      transform: `translateX(calc(-${activeIndex} * ((100% - 42px) / ${visibleComponentCount} + 14px)))`,
    }),
    [activeIndex],
  );

  function showPreviousComponent() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? maxIndex : currentIndex - 1,
    );
  }

  function showNextComponent() {
    setActiveIndex((currentIndex) =>
      currentIndex >= maxIndex ? 0 : currentIndex + 1,
    );
  }

  return (
    <div className="product-carousel component-carousel">
      {canSlide ? (
        <button
          type="button"
          className="product-carousel-button product-carousel-button--previous"
          aria-label="Xem linh kiện trước"
          onClick={showPreviousComponent}
        >
          <span aria-hidden="true">‹</span>
        </button>
      ) : null}

      <div className="product-carousel-window">
        <div
          className="product-grid product-carousel-track component-product-grid"
          style={trackStyle}
        >
          {components.map((component) => (
            <ComponentCard key={component.name} component={component} />
          ))}
        </div>
      </div>

      {canSlide ? (
        <button
          type="button"
          className="product-carousel-button product-carousel-button--next"
          aria-label="Xem linh kiện tiếp theo"
          onClick={showNextComponent}
        >
          <span aria-hidden="true">›</span>
        </button>
      ) : null}
    </div>
  );
}
