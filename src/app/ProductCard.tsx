"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

type Product = {
  title: string;
  price: string;
  oldPrice: string;
  discount: string;
  warranty: string;
  image: string;
  specs: string[];
  promo: string;
};

type ProductCardProps = {
  product: Product;
};

type ProductCardStyle = CSSProperties & {
  "--overlay-x": string;
  "--overlay-y": string;
};

export function ProductCard({ product }: ProductCardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 18, y: 18 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const panelWidth = panelRef.current?.offsetWidth ?? 280;
    const panelHeight = panelRef.current?.offsetHeight ?? 220;
    const inset = 12;
    const offset = 16;
    const preferredX = event.clientX + offset;
    const fallbackX = event.clientX - panelWidth - offset;
    const x =
      preferredX + panelWidth + inset <= window.innerWidth
        ? preferredX
        : Math.max(fallbackX, inset);
    const y = Math.min(
      Math.max(event.clientY - panelHeight / 2, inset),
      window.innerHeight - panelHeight - inset,
    );

    setOverlayPosition({ x, y });
  }

  const cardStyle = {
    "--overlay-x": `${overlayPosition.x}px`,
    "--overlay-y": `${overlayPosition.y}px`,
  } as ProductCardStyle;

  return (
    <article
      className={`product-card${isPanelOpen ? " product-card--panel-open" : ""}`}
      style={cardStyle}
    >
      <div
        className="product-media"
        onPointerEnter={() => setIsPanelOpen(true)}
        onPointerLeave={() => setIsPanelOpen(false)}
        onPointerMove={handlePointerMove}
        role="img"
        aria-label={product.title}
        style={{ backgroundImage: `url(${product.image})` }}
      >
        <span className="discount-badge">{product.discount}</span>
      </div>
      <div className="product-body">
        <h3>{product.title}</h3>
        <div className="price-row">
          <strong>{product.price}</strong>
          <span>{product.oldPrice}</span>
        </div>
      </div>
      <div className="product-hover-panel" aria-hidden="true" ref={panelRef}>
        <p className="warranty">Bảo hành: {product.warranty}</p>
        <ul>
          {product.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
        <p className="promo-note">{product.promo}</p>
      </div>
      <div className="product-actions">
        <button type="button">Thêm vào giỏ</button>
      </div>
    </article>
  );
}
