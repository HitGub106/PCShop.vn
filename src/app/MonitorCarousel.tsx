"use client";

import { useMemo, useState } from "react";

import { MonitorCard } from "./MonitorCard";
import type { MonitorItem } from "./lib/data";

type MonitorCarouselProps = {
  monitors: MonitorItem[];
};

const visibleMonitorCount = 4;

export function MonitorCarousel({ monitors }: MonitorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxIndex = Math.max(0, monitors.length - visibleMonitorCount);
  const canSlide = monitors.length > visibleMonitorCount;
  const trackStyle = useMemo(
    () => ({
      transform: `translateX(calc(-${activeIndex} * ((100% - 42px) / ${visibleMonitorCount} + 14px)))`,
    }),
    [activeIndex],
  );

  function showPreviousMonitor() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? maxIndex : currentIndex - 1,
    );
  }

  function showNextMonitor() {
    setActiveIndex((currentIndex) =>
      currentIndex >= maxIndex ? 0 : currentIndex + 1,
    );
  }

  return (
    <div className="product-carousel monitor-carousel">
      {canSlide ? (
        <button
          type="button"
          className="product-carousel-button product-carousel-button--previous"
          aria-label="Xem màn hình trước"
          onClick={showPreviousMonitor}
        >
          <span aria-hidden="true">‹</span>
        </button>
      ) : null}

      <div className="product-carousel-window">
        <div
          className="product-grid product-carousel-track component-product-grid"
          style={trackStyle}
        >
          {monitors.map((monitor) => (
            <MonitorCard key={monitor.slug} monitor={monitor} />
          ))}
        </div>
      </div>

      {canSlide ? (
        <button
          type="button"
          className="product-carousel-button product-carousel-button--next"
          aria-label="Xem màn hình tiếp theo"
          onClick={showNextMonitor}
        >
          <span aria-hidden="true">›</span>
        </button>
      ) : null}
    </div>
  );
}
