"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { addCartItem, parseCartPrice } from "./lib/cartStorage";
import type { MonitorItem } from "./lib/data";

type MonitorCardProps = {
  monitor: MonitorItem;
};

type MonitorPanelStyle = CSSProperties & {
  "--overlay-x": string;
  "--overlay-y": string;
};

export function MonitorCard({ monitor }: MonitorCardProps) {
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
  } as MonitorPanelStyle;

  function handleAddToCart() {
    addCartItem({
      id: monitor.slug,
      image: monitor.image,
      itemType: "monitor",
      name: monitor.name,
      price: parseCartPrice(monitor.price),
    });
  }

  const hoverPanel = (
    <div
      className={`product-hover-panel${isPanelOpen ? " product-hover-panel--open" : ""}`}
      aria-hidden="true"
      ref={panelRef}
      style={panelStyle}
    >
      <p className="warranty">Loại: {monitor.type}</p>
      {monitor.specs.length > 0 ? (
        <ul>
          {monitor.specs.map((spec) => (
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
      className={`product-card monitor-product-card${isPanelOpen ? " product-card--panel-open" : ""}`}
    >
      <Link
        href={`/${monitor.slug}`}
        className="product-media"
        onMouseEnter={() => setIsPanelOpen(true)}
        onMouseLeave={() => setIsPanelOpen(false)}
        onMouseMove={handlePointerMove}
        onPointerEnter={() => setIsPanelOpen(true)}
        onPointerLeave={() => setIsPanelOpen(false)}
        onPointerMove={handlePointerMove}
        role="img"
        aria-label={monitor.name}
        style={{ backgroundImage: `url(${monitor.image})` }}
      >
        {monitor.discount ? (
          <span className="discount-badge">{monitor.discount}</span>
        ) : null}
      </Link>
      <div className="product-body">
        <h3>
          <Link href={`/${monitor.slug}`}>{monitor.name}</Link>
        </h3>
        <div className="price-row">
          <strong>{monitor.price || "Liên hệ"}</strong>
          {monitor.oldPrice ? <span>{monitor.oldPrice}</span> : null}
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
