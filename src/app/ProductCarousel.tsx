"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "./ProductCard";
import type { Product } from "./lib/data";

type ProductCarouselProps = {
  products: Product[];
};

const visibleProductCount = 4;

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxIndex = Math.max(0, products.length - visibleProductCount);
  const canSlide = products.length > visibleProductCount;
  const trackStyle = useMemo(
    () => ({
      transform: `translateX(calc(-${activeIndex} * ((100% - 42px) / ${visibleProductCount} + 14px)))`,
    }),
    [activeIndex],
  );

  function showPreviousProduct() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? maxIndex : currentIndex - 1,
    );
  }

  function showNextProduct() {
    setActiveIndex((currentIndex) =>
      currentIndex >= maxIndex ? 0 : currentIndex + 1,
    );
  }

  return (
    <div className="product-carousel">
      {canSlide ? (
        <button
          type="button"
          className="product-carousel-button product-carousel-button--previous"
          aria-label="Xem sản phẩm trước"
          onClick={showPreviousProduct}
        >
          <span aria-hidden="true">‹</span>
        </button>
      ) : null}

      <div className="product-carousel-window">
        <div className="product-grid product-carousel-track" style={trackStyle}>
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>

      {canSlide ? (
        <button
          type="button"
          className="product-carousel-button product-carousel-button--next"
          aria-label="Xem sản phẩm tiếp theo"
          onClick={showNextProduct}
        >
          <span aria-hidden="true">›</span>
        </button>
      ) : null}
    </div>
  );
}
