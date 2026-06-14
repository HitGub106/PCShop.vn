"use client";

import { useEffect, useRef, useState } from "react";

import { cartItemAddedEvent } from "./lib/cartStorage";

type CartItemAddedDetail = {
  itemName?: string;
};

export function CartToast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function handleCartItemAdded(event: Event) {
      const detail = (event as CustomEvent<CartItemAddedDetail>).detail;
      const itemName = detail?.itemName ?? "Sản phẩm";

      setMessage(`Đã thêm ${itemName} vào giỏ hàng.`);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setMessage("");
      }, 2200);
    }

    window.addEventListener(cartItemAddedEvent, handleCartItemAdded);

    return () => {
      window.removeEventListener(cartItemAddedEvent, handleCartItemAdded);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`cart-toast${message ? " cart-toast--show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
