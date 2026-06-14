"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";

import { addCartItem, parseCartPrice } from "./lib/cartStorage";
import type { ComponentItem } from "./lib/data";

type ComponentCardProps = {
  component: ComponentItem;
};

type ComponentPanelStyle = CSSProperties & {
  "--overlay-x": string;
  "--overlay-y": string;
};

export function ComponentCard({ component }: ComponentCardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 18, y: 18 });

  function handlePointerMove(
    event: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>,
  ) {
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

  const panelStyle = {
    "--overlay-x": `${overlayPosition.x}px`,
    "--overlay-y": `${overlayPosition.y}px`,
  } as ComponentPanelStyle;

  function handleAddToCart() {
    addCartItem({
      id: component.slug,
      image: component.image,
      itemType: "component",
      name: component.name,
      price: parseCartPrice(component.price),
    });
  }

  const hoverPanel = (
    <div
      className={`product-hover-panel${isPanelOpen ? " product-hover-panel--open" : ""}`}
      aria-hidden="true"
      ref={panelRef}
      style={panelStyle}
    >
      <p className="warranty">Loại: {component.type}</p>
      {component.specs.length > 0 ? (
        <ul>
          {component.specs.map((spec) => (
            <li key={spec.label}>
              <strong>{spec.label}:</strong> {spec.value}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <article
      className={`product-card component-product-card${isPanelOpen ? " product-card--panel-open" : ""}`}
    >
      <Link
        href={`/${component.slug}`}
        className="product-media"
        onMouseEnter={() => setIsPanelOpen(true)}
        onMouseLeave={() => setIsPanelOpen(false)}
        onMouseMove={handlePointerMove}
        onPointerEnter={() => setIsPanelOpen(true)}
        onPointerLeave={() => setIsPanelOpen(false)}
        onPointerMove={handlePointerMove}
        role="img"
        aria-label={component.name}
        style={{ backgroundImage: `url(${component.image})` }}
      >
        <span className="discount-badge">{component.type}</span>
      </Link>
      <div className="product-body">
        <h3>
          <Link href={`/${component.slug}`}>{component.name}</Link>
        </h3>
        <div className="price-row">
          <strong>{component.price || "Liên hệ"}</strong>
          <span>{component.brand}</span>
        </div>
      </div>
      {isPanelOpen ? createPortal(hoverPanel, document.body) : null}
      <div className="product-actions">
        <button type="button" onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}
